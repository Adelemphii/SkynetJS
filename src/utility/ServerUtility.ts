import { SkynetClient } from '../objects/SkynetClient';
import { GuildMember, Interaction, Message, MessageFlags, TextChannel } from 'discord.js';
import { EmbedManager } from './EmbedManager';
import { Mission } from '../objects/Mission';
import { GuildConfig } from '../objects/GuildConfig';

export class ServerUtility {
	static getInteractionContext(interaction: Interaction) {
		const client = interaction.client as SkynetClient;
		const guildId = interaction.guildId;
		if (!guildId) return null;

		const config = client.servers.get(guildId);
		if (!config) return null;

		return { client, guildId, config };
	}

	static getContext(message: Message) {
		const client = message.client as SkynetClient;
		const guildId = message.guildId;
		if (!guildId) return null;

		const config = client.servers.get(guildId);
		if (!config) return null;

		return { client, guildId, config };
	}

	static async updateMissionEmbed(mission: Mission, config: GuildConfig, client: SkynetClient): Promise<Message | null> {
		if (!mission) return null;

		const guild = await client.guilds.fetch(config.serverId);
		if (!guild) return null;

		const scheduleChannel = await guild.channels.fetch(config.scheduleConfig.scheduleChannel) as TextChannel;
		if (!scheduleChannel) return null;

		const scheduleMessage = await scheduleChannel.messages.fetch(mission.scheduleMessageId);
		if (!scheduleMessage) return null;

		const timelineChannel = await guild.channels.fetch(config.scheduleConfig.timelineChannel) as TextChannel;

		if(!mission.timelineMessageId) return null;
		const timelineMessage = await timelineChannel.messages.fetch(mission.timelineMessageId);

		const embed = await EmbedManager.missionEmbed(mission, scheduleMessage.url, undefined, config);
		const buttons = EmbedManager.buildMissionButtons();
		const extraButtons = EmbedManager.buildExtraButtons(mission.sheetUrl);
		if (!embed) return null;

		const components = [buttons];
		if (extraButtons) components.push(extraButtons);

		return await timelineMessage.edit({
			embeds: [embed],
			components,
		});
	}

	static hasAdminRole(member: GuildMember, config: GuildConfig): boolean {
		if (!member) {
			return false;
		}

		if(config.adminRoleId && config.adminRoleId !== "N/A") {
			return member.roles.cache.has(config.adminRoleId);
		}
		return true;
	}

}