import { Events, Message, PartialMessage, TextChannel } from 'discord.js';
import { SkynetClient } from '../objects/SkynetClient';
import { ConfigManager } from '../utility/ConfigManager';

module.exports = {
	name: Events.MessageDelete,
	async execute(message: Message | PartialMessage) {
		if(!message) return;

		if(message.partial) {
			try {
				message = await message.fetch();
			} catch(error) {
				return;
			}
		}

		if (!message.guild || message.author?.bot) return;

		const client = message.client as SkynetClient;
		const config = client.servers.get(message.guild.id);
		if (!config) return;

		if (message.channel.id !== config.scheduleConfig.scheduleChannel) return;

		const mission = config.scheduleConfig.getMissionByScheduleMessageId(message.id);
		if (!mission) return;

		const timelineChannel = await message.guild.channels.fetch(config.scheduleConfig.timelineChannel) as TextChannel;
		if (!timelineChannel) return;
		const timelineMessageId = mission.timelineMessageId;
		if(!timelineMessageId) return;

		const missionMessage = await timelineChannel.messages.fetch(timelineMessageId);
		await missionMessage.delete();
		config.scheduleConfig.removeMissionWithTimelineId(timelineMessageId);
		await ConfigManager.saveConfig(config);
	}
}