"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../lib/util");
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
    execute: function (args, interaction, client) {
        console.log(args);
        util_1.RespondToInteraction(client, interaction, {
            content: "Profile Found Successfully",
            embeds: [
                {
                    title: "Ultimate_Hoe's Profile",
                    type: "rich",
                    fields: [
                        {
                            "name": "Nickname",
                            "value": "Hoe"
                        },
                        {
                            "name": "Bedwars Win Streak",
                            "value": "10"
                        }
                    ]
                }
            ]
        });
    }
};
