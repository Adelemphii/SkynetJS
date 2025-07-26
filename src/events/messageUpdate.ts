import { Events, Message, TextChannel } from 'discord.js';
import { ServerUtility } from '../utility/ServerUtility.js';
import { Mission } from '../objects/Mission.js';
import { ConfigManager } from '../utility/ConfigManager.js';

export default {
	name: Events.MessageUpdate,
	async execute(oldMessage: Message | null, newMessage: Message) {
		if (!newMessage.guild || newMessage.author?.bot) return;

		const ctx = ServerUtility.getContext(newMessage);
		if (!ctx) return;
		const { client, config } = ctx;

		if (newMessage.channel.id !== config.scheduleConfig.scheduleChannel) return;

		const newMission = Mission.parseMissionFromMessage(newMessage);
		if (!newMission) return;

		const existing = config.scheduleConfig.getMissionByScheduleMessageId(newMessage.id);
		if (!existing) return;
		existing.opName = newMission.opName;
		existing.timestamp = newMission.timestamp;
		existing.loreLines = newMission.loreLines;
		existing.modpackInfo = newMission.modpackInfo;
		existing.sheetUrl = newMission.sheetUrl;

		for (const participant of newMission.getAllParticipants()) {
			existing.addOrUpdateParticipant(participant.userId, participant.status);
		}

		const timelineChannel = await client.channels.fetch(config.scheduleConfig.timelineChannel) as TextChannel;
		if (!timelineChannel) return;

		if (!existing.timelineMessageId) return;

		const mission = config.scheduleConfig.getMissionByTimelineMessageId(existing.timelineMessageId);
		if(!mission) return;

		await ServerUtility.updateMissionEmbed(mission, config, client);
		await ConfigManager.saveConfig(config);
	}
};