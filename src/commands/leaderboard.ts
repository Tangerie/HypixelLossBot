import { Client } from "discord.js";
import GetDataManager from "../lib/data";
import { RespondToInteraction } from "../lib/util";

module.exports = {
    name: "leaderboard",
    description: "Get the (loser) board",
    options: [],
    
    async execute(args: any, interaction: any, client: Client) {

        const period = GetDataManager().getRecordingPeriod(interaction.guild_id);

        if(!period) {
            RespondToInteraction(client, interaction, {
                embeds: [
                    {
                        title: `Local recording not started`,
                        type: "rich",
                        color: 15158332
                    }
                ]
            })
            return;
        }
        const entries = [...period.users.entries()];
        entries.sort(([aUser, aStat], [bUser, bStat]) => {
            return bStat.losses - aStat.losses;
        });

        console.log(entries);

        RespondToInteraction(client, interaction, {
            embeds: [
                {
                    title: `Leadboard Coming`,
                    type: "rich",
                    color: 3066993
                }
            ]
        });
    }
}