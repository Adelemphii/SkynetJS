import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder, TextChannel } from 'discord.js';
import { ServerUtility } from '../../utility/ServerUtility';
import { Messages } from '../../utility/Messages';

export const data = new SlashCommandBuilder()
	.setName("rescan")
	.setDescription("Rescans the server's op schedule channel for missions.")

export async function execute(interaction: ChatInputCommandInteraction) {
	if (!interaction.guild || interaction.user.bot) return;
	if (interaction.user.id !== '113826553246253061') return await interaction.reply({
		content: Messages.get(Messages.NO_PERMS, interaction.locale),
		flags: MessageFlags.Ephemeral,
	});

	const ctx = ServerUtility.getInteractionContext(interaction);
	if (!ctx) return;
	const { client, config } = ctx;

	const scheduleChannel = await client.channels.fetch(config.scheduleConfig.scheduleChannel) as TextChannel;
	if (!scheduleChannel) return;
	const messages = await scheduleChannel.messages.fetch({ limit: 20 });

	for (const [messageId, message] of messages) {
		await ServerUtility.fetchAndCreateOrUpdateEmbed(message, config, client);
	}

	await interaction.reply({
		content: 'Good spice, fluffnuts.',
		flags: MessageFlags.Ephemeral,
	});
}