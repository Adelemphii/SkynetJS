import { ChannelSelectMenuInteraction, Events, Interaction } from 'discord.js';
import { EmbedManager } from '../../utility/EmbedManager';
import { ServerUtility } from '../../utility/ServerUtility';
import { ConfigManager } from '../../utility/ConfigManager';

module.exports = {
	name: Events.InteractionCreate,
	async execute(rawInteraction: Interaction) {
		if(!rawInteraction.isChannelSelectMenu()) return;
		const ctx = ServerUtility.getInteractionContext(rawInteraction);
		if(!ctx) return;

		const { config } = ctx;
		const interaction = rawInteraction as ChannelSelectMenuInteraction;

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
}