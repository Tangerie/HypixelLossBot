"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveMapToJson = exports.LoadMapToJson = exports.GetHypixelApi = exports.RespondToInteraction = void 0;
var hypixel_api_reborn_1 = __importDefault(require("hypixel-api-reborn"));
var fs_1 = __importDefault(require("fs"));
var RespondToInteraction = function (client, interaction, data, type) {
    if (type === void 0) { type = 4; }
    client.api.interactions(interaction.id, interaction.token).callback.post({ data: {
            type: type,
            data: data
        } });
};
exports.RespondToInteraction = RespondToInteraction;
var hypixel = new hypixel_api_reborn_1.default.Client((_a = process.env.HYPIXEL_TOKEN) !== null && _a !== void 0 ? _a : "");
var GetHypixelApi = function () {
    return hypixel;
};
exports.GetHypixelApi = GetHypixelApi;
function mapReviver(key, value) {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
}
function mapReplacer(key, value) {
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    }
    else {
        return value;
    }
}
function LoadMapToJson(path) {
    if (fs_1.default.existsSync(path)) {
        return JSON.parse(fs_1.default.readFileSync(path, "utf8"), mapReviver);
    }
    return new Map();
}
exports.LoadMapToJson = LoadMapToJson;
function SaveMapToJson(path, map) {
    fs_1.default.writeFileSync(path, JSON.stringify(map, mapReplacer));
}
exports.SaveMapToJson = SaveMapToJson;
