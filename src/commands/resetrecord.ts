import { Client } from "discord.js";
import GetDataManager from "../lib/data";
import { RespondToInteraction } from "../lib/util";

module.exports = {
    name: "resetrecord",
    description: "[ADMIN] Reset the recording period",
    admin: true,
    options: [],
    
    async execute(args: any, interaction: any, client: Client) {

        GetDataManager().startRecordingPeriod(interaction.guild_id);

        RespondToInteraction(client, interaction, {
            embeds: [
                {
                    title: `Recording period reset`,
                    type: "rich",
                    color: 3066993
                }
            ]
        });
    }
}