require('dotenv').config();
const insulter = require('insult');
const InsultCompliment = require("insult-compliment");

import Discord, { Guild } from 'discord.js';
import fs from 'fs';
import { Arcade, ArenaBrawl, BedWars, BlitzSurvivalGames, BuildBattle, CopsAndCrims, Duels, MegaWalls, MurderMystery, SkyWars, SmashHeroes, SpeedUHC, TNTGames, UHC, VampireZ } from 'hypixel-api-reborn';
import getHypixelClient, { BedwarsWinLoseEvent } from './hypixel/client';
import GetDataManager from './lib/data';
import { RespondToInteraction } from "./lib/util";


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

const hypixelClient = getHypixelClient();
const client = new Discord.Client({ ws: { intents: ['GUILDS'] } });

//#region events
client.once('ready', onBotReady);
/* @ts-ignore */
client.ws.on('INTERACTION_CREATE', onInteractionCreate);

client.on("guildCreate", onGuildJoin);
client.on("guildDelete", onGuildLeave);

hypixelClient.on("bedwars.loss", onPlayerBedwarsLose);
hypixelClient.on("bedwars.win", onPlayerBedwarsWin);
//#endregion

//#region start
client.login(process.env.DISCORD_TOKEN);
//#endregion

const clientCommands = new Discord.Collection<string, any>();

function onBotReady() {
	client.user?.setActivity(`you fail`, {
		type: "WATCHING",
	});
	
	const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter((file : any) => file.endsWith('.js'));

	for (const file of commandFiles) {
		const command = require(`${__dirname}/commands/${file}`);
		clientCommands.set(command.name.toLowerCase(), command);
	}


	for (const guild of client.guilds.cache.map((guild : any) => guild)) {
		console.log(`[${guild.name}] Started Slash Commands Registering`);
		registerCommandsForGuild(guild.id).then(() => {
			console.log(`[${guild.name}] Slash Commands Registered`);
		})

		if(!GetDataManager().getRecordingPeriod(guild.id)){
			console.log(`[${guild.name}] Started Recording Period`);
			GetDataManager().startRecordingPeriod(guild.id);
		}
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
	
	console.log(`[${guild.name}] Started Recording Period`);
	GetDataManager().startRecordingPeriod(guild.id);
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


async function onPlayerBedwarsLose(event : BedwarsWinLoseEvent) {
	console.log(`Lose Event Fired: ${event.player.nickname}`);
	
	const disId = GetDataManager().getUser(event.player.nickname);
	if(!event.cur || !event.last || !disId) return;

	GetDataManager().updatePlayersRecordings(event.player.nickname, disId, client, event.last, event.cur);
	
	for(const [guildId, channelId] of GetDataManager().getAllNotify().entries()) {
		const guild = client.guilds.cache.get(guildId);
		if(!guild) continue;
		const member = await guild.members.fetch(disId).catch(() => {});
		if(!member) continue;
		const chan = guild.channels.cache.get(channelId);
		if(!chan) continue;

		/* @ts-ignore */
		chan.send({
			embed: {
				title: `${member.displayName} (${member.user.username}#${member.user.discriminator}) lost a Bedwars match`,
				description: `This is for you: ${getInsult()}`,
				type: "rich",
				color: 15158332,
				fields: [
					{
						name: "W/L Dropped By",
						value: (event.last.wins / event.last.losses - event.cur.wins / event.cur.losses).toString(),
						inline: false
					},
				]
			}
		})
	}
}

function getInsult() {
	let ins : string = insulter.Insult();
	while(ins.includes("women")) {
		ins = insulter.Insult();
	}

	return ins;
}

async function onPlayerBedwarsWin(event : BedwarsWinLoseEvent) {
	console.log(`Win Event Fired: ${event.player.nickname}`);

	const disId = GetDataManager().getUser(event.player.nickname);
	if(!event.cur || !event.last || !disId) return;

	GetDataManager().updatePlayersRecordings(event.player.nickname, disId, client, event.last, event.cur);

	for(const [guildId, channelId] of GetDataManager().getAllNotify().entries()) {
		const guild = client.guilds.cache.get(guildId);
		if(!guild) continue;
		const member = await guild.members.fetch(disId).catch(() => {});
		if(!member) continue;
		const chan = guild.channels.cache.get(channelId);
		if(!chan) continue;

		/* @ts-ignore */
		chan.send({
			embed: {
				title: `${member.displayName} (${member.user.username}#${member.user.discriminator}) won a Bedwars match`,
				description: InsultCompliment.Compliment(),
				type: "rich",
				color: 3066993,
				fields: [
					{
						name: "W/L Raised By",
						value: (event.cur.wins / event.cur.losses - event.last.wins / event.last.losses).toString(),
						inline: false
					},
				]
			}
		})
	}
}