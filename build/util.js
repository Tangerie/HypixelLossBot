"use strict";
var respondToInteraction = function (client, interaction, data, type) {
    if (type === void 0) { type = 4; }
    client.api.interactions(interaction.id, interaction.token).callback.post({ data: {
            type: type,
            data: data
        } });
};
module.exports.RespondToInteraction = respondToInteraction;
