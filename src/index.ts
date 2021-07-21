require('dotenv').config();

import Discord from 'discord.js';
import fs from 'fs';
import { GetHypixelApi, RespondToInteraction } from "./lib/util";

//https://discord.com/oauth2/authorize?client_id=867366033572888608&scope=bot+applications.commands
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
const client = new Discord.Client();

//#region events
client.once('ready', onBotReady);
/* @ts-ignore */
client.ws.on('INTERACTION_CREATE', onInteractionCreate)
//#endregion

//#region start
client.login(process.env.DISCORD_TOKEN);
//#endregion

const clientCommands = new Discord.Collection<string, any>();

function onBotReady() : void {
	console.log('Client Ready');


	const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter((file : any) => file.endsWith('.js'));

	for (const file of commandFiles) {
		const command = require(`${__dirname}/commands/${file}`);
		clientCommands.set(command.name.toLowerCase(), command);
	}


	for (const guild of client.guilds.cache.map((guild : any) => guild)) {
		registerCommandsForGuild(guild.id);
		console.log(`[${guild.name}] Slash Commands Registered`);
	}
}

function registerCommandsForGuild(guildId : string) : void {
	for(const cmd of clientCommands.array()) {
		registerSingleCommand(guildId, {
			data: {
				name: cmd.name,
				description: cmd.description,
				options: cmd.options
			}
		})
	}
}

function registerSingleCommand(guildId : string, data : any) {
	/* @ts-ignore */
	client.api.applications(client.user.id).guilds(guildId).commands.post(data);
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
	console.log("Interaction Recieved");

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

	clientCommands.get(cmd).execute(args, interaction, client);
}