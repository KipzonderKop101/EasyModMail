const { SlashCommandBuilder } = require('@discordjs/builders');

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
				.setDescription('Choose what thread you want to reply to')
				.setRequired(false)),
	async execute(interaction, client) {
		let guild = client.guilds.cache.get('850778582515056710');

		let this_channel = interaction.options.getBoolean('this');
		let thread = interaction.options.getChannel('thread');
        let message = interaction.options.getString('message');

		if (this_channel) {	
			if (thread === null) {
				let messages = await interaction.channel.messages.fetchPinned();
				let id = messages.first();

				client.users.fetch(id.content).then(async user => {
					await user.send(message).catch(async error => {
						await interaction.reply({ content: 'This user is not receiving DM\'s', ephemeral: true})
						console.error(error);
					});
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
				await user.send(message).catch(async error => {
					await interaction.reply({ content: 'This user is not receiving DM\'s', ephemeral: true });
					console.error(error);
				});
			}).catch(async error => {
				await interaction.reply({ content: 'We couldn\'t find the user ID pinned message', ephemeral: true });
				console.log(error);
			});
		}
	},
};
