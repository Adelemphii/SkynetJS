import { Events, GuildMember, Interaction, MessageFlags, RoleSelectMenuInteraction } from 'discord.js';
import { EmbedManager } from '../../utility/EmbedManager.ts';
import { ServerUtility } from '../../utility/ServerUtility.ts';
import { ConfigManager } from '../../utility/ConfigManager.ts';
import { Messages } from '../../utility/Messages.ts';

export default {
	name: Events.InteractionCreate,
	async execute(rawInteraction: Interaction) {
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
}