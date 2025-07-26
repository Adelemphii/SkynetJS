import { ButtonInteraction, Events, Interaction, MessageFlags, TextChannel } from 'discord.js';
import { ServerUtility } from '../utility/ServerUtility';
import { Messages } from '../utility/Messages';
import { Mission, ParticipationStatus } from '../objects/Mission';
import { ConfigManager } from '../utility/ConfigManager';
import { GuildConfig } from '../objects/GuildConfig';
import { SkynetClient } from '../objects/SkynetClient';

module.exports = {
	name: Events.InteractionCreate,
	async execute(rawInteraction: Interaction) {
		if(!rawInteraction.isButton()) return;
		const interaction = rawInteraction as ButtonInteraction;
		const ctx = ServerUtility.getInteractionContext(interaction);
		if(!ctx) return;

		const { client, config } = ctx;
		const guildId = interaction.guildId;
		if(!guildId) {
			await interaction.reply({
				content: Messages.get(Messages.SERVER_ONLY, interaction.locale),
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		if(!config) return;

		switch (interaction.customId) {
			case 'mission_join':
				await handleMissionParticipation(interaction, client, config, 'joining', Messages.JOIN_MISSION);
				break;
			case 'mission_maybe':
				await handleMissionParticipation(interaction, client, config, 'maybe', Messages.MAYBE_MISSION);
				break;
			case 'mission_cant':
				await handleMissionParticipation(interaction, client, config, 'not_joining', Messages.NOT_JOINING_MISSION);
				break;
		}

		await ConfigManager.saveConfig(config);
	}
}

async function handleMissionParticipation(interaction: ButtonInteraction, client: SkynetClient, config: GuildConfig, status: ParticipationStatus,
										  successMessage: Record<string, (mission: Mission) => string>) {
	const userId = interaction.user.id;
	const mission = config.scheduleConfig.getMissionByTimelineMessageId(interaction.message.id) as Mission;
	if (!mission) return;

	mission.addOrUpdateParticipant(userId, status);

	const guild = interaction.guild;
	if (!guild) return;

	const scheduleChannel = await guild.channels.fetch(config.scheduleConfig.scheduleChannel) as TextChannel;
	if (!scheduleChannel) return;

	const scheduleMessage = await scheduleChannel.messages.fetch(mission.scheduleMessageId);
	if (!scheduleMessage) return;

	await ServerUtility.updateMissionEmbed(mission, config, client);

	await interaction.reply({
		content: Messages.get(successMessage, interaction.locale, mission),
		flags: MessageFlags.Ephemeral
	});
}