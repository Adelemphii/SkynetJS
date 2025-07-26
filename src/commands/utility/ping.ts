import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply('Pong!');
	},
};