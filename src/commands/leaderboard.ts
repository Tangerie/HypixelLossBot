import { Client } from "discord.js";
import { DESTRUCTION } from "dns";
import { BedWars } from "hypixel-api-reborn";
import GetDataManager, { StatRecord } from "../lib/data";
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

        const getScore = (stat : StatRecord) => {
            return stat.losses / (stat.wins + stat.losses);
        }

        const createLines = async (entries : [string, StatRecord][]) => {
            let placement = 0;
            return await Promise.all(entries.map(async ([user, stat]) => {
                const user_id = GetDataManager().getUser(user);
                if(!user_id) return;
    
                const disUser = await client.users.fetch(user_id).catch(() => {});
    
                if(!disUser) return;
    
                placement++;
                return `**${placement}**. ${disUser.username}#${disUser.discriminator} - ${Math.floor(getScore(stat) * 100)}% Lost [${stat.losses}/${stat.losses + stat.wins}]`;
            }));
        }

        const entries = [...period.users.entries()];
        entries.sort(([aUser, aStat], [bUser, bStat]) => {
            return getScore(bStat) - getScore(aStat);
        });  
        
        const validEntries = entries.filter(x => x[1].losses + x[1].wins >= 10);
        const pendingEntries = entries.filter(x => x[1].losses + x[1].wins < 10 && x[1].losses + x[1].wins > 0);

        let desc : (string | undefined)[] = [];

        if(validEntries.length > 0) {
            desc = await createLines(validEntries);
        }

        if(pendingEntries.length > 0) {
            desc = [...desc, "\n**Unranked**", ...await createLines(pendingEntries)];
        }
        
        desc = desc.filter(x => x);

        RespondToInteraction(client, interaction, {
            embeds: [
                {
                    title: `Loserboard`,
                    description: desc.join("\n") + "\n\n*At least 10 games required to be ranked*",
                    type: "rich",
                    color: 15844367
                }
            ]
        });
    }
}