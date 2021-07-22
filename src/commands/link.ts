import { Client, MessageEmbed } from "discord.js";
import getHypixelClient from "../hypixel/client";
import GetDataManager from "../lib/data";
import { RespondToInteraction } from "../lib/util";

module.exports = {
    name: "link",
    description: "Link your Discord ID to your MC Username",
    options: [
        {
            name: 'username',
            description: 'Minecraft Username',
            required: true,
            type: 3
        }
    ],
    async execute(args: any, interaction: any, client: Client) {
        const hypixel = getHypixelClient();

        const player = await hypixel.getApi().getPlayer(args.username).catch(err => undefined);

        if(player == undefined) {
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

        //Link Profile
        GetDataManager().setUserLink(player.nickname, interaction.member.user.id);
        RespondToInteraction(client, interaction, {
            embeds: [
                {
                    title: `Profile Linked Sucessfully`,
                    type: "rich",
                    fields: [
                        {
                            "name": "Username",
                            "value": player.nickname
                        },
                        {
                            "name": "Bedwars Win Streak",
                            "value": player.stats?.bedwars?.winstreak
                        }
                    ],
                    color: 3066993
                }
            ]
        })
    }
}