import { Client, MessageEmbed } from "discord.js";
import GetDataManager from "../lib/data";
import { GetHypixelApi, RespondToInteraction } from "../lib/util";

module.exports = {
    name: "stats",
    description: "Get your bedwars stats",
    options: [],
    async execute(args: any, interaction: any, client: Client) {
        const hypixel = GetHypixelApi();

        const username = GetDataManager().getUsernameFromId(interaction.member.user.id);

        if(!username) {
            RespondToInteraction(client, interaction, {
                embeds: [
                    {
                        title: `Minecraft Account Not Linked`,
                        description: "Run /link <username> to link",
                        type: "rich",
                        color: 15158332
                    }
                ]
            })
            return;
        }

        const player = await hypixel.getPlayer(username, {
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
        
        RespondToInteraction(client, interaction, {
            embeds: [
                {
                    title: `${player.nickname}'s Bedwars Stats`,
                    type: "rich",
                    color: 15844367,
                    fields: [
                        {
                            name: "Wins",
                            value: player.stats?.bedwars?.wins.toString(),
                            inline: true,
                        },
                        {
                            name: "Losses",
                            value: player.stats?.bedwars?.losses.toString(),
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
                }
            ]
        })
    }
}