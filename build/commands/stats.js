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
var data_1 = __importDefault(require("../lib/data"));
var util_1 = require("../lib/util");
module.exports = {
    name: "stats",
    description: "Get your bedwars stats",
    options: [],
    execute: function (args, interaction, client) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        return __awaiter(this, void 0, void 0, function () {
            var hypixel, username, player;
            return __generator(this, function (_u) {
                switch (_u.label) {
                    case 0:
                        hypixel = util_1.GetHypixelApi();
                        username = data_1.default().getUsernameFromId(interaction.member.user.id);
                        if (!username) {
                            util_1.RespondToInteraction(client, interaction, {
                                embeds: [
                                    {
                                        title: "Minecraft Account Not Linked",
                                        description: "Run /link <username> to link",
                                        type: "rich",
                                        color: 15158332
                                    }
                                ]
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, hypixel.getPlayer(username, {
                                noCacheCheck: true,
                                noCaching: true
                            }).catch(function (err) { return undefined; })];
                    case 1:
                        player = _u.sent();
                        if (!player) {
                            util_1.RespondToInteraction(client, interaction, {
                                embeds: [
                                    {
                                        title: "Profile Not Found",
                                        type: "rich",
                                        color: 15158332
                                    }
                                ]
                            });
                            return [2 /*return*/];
                        }
                        util_1.RespondToInteraction(client, interaction, {
                            embeds: [
                                {
                                    title: player.nickname + "'s Bedwars Stats",
                                    type: "rich",
                                    color: 15844367,
                                    fields: [
                                        {
                                            name: "Wins",
                                            value: (_b = (_a = player.stats) === null || _a === void 0 ? void 0 : _a.bedwars) === null || _b === void 0 ? void 0 : _b.wins.toString(),
                                            inline: true,
                                        },
                                        {
                                            name: "Losses",
                                            value: (_d = (_c = player.stats) === null || _c === void 0 ? void 0 : _c.bedwars) === null || _d === void 0 ? void 0 : _d.losses.toString(),
                                            inline: true,
                                        },
                                        {
                                            name: "Win/Loss",
                                            value: (_f = (_e = player.stats) === null || _e === void 0 ? void 0 : _e.bedwars) === null || _f === void 0 ? void 0 : _f.WLRatio.toString(),
                                            inline: true,
                                        },
                                        {
                                            name: "Kills",
                                            value: (_h = (_g = player.stats) === null || _g === void 0 ? void 0 : _g.bedwars) === null || _h === void 0 ? void 0 : _h.kills.toString(),
                                            inline: true,
                                        },
                                        {
                                            name: "Deaths",
                                            value: (_k = (_j = player.stats) === null || _j === void 0 ? void 0 : _j.bedwars) === null || _k === void 0 ? void 0 : _k.deaths.toString(),
                                            inline: true,
                                        },
                                        {
                                            name: "Kill/Death",
                                            value: (_m = (_l = player.stats) === null || _l === void 0 ? void 0 : _l.bedwars) === null || _m === void 0 ? void 0 : _m.KDRatio.toString(),
                                            inline: true,
                                        },
                                        {
                                            name: "Final Kills",
                                            value: (_p = (_o = player.stats) === null || _o === void 0 ? void 0 : _o.bedwars) === null || _p === void 0 ? void 0 : _p.finalKills.toString(),
                                            inline: true,
                                        },
                                        {
                                            name: "Final Deaths",
                                            value: (_r = (_q = player.stats) === null || _q === void 0 ? void 0 : _q.bedwars) === null || _r === void 0 ? void 0 : _r.finalDeaths.toString(),
                                            inline: true,
                                        },
                                        {
                                            name: "Final Kill/Death",
                                            value: (_t = (_s = player.stats) === null || _s === void 0 ? void 0 : _s.bedwars) === null || _t === void 0 ? void 0 : _t.finalKDRatio.toString(),
                                            inline: true,
                                        },
                                    ]
                                }
                            ]
                        });
                        return [2 /*return*/];
                }
            });
        });
    }
};
