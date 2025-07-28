import { Events, GuildMember, Interaction, MessageFlags, RoleSelectMenuInteraction } from 'discord.js';
import { EmbedManager } from '../../utility/EmbedManager';
import { ServerUtility } from '../../utility/ServerUtility';
import { ConfigManager } from '../../utility/ConfigManager';
import { Messages } from '../../utility/Messages';

export const name = Events.InteractionCreate;

export async function execute(rawInteraction: Interaction) {
	if(!rawInteraction.isRoleSelectMenu()) return;
	const interaction = rawInteraction as RoleSelectMenuInteraction;
	const ctx = ServerUtility.getInteractionContext(rawInteraction);
	if (!ctx) return;

	const { config } = ctx;

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
		case 'select_admin_role': {
			config.adminRoleId = interaction.values[0];
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
