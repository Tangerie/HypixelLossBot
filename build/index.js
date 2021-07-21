"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var discord_js_1 = __importDefault(require("discord.js"));
var fs_1 = __importDefault(require("fs"));
var util_1 = require("./lib/util");
//https://discord.com/oauth2/authorize?client_id=867366033572888608&scope=bot+applications.commands
//#region token checks
if (process.env.DISCORD_TOKEN == undefined) {
    console.error("No Discord Token Provided");
    process.exit();
}
if (process.env.HYPIXEL_TOKEN == undefined) {
    console.error("No Hypixel API Token Provided");
    process.exit();
}
//#endregion
var hypixelClient = util_1.GetHypixelApi();
var client = new discord_js_1.default.Client();
//#region events
client.once('ready', onBotReady);
/* @ts-ignore */
client.ws.on('INTERACTION_CREATE', onInteractionCreate);
//#endregion
//#region start
client.login(process.env.DISCORD_TOKEN);
//#endregion
var clientCommands = new discord_js_1.default.Collection();
function onBotReady() {
    console.log('Client Ready');
    var commandFiles = fs_1.default.readdirSync(__dirname + "/commands").filter(function (file) { return file.endsWith('.js'); });
    for (var _i = 0, commandFiles_1 = commandFiles; _i < commandFiles_1.length; _i++) {
        var file = commandFiles_1[_i];
        var command = require(__dirname + "/commands/" + file);
        clientCommands.set(command.name.toLowerCase(), command);
    }
    for (var _a = 0, _b = client.guilds.cache.map(function (guild) { return guild; }); _a < _b.length; _a++) {
        var guild = _b[_a];
        registerCommandsForGuild(guild.id);
        console.log("[" + guild.name + "] Slash Commands Registered");
    }
}
function registerCommandsForGuild(guildId) {
    for (var _i = 0, _a = clientCommands.array(); _i < _a.length; _i++) {
        var cmd = _a[_i];
        registerSingleCommand(guildId, {
            data: {
                name: cmd.name,
                description: cmd.description,
                options: cmd.options
            }
        });
    }
}
function registerSingleCommand(guildId, data) {
    /* @ts-ignore */
    client.api.applications(client.user.id).guilds(guildId).commands.post(data);
}
function unpackInteraction(interaction) {
    var _a = interaction.data, name = _a.name, options = _a.options;
    var cmd = name.toLowerCase();
    var args = {};
    if (options) {
        for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
            var option = options_1[_i];
            var name_1 = option.name, value = option.value;
            args[name_1] = value;
        }
    }
    return {
        cmd: cmd,
        args: args
    };
}
function onInteractionCreate(interaction) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, cmd, args;
        return __generator(this, function (_b) {
            console.log("Interaction Recieved");
            _a = unpackInteraction(interaction), cmd = _a.cmd, args = _a.args;
            if (!clientCommands.has(cmd)) {
                util_1.RespondToInteraction(client, interaction, {
                    content: "",
                    embeds: [
                        {
                            title: "Error",
                            type: "rich",
                            description: "Invalid Command",
                            color: 15158332 //RED
                        }
                    ]
                });
                return [2 /*return*/];
            }
            clientCommands.get(cmd).execute(args, interaction, client);
            return [2 /*return*/];
        });
    });
}
