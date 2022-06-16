const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reply')
		.setDescription('Reply to a threat')
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
		let user = interaction.channel.name.replace('-', '#');

		const this_channel = interaction.options.getBoolean('this');
		const thread = interaction.options.getChannel('thread');
		
		if (this_channel) {	
			if (thread === null) {
				interaction.channel.messages.fetchPinned().then(id => console.log(id));
			} else {
				await interaction.reply({ content: `You cannot select a channel while having \`this\` selected as \`${this_channel}\``, ephemeral: true });
			}
		} else {
			console.log(thread);
		}
	},
};
