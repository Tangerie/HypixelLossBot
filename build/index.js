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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var insulter = require('insult');
var discord_js_1 = __importDefault(require("discord.js"));
var fs_1 = __importDefault(require("fs"));
var data_1 = __importDefault(require("./lib/data"));
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
    return __awaiter(this, void 0, void 0, function () {
        var commandFiles, commandFiles_1, commandFiles_1_1, file, command, _a, _b, guild, e_1_1;
        var e_2, _c, e_1, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    commandFiles = fs_1.default.readdirSync(__dirname + "/commands").filter(function (file) { return file.endsWith('.js'); });
                    try {
                        for (commandFiles_1 = __values(commandFiles), commandFiles_1_1 = commandFiles_1.next(); !commandFiles_1_1.done; commandFiles_1_1 = commandFiles_1.next()) {
                            file = commandFiles_1_1.value;
                            command = require(__dirname + "/commands/" + file);
                            clientCommands.set(command.name.toLowerCase(), command);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (commandFiles_1_1 && !commandFiles_1_1.done && (_c = commandFiles_1.return)) _c.call(commandFiles_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 6, 7, 8]);
                    _a = __values(client.guilds.cache.map(function (guild) { return guild; })), _b = _a.next();
                    _e.label = 2;
                case 2:
                    if (!!_b.done) return [3 /*break*/, 5];
                    guild = _b.value;
                    return [4 /*yield*/, registerCommandsForGuild(guild.id)];
                case 3:
                    _e.sent();
                    console.log("[" + guild.name + "] Slash Commands Registered");
                    _e.label = 4;
                case 4:
                    _b = _a.next();
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 8];
                case 6:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 8];
                case 7:
                    try {
                        if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 8:
                    console.log("Bot Loaded");
                    return [2 /*return*/];
            }
        });
    });
}
function registerCommandsForGuild(guildId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, cmd, e_3_1;
        var e_3, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, 6, 7]);
                    _a = __values(clientCommands.array()), _b = _a.next();
                    _d.label = 1;
                case 1:
                    if (!!_b.done) return [3 /*break*/, 4];
                    cmd = _b.value;
                    return [4 /*yield*/, registerSingleCommand(guildId, {
                            data: {
                                name: cmd.name,
                                description: cmd.description,
                                options: cmd.options
                            }
                        })];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3:
                    _b = _a.next();
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 7];
                case 5:
                    e_3_1 = _d.sent();
                    e_3 = { error: e_3_1 };
                    return [3 /*break*/, 7];
                case 6:
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_3) throw e_3.error; }
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function registerSingleCommand(guildId, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                /* @ts-ignore */
                return [4 /*yield*/, client.api.applications(client.user.id).guilds(guildId).commands.post(data)];
                case 1:
                    /* @ts-ignore */
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function unpackInteraction(interaction) {
    var e_4, _a;
    var _b = interaction.data, name = _b.name, options = _b.options;
    var cmd = name.toLowerCase();
    var args = {};
    if (options) {
        try {
            for (var options_1 = __values(options), options_1_1 = options_1.next(); !options_1_1.done; options_1_1 = options_1.next()) {
                var option = options_1_1.value;
                var name_1 = option.name, value = option.value;
                args[name_1] = value;
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (options_1_1 && !options_1_1.done && (_a = options_1.return)) _a.call(options_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
    }
    return {
        cmd: cmd,
        args: args
    };
}
function onInteractionCreate(interaction) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, cmd, args, command;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
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
                    command = clientCommands.get(cmd);
                    if (command.admin) {
                        //ADMIN CHECK
                        if (interaction.member.user.id != process.env.MY_ID) {
                            util_1.RespondToInteraction(client, interaction, {
                                content: "",
                                embeds: [
                                    {
                                        title: "Permissions Error",
                                        type: "rich",
                                        description: "Must be admin",
                                        color: 15158332 //RED
                                    }
                                ]
                            });
                            return [2 /*return*/];
                        }
                    }
                    return [4 /*yield*/, clientCommands.get(cmd).execute(args, interaction, client)];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var lastCycleStats = new Map();
//Max requests = 120/min
var MAX_REQUESTS_PER_MIN = 120;
var INTERVAL_SEC = 20;
var MAX_REQUESTS_PER_CYCLE = (INTERVAL_SEC / 60) * MAX_REQUESTS_PER_MIN;
setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
    var requestsMade, _a, _b, _c, username, discordId, player, lastStats, _d, _e, _f, guildId, channelId, guild, member, chan, e_5_1, e_6_1;
    var e_6, _g, e_5, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                if (!client || !client.readyAt)
                    return [2 /*return*/];
                requestsMade = 0;
                _j.label = 1;
            case 1:
                _j.trys.push([1, 14, 15, 16]);
                _a = __values(data_1.default().getUsers().entries()), _b = _a.next();
                _j.label = 2;
            case 2:
                if (!!_b.done) return [3 /*break*/, 13];
                _c = __read(_b.value, 2), username = _c[0], discordId = _c[1];
                if (requestsMade > MAX_REQUESTS_PER_CYCLE)
                    return [2 /*return*/];
                return [4 /*yield*/, util_1.GetHypixelApi().getPlayer(username, {
                        noCacheCheck: true,
                        noCaching: true
                    }).catch(function () { })];
            case 3:
                player = _j.sent();
                requestsMade++;
                if (!player) {
                    //remove it and msg player
                    return [2 /*return*/];
                }
                else if (!player.stats || !player.stats.bedwars) {
                    return [2 /*return*/];
                }
                if (!lastCycleStats.has(username)) return [3 /*break*/, 11];
                lastStats = lastCycleStats.get(username);
                if (!((lastStats === null || lastStats === void 0 ? void 0 : lastStats.finalDeaths) != player.stats.bedwars.finalDeaths)) return [3 /*break*/, 11];
                _j.label = 4;
            case 4:
                _j.trys.push([4, 9, 10, 11]);
                _d = (e_5 = void 0, __values(data_1.default().getAllNotify().entries())), _e = _d.next();
                _j.label = 5;
            case 5:
                if (!!_e.done) return [3 /*break*/, 8];
                _f = __read(_e.value, 2), guildId = _f[0], channelId = _f[1];
                guild = client.guilds.cache.get(guildId);
                if (!guild)
                    return [3 /*break*/, 7];
                return [4 /*yield*/, guild.members.fetch(discordId)];
            case 6:
                member = _j.sent();
                if (member) {
                    chan = guild.channels.cache.get(channelId);
                    if (!chan)
                        return [3 /*break*/, 7];
                    /* @ts-ignore */
                    chan.send({
                        embed: {
                            title: member.displayName + " (" + member.user.username + "#" + member.user.discriminator + ") Lost a Bedwars match",
                            description: "This is for you: " + insulter.Insult(),
                            type: "rich",
                            color: 15158332,
                            fields: [
                                {
                                    name: "Win streak lost",
                                    value: player.stats.bedwars.winstreak
                                }
                            ]
                        }
                    });
                }
                _j.label = 7;
            case 7:
                _e = _d.next();
                return [3 /*break*/, 5];
            case 8: return [3 /*break*/, 11];
            case 9:
                e_5_1 = _j.sent();
                e_5 = { error: e_5_1 };
                return [3 /*break*/, 11];
            case 10:
                try {
                    if (_e && !_e.done && (_h = _d.return)) _h.call(_d);
                }
                finally { if (e_5) throw e_5.error; }
                return [7 /*endfinally*/];
            case 11:
                lastCycleStats.set(username, player.stats.bedwars);
                _j.label = 12;
            case 12:
                _b = _a.next();
                return [3 /*break*/, 2];
            case 13: return [3 /*break*/, 16];
            case 14:
                e_6_1 = _j.sent();
                e_6 = { error: e_6_1 };
                return [3 /*break*/, 16];
            case 15:
                try {
                    if (_b && !_b.done && (_g = _a.return)) _g.call(_a);
                }
                finally { if (e_6) throw e_6.error; }
                return [7 /*endfinally*/];
            case 16: return [2 /*return*/];
        }
    });
}); }, INTERVAL_SEC * 1000);
