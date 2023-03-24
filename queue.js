const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, Message } = require("discord.js");

//discord-player library ALLOWS FOR SIMPLE FUNCTION CALLS (queue.skip, queue.resume, etc.)
module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Shows 5 songs currently in the queue"),
    execute: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guild);

        if (!queue || !queue.playing){
            await interaction.reply("There is no song playing.");
            return;
        }

        const queueString = queue.tracks.slice(0, 5).map((song, i) => {
            return `${i + 1}) [${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`;}).join("\n");
            //1) [00:00] \ song name ^song format

        const currentSong = queue.current;

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Currently Playing:**\n\` ${currentSong.title} - <@${currentSong.requestedBy.id}>\n\n**Queue:**\n${queueString}`)
            ]
        })
    }
}