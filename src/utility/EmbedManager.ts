import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, } from 'discord.js';
import { GuildConfig } from '../objects/GuildConfig';
import { Messages } from './Messages';
import { Mission } from '../objects/Mission';

export class EmbedManager {
	static serverInfo(interaction: any, config: GuildConfig) {
		const url = config.scheduleConfig.timelineMessageIcon ?? 'https://imgur.com/a/11WUTVL';

		const embed = new EmbedBuilder()
			.setTitle(Messages.get(Messages.SERVER_INFO, interaction.locale, interaction.guild.name))
			.setColor(0x5865F2)
			.addFields(
				{
					name: Messages.get(Messages.MEMBERS, interaction.locale),
					value: `${interaction.guild.memberCount}`,
					inline: true
				},
				{
					name: Messages.get(Messages.SERVER_CONFIG, interaction.locale),
					value: [
						Messages.get(Messages.SERVER_ID, interaction.locale, config),
						Messages.get(Messages.ADMIN_ROLE, interaction.locale, config),
						Messages.get(Messages.COMMAND_CHANNEL, interaction.locale, config),
					].join('\n'),
					inline: false
				},
				{
					name: Messages.get(Messages.SCHEDULE_CONFIG, interaction.locale),
					value: [
						Messages.get(Messages.SCHEDULE_CHANNEL, interaction.locale, config),
						Messages.get(Messages.TIMELINE_CHANNEL, interaction.locale, config),
						Messages.get(Messages.TIMELINE_MESSAGE_ICON, interaction.locale, config),
						Messages.get(Messages.MINUTES_BEFORE_TIMER, interaction.locale, config),
					].join('\n'),
					inline: false
				}
			)
			.setThumbnail(url)
			.setTimestamp();

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId('edit_admin_role')
				.setLabel(Messages.get(Messages.EDIT_ADMIN_ROLE_PROMPT, interaction.locale))
				.setStyle(ButtonStyle.Primary),

			new ButtonBuilder()
				.setCustomId('edit_command_channel')
				.setLabel(Messages.get(Messages.EDIT_COMMAND_CHANNEL_PROMPT, interaction.locale))
				.setStyle(ButtonStyle.Primary),
		);
		const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId('edit_schedule_channel')
				.setLabel(Messages.get(Messages.EDIT_SCHEDULE_CHANNEL_PROMPT, interaction.locale))
				.setStyle(ButtonStyle.Secondary),

			new ButtonBuilder()
				.setCustomId('edit_timeline_channel')
				.setLabel(Messages.get(Messages.EDIT_TIMELINE_CHANNEL_PROMPT, interaction.locale))
				.setStyle(ButtonStyle.Secondary),

			new ButtonBuilder()
				.setCustomId('edit_minutes_before_timer')
				.setLabel(Messages.get(Messages.EDIT_MINUTES_BEFORE_TIMER_PROMPT, interaction.locale))
				.setStyle(ButtonStyle.Secondary),

			new ButtonBuilder()
				.setCustomId('edit_timeline_icon_url')
				.setLabel(Messages.get(Messages.EDIT_TIMELINE_MESSAGE_ICON_PROMPT, interaction.locale))
				.setStyle(ButtonStyle.Secondary)
		);

		return {embed, components: [row, row2]};
	}

	static async missionEmbed(mission: Mission, messageUrl: string, zeus?: string, config?: GuildConfig): Promise<EmbedBuilder> {
		const joining = mission.getParticipantsByStatus('joining');
		const maybe = mission.getParticipantsByStatus('maybe');
		const notJoining = mission.getParticipantsByStatus('not_joining');

		let footer = mission.modpackInfo ? `Modpack: ${mission.modpackInfo}` : 'No modpack specified';
		if (zeus) footer += ` | Zeus: ${zeus}`;

		let url = 'https://imgur.com/a/11WUTVL';
		if(config && config.scheduleConfig.timelineMessageIcon) {
			console.log('hello from the otherside')
			url = config.scheduleConfig.timelineMessageIcon;
		}

		return new EmbedBuilder()
			.setColor(0x2f3136)
			.setTitle(`📜 ${mission.opName}`)
			.setURL(messageUrl)
			.setDescription(`**Mission Scheduled**\n<t:${mission.timestamp}:F> (**<t:${mission.timestamp}:R>**)`)
			.addFields(
				{
					name: '📖 Lore / Details',
					value: mission.loreLines.length > 0 ? mission.loreLines.join('\n') : '*No additional details provided.*',
				},
				{
					name: '🍞 Joining',
					value: joining.length > 0 ? joining.map(id => `<@${id}>`).join(', ') : '_No one yet._',
					inline: true
				},
				{
					name: '🫓 Maybe',
					value: maybe.length > 0 ? maybe.map(id => `<@${id}>`).join(', ') : '_No one yet._',
					inline: true
				},
				{
					name: '🥖 Not Joining',
					value: notJoining.length > 0 ? notJoining.map(id => `<@${id}>`).join(', ') : '_No one yet._',
					inline: true
				}
			)
			.setFooter({ text: footer })
			.setTimestamp(new Date(mission.timestamp * 1000))
			.setThumbnail(url);
	}

	static buildMissionButtons(): ActionRowBuilder<ButtonBuilder> {
		return new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId('mission_join')
				.setLabel('I’m In')
				.setEmoji('🍞')
				.setStyle(ButtonStyle.Success),
			new ButtonBuilder()
				.setCustomId('mission_maybe')
				.setLabel('Maybe')
				.setEmoji('🫓')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('mission_cant')
				.setLabel('Can’t Join')
				.setEmoji('🥖')
				.setStyle(ButtonStyle.Danger)
		);
	}

	static buildExtraButtons(sheetUrl?: string, intelUrl?: string): ActionRowBuilder<ButtonBuilder> | null {
		if(!sheetUrl && !intelUrl) return null;

		const row = new ActionRowBuilder<ButtonBuilder>();
		if (sheetUrl) {
			row.addComponents(
				new ButtonBuilder()
					.setLabel('Mission Sheet')
					.setStyle(ButtonStyle.Link)
					.setEmoji('📄')
					.setURL(sheetUrl)
			);
		}
		if (intelUrl) {
			row.addComponents(
				new ButtonBuilder()
					.setLabel('Intel')
					.setStyle(ButtonStyle.Link)
					.setEmoji('🛰️')
					.setURL(intelUrl)
			);
		}

		return row;
	}
}