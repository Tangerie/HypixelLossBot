"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var DATA_PATH = "data/";
var USER_FILE = DATA_PATH + "users.json";
var NOTIFY_FILE = DATA_PATH + "notify.json";
var DataManager = /** @class */ (function () {
    function DataManager() {
        this.users = util_1.LoadMapToJson(USER_FILE);
        this.notifyChannels = util_1.LoadMapToJson(NOTIFY_FILE);
    }
    DataManager.prototype.setUserLink = function (username, id) {
        this.users.set(username, id);
        this.saveUserFile();
    };
    DataManager.prototype.getUsers = function () {
        return new Map(this.users);
    };
    DataManager.prototype.getUsernameFromId = function (id) {
        var e_1, _a;
        try {
            for (var _b = __values(this.users.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                if (value === id) {
                    return key;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return undefined;
    };
    DataManager.prototype.saveUserFile = function () {
        util_1.SaveMapToJson(USER_FILE, this.users);
    };
    DataManager.prototype.setNotifyChannel = function (guild, channel) {
        this.notifyChannels.set(guild, channel);
        this.saveNotifyFile();
    };
    DataManager.prototype.saveNotifyFile = function () {
        util_1.SaveMapToJson(NOTIFY_FILE, this.notifyChannels);
    };
    DataManager.prototype.getAllNotify = function () {
        return new Map(this.notifyChannels);
    };
    return DataManager;
}());
var manager = new DataManager();
function GetDataManager() {
    return manager;
}
exports.default = GetDataManager;
