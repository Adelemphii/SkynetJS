import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { Messages } from '../../utility/Messages';
import { EmbedManager } from '../../utility/EmbedManager';
import { ServerUtility } from '../../utility/ServerUtility';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('config')
		.setDescription('Edit the config settings'),
	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guild) {
			return await interaction.reply({
				content: Messages.get(Messages.SERVER_ONLY, interaction.locale),
				flags: MessageFlags.Ephemeral
			});
		}

		const ctx = ServerUtility.getInteractionContext(interaction);
		if(!ctx) return;

		const { config } = ctx;

		const { embed, components } = EmbedManager.serverInfo(interaction, config);

		await interaction.reply({
			embeds: [embed],
			components
		});
	}
}