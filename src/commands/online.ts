import { Client, TextChannel } from "discord.js";
import getHypixelClient from "../hypixel/client";
import GetDataManager from "../lib/data";
import { RespondToInteraction, UpdateResponseMsg } from "../lib/util";

module.exports = {
    name: "online",
    description: "Check whos online",
    admin: false,
    options: [],
    
    async execute(args: any, interaction: any, client: Client) {
        const lines : string[] = [];

        //Send waiting message
        RespondToInteraction(client, interaction, {}, 5);
    
        for(const [user, id] of GetDataManager().getUsers()) {
            const disUser = await client.users.fetch(id).catch(() => {});

            const status = await getHypixelClient().getOnlineStatus(user);
            if(!status) continue;

            if(!disUser || !status.online) continue;

            lines.push(`**${disUser.username}#${disUser.discriminator}** ${status.game?.name}`);
        }

        UpdateResponseMsg(client, interaction, {
            embeds: [
                {
                    title: `${lines.length} Currently Online`,
                    description: lines.join("\n"),
                    type: "rich",
                    color: 15844367
                }
            ]
        });
    }
}