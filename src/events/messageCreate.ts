import { Events, Message, TextChannel } from 'discord.js';
import { ServerUtility } from '../utility/ServerUtility';

export const name = Events.MessageCreate;

export async function execute(message: Message) {
	if (!message.guild || message.author.bot) return;

	const ctx = ServerUtility.getContext(message);
	if (!ctx) return;
	const { client, config } = ctx;

	if (message.channel.id !== config.scheduleConfig.scheduleChannel) return;

	await ServerUtility.fetchAndCreateOrUpdateEmbed(message, config, client);
}
