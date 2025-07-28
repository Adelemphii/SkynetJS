import { ChannelSelectMenuInteraction, Events, GuildMember, Interaction, MessageFlags } from 'discord.js';
import { EmbedManager } from '../../utility/EmbedManager';
import { ServerUtility } from '../../utility/ServerUtility';
import { ConfigManager } from '../../utility/ConfigManager';
import { Messages } from '../../utility/Messages';

export const name = Events.InteractionCreate;

export async function execute(rawInteraction: Interaction) {
	if(!rawInteraction.isChannelSelectMenu()) return;
	const ctx = ServerUtility.getInteractionContext(rawInteraction);
	if(!ctx) return;

	const { config } = ctx;
	const interaction = rawInteraction as ChannelSelectMenuInteraction;

	const member = interaction.member as GuildMember;
	const hasAdminRole = ServerUtility.hasAdminRole(member, config);
	if (!hasAdminRole) {
		await interaction.reply({
			content: Messages.get(Messages.NO_PERMS, interaction.locale),
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	switch(interaction.customId) {
		case 'select_command_channel': {
			config.commandChannelId = interaction.values[0];
			break;
		}
		case 'select_schedule_channel': {
			config.scheduleConfig.scheduleChannel = interaction.values[0];
			break;
		}
		case 'select_timeline_channel': {
			config.scheduleConfig.timelineChannel = interaction.values[0];
			break;
		}
	}

	const { embed, components } = EmbedManager.serverInfo(interaction, config);
	await interaction.update({
		embeds: [embed],
		components
	});

	await ConfigManager.saveConfig(config);
}
