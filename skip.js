const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, Message } = require("discord.js");

//discord-player library ALLOWS FOR SIMPLE FUNCTION CALLS (queue.skip, queue.resume, etc.)
module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips current song."),
    execute: async ({ client, interaction }) => {

        const queue = client.player.getQueue(interaction.guild);

        if (!queue){
            await interaction.reply("There is no song playing.");
            return;
        } 

        const currentSong = queue.current;

        queue.skip();

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Skipped **${currentSong.title}**`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}