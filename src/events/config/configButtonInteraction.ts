import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	ChannelSelectMenuBuilder,
	ChannelType,
	Events,
	Interaction,
	MessageFlags,
	ModalBuilder,
	RoleSelectMenuBuilder,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js';
import { Messages } from '../../utility/Messages';
import { EmbedManager } from '../../utility/EmbedManager';
import { ServerUtility } from '../../utility/ServerUtility';

module.exports = {
	name: Events.InteractionCreate,
	async execute(rawInteraction: Interaction) {
		if(!rawInteraction.isButton()) return;
		const interaction = rawInteraction as ButtonInteraction;
		const ctx = ServerUtility.getInteractionContext(interaction);
		if(!ctx) return;

		const { config } = ctx;
		const guildId = interaction.guildId;
		if(!guildId) {
			await interaction.reply({
				content: Messages.get(Messages.SERVER_ONLY, interaction.locale),
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		if(!config) return;

		switch (interaction.customId) {
			case 'edit_admin_role': {
				const roleSelectMenu = new RoleSelectMenuBuilder()
					.setCustomId('select_admin_role')
					.setPlaceholder(Messages.get(Messages.EDIT_ADMIN_ROLE_PROMPT, interaction.locale))
					.setMinValues(1)
					.setMaxValues(1);

				const menuRow = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(roleSelectMenu);

				const backButton = new ButtonBuilder()
					.setCustomId('go_back_serverinfo')
					.setLabel('Back')
					.setStyle(ButtonStyle.Secondary);

				const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(backButton);

				await interaction.update({
					components: [menuRow, buttonRow],
				});
				break;
			}
			case 'edit_command_channel': {
				const rows = makeChannelSelectUpdate(interaction, 'select_command_channel');
				await interaction.update({ components: rows });
				break;
			}
			case 'edit_schedule_channel': {
				const rows = makeChannelSelectUpdate(interaction, 'select_schedule_channel');
				await interaction.update({ components: rows });
				break;
			}
			case 'edit_timeline_channel': {
				const rows = makeChannelSelectUpdate(interaction, 'select_timeline_channel');
				await interaction.update({ components: rows });
				break;
			}
			case 'edit_minutes_before_timer': {
				const minutesInput = new TextInputBuilder()
					.setCustomId('input_minutes_before')
					.setLabel(Messages.get(Messages.EDIT_MINUTES_BEFORE_TIMER_PROMPT, interaction.locale))
					.setPlaceholder(Messages.get(Messages.ENTER_MINUTES_PROMPT, interaction.locale))
					.setStyle(TextInputStyle.Short)
					.setRequired(true)
					.setMinLength(1)
					.setMaxLength(3);

				const row = new ActionRowBuilder<TextInputBuilder>().addComponents(minutesInput);

				const modal = new ModalBuilder()
					.setCustomId(`edit_timer:${interaction.message.id}`)
					.setTitle(Messages.get(Messages.EDIT_MINUTES_BEFORE_TIMER_PROMPT, interaction.locale))
					.addComponents(row);

				await interaction.showModal(modal);
				break;
			}
			case 'edit_timeline_icon_url': {
				const urlInput = new TextInputBuilder()
					.setCustomId('input_icon_url')
					.setLabel(Messages.get(Messages.EDIT_TIMELINE_MESSAGE_ICON_PROMPT, interaction.locale))
					.setPlaceholder('https://example.com/icon.png')
					.setStyle(TextInputStyle.Short)
					.setRequired(true)
					.setMinLength(5)
					.setMaxLength(300);

				const row = new ActionRowBuilder<TextInputBuilder>().addComponents(urlInput);

				const modal = new ModalBuilder()
					.setCustomId(`edit_icon_url:${interaction.message.id}`)
					.setTitle(Messages.get(Messages.EDIT_TIMELINE_MESSAGE_ICON_PROMPT, interaction.locale))
					.addComponents(row);

				await interaction.showModal(modal);
				break;
			}
			case 'go_back_serverinfo': {
				const { embed, components } = EmbedManager.serverInfo(interaction, config);
				await interaction.update({
					embeds: [embed],
					components
				});
				break;
			}
		}
	}
}

function makeChannelSelectUpdate(interaction: Interaction, customId: string) {
	const channelSelectMenu = new ChannelSelectMenuBuilder()
		.setCustomId(customId)
		.setPlaceholder(Messages.get(Messages.SELECT_TEXT_CHANNEL_PROMPT, interaction.locale))
		.setChannelTypes(ChannelType.GuildText)
		.setMinValues(1)
		.setMaxValues(1);

	const backButton = new ButtonBuilder()
		.setCustomId('go_back_serverinfo')
		.setLabel('Back')
		.setStyle(ButtonStyle.Secondary);

	const row1 = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(channelSelectMenu);
	const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(backButton);

	return [row1, row2];
}