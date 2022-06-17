const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reply')
		.setDescription('Reply to a threat')
        .addStringOption(option => 
            option.setName('message')
                .setDescription('The message you want to sent to the user')
                .setRequired(true))
		.addBooleanOption(option => 
			option.setName('this')
				.setDescription('Choose if you want to reply to this threat')
				.setRequired(true))
		.addChannelOption(option => 
			option.setName('thread')
				.setDescription('Choose if you want to reply to another thread (if previous option is false)')
				.setRequired(false)),
	async execute(interaction, client) {
		let this_channel = interaction.options.getBoolean('this');
		let thread = interaction.options.getChannel('thread');
        let message = interaction.options.getString('message');

		const serverEmbed = new MessageEmbed()
			.setTitle('Message sent')
			.setDescription(`\`\`\`${message}\`\`\``)
			.setTimestamp()

		const clientEmbed = new MessageEmbed()
			.setTitle('Message received')
			.setDescription(`\`\`\`${message}\`\`\``)
			.setTimestamp()

		if (this_channel) {	
			if (thread === null) {
				let messages = await interaction.channel.messages.fetchPinned();
				let id = messages.first();
				
				client.users.fetch(id.content).then(async user => {
					try {
						await user.send({ embeds: [clientEmbed] });
						await interaction.reply({ embeds: [serverEmbed] });	
					} catch (error) {
						await interaction.reply({ content: 'We ran into an unknown error. Please try again in a few minutes, or contact the help desk!', ephemeral: true});
                        console.error(error);
					}
				}).catch(async error => {
					await interaction.reply({ content: 'We couldn\'t find the user ID pinned message', ephemeral: true });
					console.error(error);
				});
			} else {
				await interaction.reply({ content: `You cannot select a channel while having \`this\` selected as \`${this_channel}\``, ephemeral: true });
			}
		} else {
			let messages = await thread.messages.fetchPinned();
			let id = messages.first();

			client.users.fetch(id.content).then(async user => {
				try {
					await user.send({ embeds: [clientEmbed] });
					await thread.send({ embeds: [serverEmbed] });
				} catch (error) {
					await interaction.reply({ content: 'We ran into an unknown error. Please try again in a few minutes, or contact the help desk!', ephemeral: true});
					console.error(error);	
				}	
			}).catch(async error => {
				await interaction.reply({ content: 'We couldn\'t find the user ID pinned message', ephemeral: true });
				console.error(error);
			});
		}
	},
};
