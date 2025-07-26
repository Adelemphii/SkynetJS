import { Events, Message, TextChannel } from 'discord.js';
import { ServerUtility } from '../utility/ServerUtility.ts';
import { EmbedManager } from '../utility/EmbedManager.ts';
import { Mission } from '../objects/Mission.ts';
import { ConfigManager } from '../utility/ConfigManager.ts';

export default {
	name: Events.MessageCreate,
	async execute(message: Message) {
		if (!message.guild || message.author.bot) return;

		const ctx = ServerUtility.getContext(message);
		if (!ctx) return;
		const { client, config } = ctx;

		if (message.channel.id !== config.scheduleConfig.scheduleChannel) return;

		const mission = Mission.parseMissionFromMessage(message);
		if (!mission) return;

		const embed = await EmbedManager.missionEmbed(mission, message.url, undefined, config);
		const reactionButtons = EmbedManager.buildMissionButtons();
		const extraButtons = EmbedManager.buildExtraButtons(mission.sheetUrl);
		console.log(extraButtons, mission.sheetUrl);

		const timelineChannel = await client.channels.fetch(config.scheduleConfig.timelineChannel) as TextChannel;
		if (!timelineChannel || !embed) return;

		const components = [reactionButtons];
		if(extraButtons) components.push(extraButtons);
		const sent = await timelineChannel.send({
			embeds: [embed],
			components,
		});

		mission.timelineMessageId = sent.id;
		config.scheduleConfig.addMission(mission);

		await ConfigManager.saveConfig(config);
	}
}