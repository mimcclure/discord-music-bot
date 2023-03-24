const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

//DEFINING SLASHCOMMAND, WHEN THE USER TYPES IN /PLAY IT'LL SHOW /PLAY + SUBCOMMANDS IN DISCORD CHAT
module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a song.")
        .addSubcommand(subcommmand => {
            return subcommmand
                .setName("search")
                .setDescription("Searches for a song.")
                .addStringOption(option => {
                    return option
                        .setName("searchterms")
                        .setDescription("Search keywords")
                        .setRequired(true);
                })
        })
        .addSubcommand(subcommmand => {
            return subcommmand
                .setName("playlist")
                .setDescription("Plays playlist from YouTube.")
                .addStringOption(option => {
                    return option
                        .setName("url")
                        .setDescription("Playlist URL")
                        .setRequired(true);
                })
        })
        .addSubcommand(subcommmand => {
            return subcommmand
                .setName("song")
                .setDescription("Plays song from YouTube")
                .addStringOption(option => {
                    return option
                        .setName("url")
                        .setDescription("Song URL")
                        .setRequired(true);
                })
        }),
    execute: async({client, interaction}) => {
        if (!interaction.member.voice.channel){
            await interaction.reply("Join a Voice Channel to use this command.");
            return;
        }

        const queue = await client.player.createQueue(interaction.guild);

        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new EmbedBuilder(); //returning embed (songs to user)
        if (interaction.options.getSubcommand() === "song"){
            let url = interaction.options.getString("url");

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO,
            });

            if (result.tracks.length === 0){
                await interaction.reply("No Results Found");
                return
            }

            const song = result.tracks[0]
            await queue.addTrack(song);

            embed.
                setDescription(`Added **[${song.title}](${song.url})** to Queue.`)
                .setFooter({text: `Duration: ${song.duration}`});
        }
        
        else if (interaction.options.getSubcommand() === "playlist"){
            let url = interaction.options.getString("url");

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST,
            });

            if (result.tracks.length === 0){
                await interaction.reply("No Playlist Found");
                return
            }

            const playlist = result.playlist;
            await queue.addTracks(playlist);

            embed.
                setDescription(`Added **[${playlist.title}](${playlist.url})** to Queue.`)
                .setFooter({text: `Duration: ${playlist.duration}`});
        }

        else if (interaction.options.getSubcommand() === "search"){
            let url = interaction.options.getString("searchterms");

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            });

            if (result.tracks.length === 0){
                await interaction.reply("No Results Found");
                return
            }

            const song = result.tracks[0]
            await queue.addTrack(song);

            embed.
                setDescription(`Added **[${song.title}](${song.url})** to Queue.`)
                .setFooter({text: `Duration: ${song.duration}`});
        }

        if (!queue.playing) await queue.play();

        await interaction.reply({
            embeds: [embed]
        })
    }
}