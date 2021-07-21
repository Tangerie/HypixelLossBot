"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetHypixelApi = exports.RespondToInteraction = void 0;
var hypixel_api_reborn_1 = __importDefault(require("hypixel-api-reborn"));
var RespondToInteraction = function (client, interaction, data, type) {
    if (type === void 0) { type = 4; }
    client.api.interactions(interaction.id, interaction.token).callback.post({ data: {
            type: type,
            data: data
        } });
};
exports.RespondToInteraction = RespondToInteraction;
var GetHypixelApi = function () {
    var _a;
    return new hypixel_api_reborn_1.default.Client((_a = process.env.HYPIXEL_TOKEN) !== null && _a !== void 0 ? _a : "");
};
exports.GetHypixelApi = GetHypixelApi;
