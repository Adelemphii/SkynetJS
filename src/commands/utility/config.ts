import { ChatInputCommandInteraction, GuildMember, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { Messages } from '../../utility/Messages.js';
import { EmbedManager } from '../../utility/EmbedManager.js';
import { ServerUtility } from '../../utility/ServerUtility.js';

export default {
	data: new SlashCommandBuilder()
		.setName('config')
		.setDescription('Edit the config settings'),
	admin: true,
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

		const member = interaction.member as GuildMember;
		const hasAdminRole = ServerUtility.hasAdminRole(member, config);
		if (!hasAdminRole) {
			await interaction.reply({
				content: Messages.get(Messages.NO_PERMS, interaction.locale),
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const { embed, components } = EmbedManager.serverInfo(interaction, config);
		await interaction.reply({
			embeds: [embed],
			components
		});
	}
}