import { Events, Message, MessageFlags, MessageReaction, PartialUser, User } from 'discord.js';
import { ServerUtility } from '../utility/ServerUtility';
import { ParticipationStatus } from '../objects/Mission';
import { ConfigManager } from '../utility/ConfigManager';

const emojiStatusMap = new Map([
	['🍞', 'joining'],
	['🫓', 'maybe'],
	['🥖', 'not_joining'],
]);

export const name = Events.MessageReactionAdd;

export async function execute(reaction: MessageReaction, user: User | PartialUser) {
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message');
			return;
		}
	}

	let reactionMessage = reaction.message as Message;
	if (reaction.partial) {
		try {
			reactionMessage = await reaction.message.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message');
			return;
		}
	}

	if(!reactionMessage) return;
	if (!reactionMessage.guild || user.bot) return;

	const ctx = ServerUtility.getContext(reactionMessage);
	if (!ctx) return;
	const { client, config } = ctx;

	if (reaction.message.channel.id !== config.scheduleConfig.scheduleChannel) return;

	const status = emojiStatusMap.get(reaction.emoji.name as string) as ParticipationStatus;
	if (!status) return;

	const mission = config.scheduleConfig.getMissionByScheduleMessageId(reaction.message.id);
	if (!mission) return;

	mission.addOrUpdateParticipant(user.id, status);

	await ConfigManager.saveConfig(config);
	await ServerUtility.updateMissionEmbed(mission, config, client);

	await reaction.remove();
}
