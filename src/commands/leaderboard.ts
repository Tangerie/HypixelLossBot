import { Client } from "discord.js";
import GetDataManager from "../lib/data";
import { RespondToInteraction } from "../lib/util";

module.exports = {
    name: "leaderboard",
    description: "Get the (loser) board",
    options: [],
    
    async execute(args: any, interaction: any, client: Client) {
        const period = GetDataManager().getRecordingPeriod(interaction.guild_id);

        if(!period || [...period.users.entries()].length == 0) {
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

        let placement = 0;

        let desc = await Promise.all(entries.map(async ([user, stat]) => {
            const user_id = GetDataManager().getUser(user);

            if(!user_id) return;

            const disUser = await client.users.fetch(user_id).catch(() => {});

            if(!disUser) return;

            placement++;
            return `**${placement}**. ${disUser.username}#${disUser.discriminator} - ${stat.losses} Loss`;
        }));

        desc = desc.filter(x => x);

        RespondToInteraction(client, interaction, {
            embeds: [
                {
                    title: `Loserboard`,
                    description: desc.join("\n"),
                    type: "rich",
                    color: 3066993
                }
            ]
        });
    }
}