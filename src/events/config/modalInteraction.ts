import { Events, Interaction, Message, MessageFlags, ModalSubmitInteraction } from 'discord.js';
import { ServerUtility } from '../../utility/ServerUtility';
import { EmbedManager } from '../../utility/EmbedManager';
import { Messages } from '../../utility/Messages';
import { ConfigManager } from '../../utility/ConfigManager';

module.exports = {
	name: Events.InteractionCreate,
	async execute(rawInteraction: Interaction) {
		if(!rawInteraction.isModalSubmit()) return;
		const ctx = ServerUtility.getInteractionContext(rawInteraction);
		if(!ctx) return;

		const { config } = ctx;
		const interaction = rawInteraction as ModalSubmitInteraction;

		const [customId, messageId] = interaction.customId.split(':');
		const message = await interaction.channel?.messages.fetch(messageId) as Message;

		switch(customId) {
			case 'edit_timer': {
				const minutes = parseInt(interaction.fields.getTextInputValue('input_minutes_before'), 10);

				if (isNaN(minutes) || minutes <= 0) {
					await interaction.reply({
						content: Messages.get(Messages.ENTER_MINUTES_PROMPT, interaction.locale),
						flags: MessageFlags.Ephemeral
					});
					return;
				}
				config.scheduleConfig.minutesBeforeTimer = minutes;
				const { embed, components } = EmbedManager.serverInfo(interaction, config);
				await interaction.reply({
					content: Messages.get(Messages.TIMER_SUCCESS, interaction.locale, minutes),
					flags: MessageFlags.Ephemeral,
				})
				await message.edit({
					embeds: [embed],
					components,
				})

				await ConfigManager.saveConfig(config);
				break;
			}
		}
	}
}