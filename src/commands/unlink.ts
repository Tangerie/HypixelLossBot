import { Client, MessageEmbed } from "discord.js";
import GetDataManager from "../lib/data";
import { GetHypixelApi, RespondToInteraction } from "../lib/util";

module.exports = {
    name: "unlink",
    description: "Unlink your MC and Discord account",
    options: [],
    async execute(args: any, interaction: any, client: Client) {


        //Link Profile
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

        GetDataManager().removeUsername(username);

        RespondToInteraction(client, interaction, {
            embeds: [
                {
                    title: `Profile Unlinked Sucessfully`,
                    type: "rich",
                    color: 3066993
                }
            ]
        })
    }
}