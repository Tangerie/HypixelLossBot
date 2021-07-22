import HypixelAPI, { Arcade, ArenaBrawl, BedWars, BlitzSurvivalGames, BuildBattle, CopsAndCrims, Duels, MegaWalls, MurderMystery, Player, SkyWars, SmashHeroes, SpeedUHC, TNTGames, UHC, VampireZ } from 'hypixel-api-reborn';
import { EventEmitter } from 'stream';
import GetDataManager from '../lib/data';

const MAX_REQUESTS_PER_MIN = 100;
const INTERVAL_SEC = 20;
const MAX_REQUESTS_PER_CYCLE = (INTERVAL_SEC / 60) * MAX_REQUESTS_PER_MIN;

export interface PlayerStats {
	skywars?: SkyWars,
	bedwars?: BedWars,
	uhc?: UHC,
	speeduhc?: SpeedUHC,
	murdermystery?: MurderMystery,
	duels?: Duels,
	buildbattle?: BuildBattle,
	megawalls?: MegaWalls,
	copsandcrims?: CopsAndCrims,
	tntgames?: TNTGames,
	smashheroes?: SmashHeroes,
	vampirez?: VampireZ,
	blitzsg?: BlitzSurvivalGames,
	arena?: ArenaBrawl,
	arcade?: Arcade
};

export interface BedwarsWinLoseEvent {
    last: BedWars,
    cur: BedWars,
    player: Player
}

class HypixelClient extends EventEmitter {
    private api;
    private lastPlayerStats : Map<string, PlayerStats>;
    private apiOptions : any;
    constructor() {
        super();
        this.api = new HypixelAPI.Client(process.env.HYPIXEL_TOKEN ?? "");
        this.lastPlayerStats = new Map<string, PlayerStats>();
        this.apiOptions = {
            noCacheCheck: true,
            noCaching: true
        };

        setInterval(() => this.checkLoop(), INTERVAL_SEC * 1000);
    }

    public getApi() {
        return this.api;
    }

    public async getPlayer(username : string) {
        return await this.api.getPlayer(username, this.apiOptions).catch(()=>{});
    }

    private async checkLoop() {
        let requestsMade = 0;

        for(const username of GetDataManager().getUsers().keys()) {
            if(requestsMade > MAX_REQUESTS_PER_CYCLE) return;
            const player = await this.getPlayer(username);

            if(!player || !player.stats?.bedwars) continue;

            if(this.lastPlayerStats.has(username)) {
                const lastStats = this.lastPlayerStats.get(username);
                if(!lastStats?.bedwars) continue;

                if(lastStats.bedwars.losses != player.stats.bedwars.losses) {
                    this.emit("bedwars.loss", {
                        last: lastStats.bedwars,
                        cur: player.stats.bedwars,
                        player: player
                    });
                }

                if(lastStats.bedwars.wins != player.stats.bedwars.wins) {
                    this.emit("bedwars.win", {
                        last: lastStats.bedwars,
                        cur: player.stats.bedwars,
                        player: player
                    });
                }
            }

            this.lastPlayerStats.set(username, player.stats);
        }
    }

}

const client = new HypixelClient();

export default function getHypixelClient() {
    return client;
}