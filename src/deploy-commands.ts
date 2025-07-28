import * as fs from 'node:fs';
import * as path from 'node:path';
import { REST, Routes } from 'discord.js';
import * as dotenv from 'dotenv';
dotenv.config();

const environment = process.env.NODE_ENV ?? 'development';
const token: string | undefined = environment.trim() === 'production'
	? process.env.PROD_DISCORD_TOKEN : process.env.DEV_DISCORD_TOKEN;

const clientId: string | undefined = environment.trim() === 'production'
	? process.env.PROD_CLIENT_ID : process.env.DEV_CLIENT_ID;

const guildId: string | undefined = process.env.GUILD_ID;

if(!token) {
	throw new Error('Token is not set in .env.');
}
if(!clientId) {
	throw new Error('ClientId is not set in .env.');
}
if(!guildId) {
	throw new Error('GuildId is not set in .env.');
}

const commands: any[] = [];

async function collectCommands() {
	const foldersPath = path.join(__dirname, 'src/commands');
	const commandFolders = fs.readdirSync(foldersPath);

	for(const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.ts'));
		for(const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = await import(filePath);

			if('data' in command && 'execute' in command) {
				commands.push(command.data.toJSON());
			} else {
				console.log(`[WARNING] Command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}
}

const rest = new REST().setToken(token);

(async () => {
	try {
		await collectCommands();

		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const routes = environment.trim() === 'production'
			? Routes.applicationCommands(clientId) : Routes.applicationGuildCommands(clientId, guildId);
		const data = await rest.put(
			routes,
			{ body: commands },
		);

		// @ts-ignore
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch(error) {
		console.log(error);
	}
})();
