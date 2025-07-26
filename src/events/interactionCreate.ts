import { ChatInputCommandInteraction, Collection, Events, Interaction, MessageFlags } from 'discord.js';
import { SkynetClient } from '../objects/SkynetClient';

module.exports = {
	name: Events.InteractionCreate,
	async execute(rawInteraction: Interaction) {
		if(!rawInteraction.isChatInputCommand()) return;
		const interaction = rawInteraction as ChatInputCommandInteraction;
		const client = interaction.client as SkynetClient;

		const command = client.commands.get(interaction.commandName);
		if(!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		const cooldowns = client.cooldowns;
		if(!cooldowns.has(command.data.name)) {
			cooldowns.set(command.data.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.data.name);
		const defaultCooldownDuration = 3;
		const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

		if(timestamps.has(interaction.user.id)) {
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
			if(now < expirationTime) {
				const expiredTimestamp = Math.round(expirationTime / 1_000);
				setTimeout(() => interaction.deleteReply(), cooldownAmount);
				return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. 
					You can use it again <t:${expiredTimestamp}:R>.`, flags: MessageFlags.Ephemeral })
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		try {
			await command.execute(interaction);
		} catch(error) {
			console.error(error);
			if(interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral })
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
			}
		}
	}
}