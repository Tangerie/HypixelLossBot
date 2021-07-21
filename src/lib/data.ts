import fs from 'fs';
import { LoadMapToJson, SaveMapToJson } from './util';

const DATA_PATH = "data/";
const USER_FILE = DATA_PATH + "users.json";
const NOTIFY_FILE = DATA_PATH + "notify.json";

class DataManager {

    //username to id
    private users : Map<string, string>;
    private notifyChannels : Map<string, string>;

    constructor() { 
        this.users = LoadMapToJson<string, string>(USER_FILE);
        this.notifyChannels = LoadMapToJson<string, string>(NOTIFY_FILE);
    }

    public setUserLink(username : string, id : string) {
        this.users.set(username, id);
        this.saveUserFile();
    }

    public getUsers() {
        return new Map(this.users);
    }

    public getUsernameFromId(id : string) : string | undefined {
        for (let [key, value] of this.users.entries()) {
            if (value === id) {
                return key;
            }
        }
        
        return undefined;
    }

    private saveUserFile() {
        SaveMapToJson(USER_FILE, this.users);
    }

    public setNotifyChannel(guild : string, channel : string) {
        this.notifyChannels.set(guild, channel);
        this.saveNotifyFile();
    }

    private saveNotifyFile() {
        SaveMapToJson(NOTIFY_FILE, this.notifyChannels);
    }

    public getAllNotify() {
        return new Map(this.notifyChannels);
    }
}

const manager = new DataManager();

export default function GetDataManager() {
    return manager;
}