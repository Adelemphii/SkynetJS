import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'url';

import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import * as dotenv from 'dotenv';
import { SkynetClient } from './objects/SkynetClient';

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

client.setMaxListeners(20);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadCommandsAndEvents(client: any) {
	console.log('hello')
	const foldersPath = path.join(__dirname, 'commands');
	const commandFolders = fs.readdirSync(foldersPath);

	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.ts'));

		for (const file of commandFiles) {
			const fileUrl = pathToFileURL(path.join(commandsPath, file)).href;
			const commandModule = await import(fileUrl);
			const command = commandModule.default ?? commandModule;

			if (command?.data && command?.execute) {
				console.log(`Loaded command: ${command.data.name}`);
				client.commands.set(command.data.name, command);
			} else {
				console.log(`[WARNING] Command at ${file} is missing "data" or "execute"`);
			}
		}
	}

	// Recursive helper to get all event files
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
		const fileUrl = pathToFileURL(filePath).href;
		const eventModule = await import(fileUrl);
		const event = eventModule.default ?? eventModule;

		if (event?.name) {
			console.log(`Loaded event: ${event.name}`);
			if (event.once) {
				client.once(event.name, (...args: any[]) => event.execute(...args));
			} else {
				client.on(event.name, (...args: any[]) => event.execute(...args));
			}
		} else {
			console.log(`[WARNING] Event at ${filePath} is missing a "name" property.`);
		}
	}
}

try {
	await loadCommandsAndEvents(client);
	client.login(token);
} catch (error) {
	console.error('Unhandled Error:', error);
}
