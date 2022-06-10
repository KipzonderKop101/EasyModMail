const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('See what you can do with this bot')
        .addStringOption(option =>
            option.setName('selection')
                .setDescription('Select a help category')
                .setRequired(false)
                .addChoices(
                    { name: 'Thread', value: 'help_thread' },
                    { name: 'Reply', value: 'help_reply' },
                    { name: 'User', value: 'help_user' },
                )),
	async execute(interaction, client) {
		const generalHelpEmbed = new MessageEmbed()
            .setAuthor({ name: 'EasyModMail', url: 'https://github.com/KipzonderKop101/EasyModMail'})
            .addFields(
                { name: 'Thread', value: '`/help thread`', inline: true },
                { name: 'Replying', value: '`/help reply`', inline: true },
                { name: 'User', value: '`/help user`', inline: true },
            )
        
        const threadHelpEmbed = new MessageEmbed()
            .setTitle('Thread')
            .setDescription('Useful commands for your threads')
            .addFields(
                { name: '`/delete [thread] (optional reason)`', value: 'Delete a thread', inline: false },
                { name: '`/block [thread] (optional reason)`', value: 'Block a user from contacting mod-mail again', inline: false },
                { name: '`/archive [thread] (optional reason)`', value: 'Archive a thread', inline: false },
                { name: '`/transfer [thread] (optional reason)`', value: 'Transfer the thread to a different category', inline: false },
                { name: '`/permissions [thread] [role] (optional reason)`', value: 'Change the permissions of a thread', inline: false},
                { name: '`/close [thread] (optional message) (optional reason)`', value: 'Close a thread', inline: false}
            )
        
        const replyHelpEmbed = new MessageEmbed()
            .setTitle('Reply')
            .setDescription('The different ways to reply to a threat')
            .addFields(
                { name: '`/reply [thread] [message]`', value: 'Reply to a thread', inline: false },
                { name: '`/areply [thread] [message]`', value: 'Reply to a thread anonymously', inline: false },
                { name: '`/snippets [thread] [snippet]`', value: 'Transfer the thread to a different category', inline: false },
            )

        const userHelpEmbed = new MessageEmbed()
            .setTitle('User')
            .setDescription('Different actions you can perform regarding the threat opener, the user')
            .addFields(
                { name: '`/info [thread]`', value: 'Info on the user that started the thread', inline: false },
                { name: '`/kick [thread] (optional reason)`', value: 'Kick the user that started the thread', inline: false },
                { name: '`/ban [thread] (optional reason)`', value: 'Ban the user that started the thread', inline: false },
            )
    
        const selection = interaction.options.getString('selection');

        if (selection === 'help_thread') {
            await interaction.reply({ embeds: [threadHelpEmbed] });
        } else if (selection === 'help_reply') {
            await interaction.reply({ embeds: [replyHelpEmbed] });
        } else if (selection === 'help_user') {
            await interaction.reply({ embeds: [userHelpEmbed] });
        } else {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('helpMenu')
                        .setPlaceholder('Make a selection')
                        .addOptions([
                            {
                                label: 'Thread',
                                description: 'Useful commands for your threads',
                                value: 'select_threat',
                            }, 
                            {
                                label: 'Reply',
                                description: 'The different ways to reply to a threat',
                                value: 'select_reply',
                            },
                            {
                                label: 'User',
                                description: 'Different actions you can perform regarding the threat opener, the user',
                                value: 'select_user'
                            },
                        ]),
                );
            const message = await interaction.reply({ embeds: [generalHelpEmbed], components: [row] });

            client.on("interactionCreate", async click => {
                if (
                  click.user.id !== interaction.user.id || click.guildId !== interaction.guildId || !click.isSelectMenu()) return;

                if (click.customId === 'helpMenu') {
                    if (click.values[0]) {
                        await interaction.editReply({ embeds: [threadHelpEmbed], components: [] });
                    } else if (click.values[1]) {
                        await interaction.editReply({ embeds: [replyHelpEmbed], components: [] });
                    } else if (click.values[2]) {
                        await interaction.editReply({ embeds: [userHelpEmbed], components: [] });  
                    }
                  }
              });
        }
	},
};
