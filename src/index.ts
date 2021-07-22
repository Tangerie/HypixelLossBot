require('dotenv').config();
const insulter = require('insult');

import Discord, { Guild } from 'discord.js';
import fs from 'fs';
import { Arcade, ArenaBrawl, BedWars, BlitzSurvivalGames, BuildBattle, CopsAndCrims, Duels, MegaWalls, MurderMystery, SkyWars, SmashHeroes, SpeedUHC, TNTGames, UHC, VampireZ } from 'hypixel-api-reborn';
import GetDataManager from './lib/data';
import { GetHypixelApi, RespondToInteraction } from "./lib/util";


//https://discord.com/oauth2/authorize?client_id=867366033572888608&scope=bot+applications.commands

//Dev: https://discord.com/oauth2/authorize?client_id=867587115976884245&scope=bot+applications.commands



//#region token checks
if(process.env.DISCORD_TOKEN == undefined) {
	console.error("No Discord Token Provided")
	process.exit();
}

if(process.env.HYPIXEL_TOKEN == undefined) {
	console.error("No Hypixel API Token Provided")
	process.exit();
}
//#endregion

const hypixelClient = GetHypixelApi();
const client = new Discord.Client({ ws: { intents: ['GUILDS'] } });

//#region events
client.once('ready', onBotReady);
/* @ts-ignore */
client.ws.on('INTERACTION_CREATE', onInteractionCreate);

client.on("guildCreate", onGuildJoin);
client.on("guildDelete", onGuildLeave);
//#endregion

//#region start
client.login(process.env.DISCORD_TOKEN);
//#endregion

const clientCommands = new Discord.Collection<string, any>();

async function onBotReady() : Promise<void> {
	const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter((file : any) => file.endsWith('.js'));

	for (const file of commandFiles) {
		const command = require(`${__dirname}/commands/${file}`);
		clientCommands.set(command.name.toLowerCase(), command);
	}


	for (const guild of client.guilds.cache.map((guild : any) => guild)) {
		await registerCommandsForGuild(guild.id);
		console.log(`[${guild.name}] Slash Commands Registered`);
	}

	console.log("Bot Loaded");
}

async function registerCommandsForGuild(guildId : string) : Promise<void> {
	await Promise.all(clientCommands.array().map(async cmd => {
		await registerSingleCommand(guildId, {
			data: {
				name: cmd.name,
				description: cmd.description,
				options: cmd.options
			}
		})
	}))
}

async function registerSingleCommand(guildId : string, data : any) {
	/* @ts-ignore */
	await client.api.applications(client.user.id).guilds(guildId).commands.post(data);
}

async function onGuildJoin(guild : Guild) {
	console.log(`[${guild.name}] Slash Commands Registered`);
	await registerCommandsForGuild(guild.id);
}

async function onGuildLeave(guild : Guild) {
	console.log(`Kicked From ${guild.name}`);
	GetDataManager().removeNotifyChannel(guild.id);
}

interface InteractionData {
	cmd : string;
	args : any;
}

function unpackInteraction(interaction : any) : InteractionData {
	const { name, options } = interaction.data;
	const cmd : string = name.toLowerCase();
	const args : any = {}

	if (options) {
		for (const option of options) {
			const { name, value } = option;
			args[name] = value;
		}
	}

	return {
		cmd: cmd,
		args: args
	};
}

async function onInteractionCreate(interaction : any) {

	const { cmd, args } = unpackInteraction(interaction);
	

	if (!clientCommands.has(cmd)) {
		RespondToInteraction(client, interaction, {
            content: "",
            embeds: [
                {
                    title: "Error",
                    type: "rich",
					description: "Invalid Command",
					color: 15158332 //RED
                }
            ]
        })
		return;
	}

	const command = clientCommands.get(cmd);

	if(command.admin) {
		//ADMIN CHECK
		if(interaction.member.user.id != process.env.MY_ID) {
			RespondToInteraction(client, interaction, {
				content: "",
				embeds: [
					{
						title: "Permissions Error",
						type: "rich",
						description: "Must be admin",
						color: 15158332 //RED
					}
				]
			})
			return;
		}
	}

	await clientCommands.get(cmd).execute(args, interaction, client);
}

interface PlayerStats {
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

const lastCycleStats = new Map<string, PlayerStats>();
//Max requests = 120/min
const MAX_REQUESTS_PER_MIN = 100;
const INTERVAL_SEC = 20;
const MAX_REQUESTS_PER_CYCLE = (INTERVAL_SEC / 60) * MAX_REQUESTS_PER_MIN;
setInterval(async () => {
	if(!client || !client.readyAt) return;
	let requestsMade = 0;
	for(const [username, discordId] of GetDataManager().getUsers().entries()) {
		if(requestsMade > MAX_REQUESTS_PER_CYCLE) return;

		const player = await GetHypixelApi().getPlayer(username, {
			noCacheCheck: true,
			noCaching: true
		}).catch(()=>{});
		requestsMade++;

		if(!player) {
			//remove it and msg player
			return;
		} else if(!player.stats || !player.stats.bedwars) {
			player.stats
			return;
		}

		if(lastCycleStats.has(username)) {
			const lastStats = lastCycleStats.get(username);
			if(lastStats?.bedwars?.finalDeaths != player.stats.bedwars.finalDeaths) {
				//Find servers of player
				for(const [guildId, channelId] of GetDataManager().getAllNotify().entries()) {
					const guild = client.guilds.cache.get(guildId);
					if(!guild) continue;
					const member = await guild.members.fetch(discordId).catch(() => {});
					if(member) {
						const chan = guild.channels.cache.get(channelId);
						if(!chan) continue;

						/* @ts-ignore */
						chan.send({
							embed: {
								title: `${member.displayName} (${member.user.username}#${member.user.discriminator}) Lost a Bedwars match`,
								description: `This is for you: ${insulter.Insult()}`,
								type: "rich",
								color: 15158332,
								fields: [
									{
										name: "Win streak lost",
										value: lastStats?.bedwars?.winstreak.toString(),
										inline: true
									},
									{
										name: "W/L Dropped By",
										value: Math.abs(player.stats.bedwars.WLRatio - (lastStats?.bedwars?.WLRatio ?? 0)).toString(),
										inline: true
									},
								]
							}
						})
					}
				}
			}
		}

		lastCycleStats.set(username, player.stats);
	}
	//Check player stats
	//console.log("Checking Player Stats");
}, INTERVAL_SEC * 1000);