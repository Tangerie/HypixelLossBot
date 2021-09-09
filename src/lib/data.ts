import fs from 'fs';
import { LoadMapToJson, SaveMapToJson } from './util';
import { PlayerStats } from '../hypixel/client';
import { Client } from 'discord.js';
import { BedWars } from 'hypixel-api-reborn';

const DATA_PATH = "data/";
const USER_FILE = DATA_PATH + "users.json";
const NOTIFY_FILE = DATA_PATH + "notify.json";
const STAT_FILE = DATA_PATH + "stats.json";

export interface StatRecord {
    wins : number;
    losses : number;
    kills : number;
    deaths : number;
    finalKills : number;
    finalDeaths : number;
    highestWinStreak : number;
}

interface RecordingPeriod {
    //Per user (by mc usernames)
    users : Map<string, StatRecord>;
    startedOn : Date;
}

class DataManager {

    //username to id
    private users : Map<string, string>;
    private notifyChannels : Map<string, string>;
    
    //Per guild
    private recordingPeriods : Map<string, RecordingPeriod>;

    constructor() { 
        if(!fs.existsSync("data/")) {
            fs.mkdirSync("data");
        }

        this.users = LoadMapToJson<string, string>(USER_FILE);
        this.notifyChannels = LoadMapToJson<string, string>(NOTIFY_FILE);
        this.recordingPeriods = LoadMapToJson<string, RecordingPeriod>(STAT_FILE);
    }

    public setUserLink(username : string, id : string) {
        this.users.set(username, id);
        this.saveUserFile();
    }

    public getUsers() {
        return new Map(this.users);
    }

    public getUser(username : string) {
        return this.users.get(username);
    }

    public getUsernameFromId(id : string) : string | undefined {
        for (let [key, value] of this.users.entries()) {
            if (value === id) {
                return key;
            }
        }
        
        return undefined;
    }

    public removeUsername(username : string) {
        this.users.delete(username);
        this.saveUserFile();
    }

    private saveUserFile() {
        SaveMapToJson(USER_FILE, this.users);
    }

    public setNotifyChannel(guild : string, channel : string) {
        this.notifyChannels.set(guild, channel);
        this.saveNotifyFile();
    }

    public getNotifyChannel(guild : string) {
        return this.notifyChannels.get(guild);
    }

    public removeNotifyChannel(guild : string) {
        this.notifyChannels.delete(guild);
        this.saveNotifyFile();
    }

    private saveNotifyFile() {
        SaveMapToJson(NOTIFY_FILE, this.notifyChannels);
    }

    public getAllNotify() {
        return new Map(this.notifyChannels);
    }

    public getRecordingPeriod(guild : string) {
        return this.recordingPeriods.get(guild);
    }

    private saveRecordingFile() {
        SaveMapToJson(STAT_FILE, this.recordingPeriods);
    }

    public startRecordingPeriod(guild : string) {
        this.recordingPeriods.set(guild, {
            users: new Map<string, StatRecord>(),
            startedOn: new Date()
        });
        this.saveRecordingFile();
    }

    public setRecordingPeriod(guild : string, period : RecordingPeriod) {
        this.recordingPeriods.set(guild, period);
        this.saveRecordingFile();
    }

    public async updatePlayersRecordings(username : string, discordId : string, client : Client, last : BedWars, cur : BedWars) {
        //console.log("Updating player recording for " + username);
        for(const [guild, period] of this.recordingPeriods.entries()) {
            //You need to create the users dumbass
            if(!period.users.has(username)) {
                //if the mc user isnt in the map yet, check if one should be created
                const member = await client.guilds.cache.get(guild)?.members.fetch(discordId).catch(() => {});

                if(!member) continue;
                console.log(`Creating record for ${username} in ${client.guilds.cache.get(guild)?.name}`);
                //User is in guild
                //Create an entry for them under this guild
                period.users.set(username, {
                    deaths: 0,
                    finalDeaths: 0,
                    finalKills: 0,
                    highestWinStreak: 0,
                    kills: 0,
                    losses: 0,
                    wins: 0
                });
            }

            const record = period.users.get(username);
            if(!record || !cur || !last) continue;
            
            record.deaths += cur.deaths - last.deaths;
            record.finalDeaths += cur.finalDeaths - last.finalDeaths;
            record.finalKills += cur.finalKills - last.finalKills;
            record.kills += cur.kills - last.kills;
            record.losses += cur.losses - last.losses;
            record.wins += cur.wins - last.wins;
            
            if(cur.winstreak > record.highestWinStreak) {
                record.highestWinStreak = cur.winstreak;
            }

            period.users.set(username, record);
            this.recordingPeriods.set(guild, period);
        }
        
        this.saveRecordingFile();
    }
}

const manager = new DataManager();

export default function GetDataManager() {
    return manager;
}