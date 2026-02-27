const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const play = require('play-dl');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith('!play')) return;

    const args = message.content.split(' ').slice(1).join(' ');
    if (!args) return message.reply("اكتب اسم المقطع يا عبد الله!");

    const channel = message.member.voice.channel;
    if (!channel) return message.reply("ادخل روم صوتي أولاً!");

    try {
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
            selfDeaf: false 
        });

        let yt_info = await play.search(args, { limit: 1 });
        if (yt_info.length === 0) return message.reply("ما لقيت شي، جرب اسم ثاني.");

        let stream = await play.stream(yt_info[0].url);
        let resource = createAudioResource(stream.stream, { inputType: stream.type });
        let player = createAudioPlayer();

        player.play(resource);
        connection.subscribe(player);

        message.reply(`🔊 من عيوني، جاري تشغيل: **${yt_info[0].title}**`);

    } catch (error) {
        console.error(error);
        message.reply("يوتيوب معلق شوي، جرب مرة ثانية.");
    }
});

client.login(process.env.DISCORD_TOKEN);