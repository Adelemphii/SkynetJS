import { Events, Interaction, RoleSelectMenuInteraction } from 'discord.js';
import { EmbedManager } from '../../utility/EmbedManager';
import { ServerUtility } from '../../utility/ServerUtility';
import { ConfigManager } from '../../utility/ConfigManager';

module.exports = {
	name: Events.InteractionCreate,
	async execute(rawInteraction: Interaction) {
		if(!rawInteraction.isRoleSelectMenu()) return;
		const interaction = rawInteraction as RoleSelectMenuInteraction;
		const ctx = ServerUtility.getInteractionContext(rawInteraction);
		if (!ctx) return;

		const { config } = ctx;

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