import { Client } from "discord.js";
import GetDataManager from "../lib/data";
import { RespondToInteraction } from "../lib/util";

module.exports = {
    name: "unnotify",
    description: "[ADMIN] Unset the channel for notifications",
    admin: true,
    options: [],
    
    async execute(args: any, interaction: any, client: Client) {

        const channel_id = GetDataManager().getNotifyChannel(interaction.guild_id);

        if(!channel_id) {
            RespondToInteraction(client, interaction, {
                embeds: [
                    {
                        title: `No notify channel linked yet`,
                        type: "rich",
                        color: 15158332
                    }
                ]
            });
            return;
        }

        //const guild = client.guilds.cache.get(interaction.guild_id);

        const dMan = GetDataManager();

        dMan.removeNotifyChannel(interaction.guild_id);

        RespondToInteraction(client, interaction, {
            embeds: [
                {
                    title: `Successfuly unlinked notify channel`,
                    type: "rich",
                    color: 3066993
                }
            ]
        });
    }
}