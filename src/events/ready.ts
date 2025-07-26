import { Events, TextChannel } from 'discord.js';
import { SkynetClient } from '../objects/SkynetClient';
import { GuildConfig } from '../objects/GuildConfig';
import { ConfigManager } from '../utility/ConfigManager';

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute: async (client: SkynetClient) => {
		if(!client.user) {
			console.error('Client user does not exist somehow.');
			return;
		}
		console.log(`Ready! Logged in as ${client.user.tag}`);

		for (const guild of client.guilds.cache.values()) {
			let guildConfig = await ConfigManager.loadConfig(guild.id);
			if (!guildConfig) {
				guildConfig = new GuildConfig(guild.id);
				await ConfigManager.saveConfig(guildConfig);
			}
			client.servers.set(guild.id, guildConfig);

			await cacheImportantMessages(client, guildConfig);
		}

		setInterval(async () => {
			for (const [, config] of client.servers.entries()) {
				const channel = await client.channels.fetch(config.scheduleConfig.timelineChannel).catch(() => null) as TextChannel;
				if (!channel?.isTextBased()) continue;

				for (const mission of config.scheduleConfig.missions) {
					if (mission.reminderSent) continue;

					const millisUntilMission = (mission.timestamp * 1000) - Date.now();
					const minutesUntilMission = millisUntilMission / (1000 * 60);

					if (minutesUntilMission <= config.scheduleConfig.minutesBeforeTimer && minutesUntilMission > 0) {
						const participantMentions = mission.getAllParticipants()
							.map(participant => `<@${participant.userId}>`)
							.join(', ');

						const reminderMessage = await channel.send({
							content: `⏰ Mission "**${mission.opName}**" starts <t:${mission.timestamp}:R>!\n${participantMentions}`,
						});

						setTimeout(() => {
							reminderMessage.delete().catch(() => null);
						}, millisUntilMission);

						mission.reminderSent = true;
						await ConfigManager.saveConfig(config);
					}
				}
			}
		}, 10 * 1000);
	}
}

async function cacheImportantMessages(client: SkynetClient, config: GuildConfig) {
	const channel = await client.channels.fetch(config.scheduleConfig.scheduleChannel);
	const channel2 = await client.channels.fetch(config.scheduleConfig.timelineChannel);
	if(!channel?.isTextBased()) return;
	if(!channel2?.isTextBased()) return;

	for(const mission of config.scheduleConfig.missions) {
		try {
			const msg = await channel.messages.fetch(mission.scheduleMessageId);
			let msg2;
			if(mission.timelineMessageId) {
				msg2 = await channel2.messages.fetch(mission.timelineMessageId);
				console.log(`Cached message ${msg2.id}`);
			}
			console.log(`Cached message ${msg.id}`);
		} catch(error) {
			console.warn(`Failed to fetch message ${mission.scheduleMessageId}`);
		}
	}
}