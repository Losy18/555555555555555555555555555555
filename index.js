const { Client, Intents, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const rules = require('./rules.json');
const fs = require('fs');
const { startServer } = require("./alive.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


client.once("ready", () => {
  console.log(`Bot is Ready! ${client.user.tag}`);
  console.log(`Code by Moha Store`);
  console.log(`discord.gg/mo3`);
});


client.on('messageCreate', async message => {
  if (message.content === '!rules') {
    if (message.member.permissions.has("ADMINISTRATOR")) {
      const row = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('قائمة القوانين')
            .addOptions(rules.map(rule => ({
              label: rule.title,
              description: rule.id,
              value: rule.id,
            }))),
        );

      const embed = new MessageEmbed()
        .setColor('#d6d4d4')
        .setThumbnail('https://cdn.discordapp.com/attachments/1174757681676947476/1198812599760977921/LOGO4000X4000.png?ex=65dbf3bc&is=65c97ebc&hm=c45e29125ae787e43e060380a560cc9eae4878b4679937cf65b28dd5f3d240b6&')
        .setTitle('قوانين السيرفر')
        .setDescription('**الرجاء اختيار احد القوانين لقرائته من قائمة الاختيارات تحت**')
        .setImage('https://cdn.discordapp.com/attachments/1174757681676947476/1198812442126467223/BannerDiscord.png?ex=65dbf397&is=65c97e97&hm=1aa057b90eda2fb49b07b3dacf8e6f6c09af3dbba0519e35758f2ebfd7c548de&')
        .setFooter({ text: '𝐂𝐫𝐢𝐦𝐢𝐧𝐚𝐥𝐬 𝐂𝐢𝐭𝐲' })
        .setTimestamp();

      const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });
      await message.delete();
    } else {
      await message.reply({ content: "You need to be an administrator to use this command.", ephemeral: true });
    }
  }
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isSelectMenu()) {
    const rule = rules.find(r => r.id === interaction.values[0]);
    const text = fs.readFileSync(rule.description, 'utf-8');
    const ruleEmbed = new MessageEmbed()
      .setColor('#d6d4d4')
      .setTitle(rule.title)
      .setDescription(text)
      .setFooter({ text: '𝐂𝐫𝐢𝐦𝐢𝐧𝐚𝐥𝐬 𝐂𝐢𝐭𝐲' })
      .setTimestamp();

    await interaction.reply({ embeds: [ruleEmbed], ephemeral: true });
  }
});

startServer();

client.login(process.env.TOKEN);
