import { Client, MessageEmbed } from "discord.js";
import getHypixelClient from "../hypixel/client";
import GetDataManager from "../lib/data";
import { RespondToInteraction } from "../lib/util";

module.exports = {
    name: "stats",
    description: "Get your bedwars stats",
    options: [
        {
            name: 'user',
            description: 'Get the stats of another user',
            required: false,
            type: 6
        }
    ],
    async execute(args: any, interaction: any, client: Client) {
        const hypixel = getHypixelClient();

        if(args.user) {
            const user = await client.users.fetch(args.user).catch(() => {});
            if(!user || user.bot) {
                RespondToInteraction(client, interaction, {
                    embeds: [
                        {
                            title:"Invalid User",
                            description: "They must not be a bot",
                            type: "rich",
                            color: 15158332
                        }
                    ]
                })
                return;
            }
        }

        const username = GetDataManager().getUsernameFromId(args.user ?? interaction.member.user.id);

        if(!username) {
            RespondToInteraction(client, interaction, {
                embeds: [
                    {
                        title: args.user ? "No Minecraft account linked to user" : "Minecraft Account Not Linked",
                        description: args.user ? undefined : "Run /link <username> to link",
                        type: "rich",
                        color: 15158332
                    }
                ]
            })
            return;
        }

        const player = await hypixel.getApi().getPlayer(username, {
			noCacheCheck: true,
			noCaching: true
		}).catch(err => undefined);
        if(!player) {
            RespondToInteraction(client, interaction, {
                embeds: [
                    {
                        title: `Profile Not Found`,
                        type: "rich",
                        color: 15158332
                    }
                ]
            })
            return;
        }

        const embeds = [{
            title: `${player.nickname}'s All-Time Bedwars Stats`,
            type: "rich",
            color: 15844367,
            fields: [
                {
                    name: "Wins",
                    value: ((player.stats?.bedwars?.wins || 0) - (player.stats?.bedwars?.["4v4"].wins || 0)).toString(),
                    inline: true,
                },
                {
                    name: "Losses",
                    value: ((player.stats?.bedwars?.losses || 0) - (player.stats?.bedwars?.["4v4"].losses || 0)).toString(),
                    inline: true,
                },
                {
                    name: "Win/Loss",
                    value: player.stats?.bedwars?.WLRatio.toString(),
                    inline: true,
                },
                {
                    name: "Kills",
                    value: player.stats?.bedwars?.kills.toString(),
                    inline: true,
                },
                {
                    name: "Deaths",
                    value: player.stats?.bedwars?.deaths.toString(),
                    inline: true,
                },
                {
                    name: "Kill/Death",
                    value: player.stats?.bedwars?.KDRatio.toString(),
                    inline: true,
                },
                {
                    name: "Final Kills",
                    value: player.stats?.bedwars?.finalKills.toString(),
                    inline: true,
                },
                {
                    name: "Final Deaths",
                    value: player.stats?.bedwars?.finalDeaths.toString(),
                    inline: true,
                },
                {
                    name: "Final Kill/Death",
                    value: player.stats?.bedwars?.finalKDRatio.toString(),
                    inline: true,
                },
                
            ]
        }];

        const period = GetDataManager().getRecordingPeriod(interaction.guild_id);

        if(period) {
            const stat = period.users.get(player.nickname);
            if(stat) {
                embeds.push({
                    title: `${player.nickname}'s Recent Bedwars Stats`,
                    type: "rich",
                    color: 15844367,
                    fields: [
                        {
                            name: "Wins",
                            value: stat.wins.toString(),
                            inline: true,
                        },
                        {
                            name: "Losses",
                            value: stat.losses.toString(),
                            inline: true,
                        },
                        {
                            name: "Win/Loss",
                            value: (stat.losses == 0 ? stat.wins : stat.wins / stat.losses).toString(),
                            inline: true,
                        },
                        {
                            name: "Kills",
                            value: stat.kills.toString(),
                            inline: true,
                        },
                        {
                            name: "Deaths",
                            value: stat.deaths.toString(),
                            inline: true,
                        },
                        {
                            name: "Kill/Death",
                            value: (stat.deaths == 0 ? stat.kills : stat.kills / stat.deaths).toString(),
                            inline: true,
                        },
                        {
                            name: "Final Kills",
                            value:stat.finalKills.toString(),
                            inline: true,
                        },
                        {
                            name: "Final Deaths",
                            value: stat.finalDeaths.toString(),
                            inline: true,
                        },
                        {
                            name: "Final Kill/Death",
                            value: (stat.finalDeaths == 0 ? stat.finalKills : stat.finalKills / stat.finalDeaths).toString(),
                            inline: true,
                        },
                    ]
                })
            }
        }
        
        RespondToInteraction(client, interaction, {
            embeds: embeds
        })
    }
}