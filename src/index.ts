import * as fs from 'node:fs';
import * as path from 'node:path';

import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import * as dotenv from 'dotenv';
import { SkynetClient } from "./objects/SkynetClient";

dotenv.config();

const environment = process.env.NODE_ENV ?? 'development';
const token: string | undefined = environment.trim() === 'production'
	? process.env.PROD_DISCORD_TOKEN : process.env.DEV_DISCORD_TOKEN;

const intents = [
	GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessageReactions
];

const client = new Client({
	intents: intents,
	partials: [ Partials.Message, Partials.Channel, Partials.Reaction, Partials.User ]
}) as SkynetClient;

client.commands = new Collection();
client.cooldowns = new Collection();
client.servers = new Collection();
client.remindersSent = new Set<string>();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for(const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.ts'));
	for(const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);

		if('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] Command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Recursively get all .ts files in a directory and its subdirectories
function getAllEventFiles(dir: string): string[] {
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	return entries.flatMap(entry => {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			return getAllEventFiles(fullPath);
		} else if (entry.isFile() && fullPath.endsWith('.ts')) {
			return [fullPath];
		} else {
			return [];
		}
	});
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = getAllEventFiles(eventsPath);

for (const filePath of eventFiles) {
	const event = require(filePath);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);