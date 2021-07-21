import { Client } from "discord.js";
import GetDataManager from "../lib/data";
import { RespondToInteraction } from "../lib/util";

module.exports = {
    name: "notify",
    description: "[ADMIN] Set the channel for notifications",
    admin: true,
    options: [
        {
            name: 'channel',
            description: 'Channel for loss notifications',
            required: true,
            type: 7
        }
    ],
    
    async execute(args: any, interaction: any, client: Client) {

        const chan = client.channels.cache.get(args.channel);
        if(!chan || chan.type != "text") {
            RespondToInteraction(client, interaction, {
                embeds: [
                    {
                        title: `Invalid Text Channel`,
                        type: "rich",
                        color: 15158332
                    }
                ]
            });
            return;
        }

        //const guild = client.guilds.cache.get(interaction.guild_id);

        const dMan = GetDataManager();

        dMan.setNotifyChannel(interaction.guild_id, chan.id);

        RespondToInteraction(client, interaction, {
            embeds: [
                {
                    title: `Registered For Notifications`,
                    type: "rich",
                    color: 3066993
                }
            ]
        });
    }
}