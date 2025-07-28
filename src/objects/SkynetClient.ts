import { Client, Collection } from "discord.js";
import { GuildConfig } from './GuildConfig';

export interface SkynetClient extends Client {
	commands: Collection<string, any>;
	cooldowns: Collection<string, any>;
	servers: Collection<string, GuildConfig>;
	remindersSent: Set<string>;
}
