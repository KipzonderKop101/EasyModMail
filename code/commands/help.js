const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('See what you can do with this bot'),
	async execute(interaction) {
		const generalHelpEmbed = new MessageEmbed()
            .setColor('#21238a')
            .setTitle('Courtroom help')
            .setURL('https://github.com/KipzonderKop101/EasyModMail')
            .setDescription("Choose what you'd like help on")
            .setTimestamp();
        
        await interaction.reply({ embeds: [generalHelpEmbed] });
	},
};
