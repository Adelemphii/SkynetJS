import { ChannelSelectMenuInteraction, Events, GuildMember, Interaction, MessageFlags } from 'discord.js';
import { EmbedManager } from '../../utility/EmbedManager.js';
import { ServerUtility } from '../../utility/ServerUtility.js';
import { ConfigManager } from '../../utility/ConfigManager.js';
import { Messages } from '../../utility/Messages.js';

export default {
	name: Events.InteractionCreate,
	async execute(rawInteraction: Interaction) {
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
}