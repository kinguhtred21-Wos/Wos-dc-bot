const { Client, GatewayIntentBits, Partials, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

const BOT_TOKEN = process.env.BOT_TOKEN;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages],
  partials: [Partials.Channel],
});

let registrations = {};

client.once("ready", () => {
  console.log(`Bot online: ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand() && interaction.commandName === "register") {
    await interaction.deferReply({ ephemeral: true });

    const modal = new ModalBuilder()
      .setCustomId("wos_reg")
      .setTitle("Register WOS ID");

    const wosInput = new TextInputBuilder()
      .setCustomId("wosId")
      .setLabel("Your WOS ID")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const serverInput = new TextInputBuilder()
      .setCustomId("server")
      .setLabel("Server/Region (optional)")
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder().addComponents(wosInput),
      new ActionRowBuilder().addComponents(serverInput)
    );

    await interaction.showModal(modal);
  }

  if (interaction.isModalSubmit() && interaction.customId === "wos_reg") {
    const wosId = interaction.fields.getTextInputValue("wosId");
    const server = interaction.fields.getTextInputValue("server") || "";

    registrations[interaction.user.id] = { wosId, server };

    const role = interaction.guild.roles.cache.find(r => r.name === "WOS Registered");
    if (role) await interaction.member.roles.add(role);

    await interaction.reply({ content: `✅ Registered! Your WOS ID (${wosId}) has been saved.`, ephemeral: true });
  }
});

client.login(BOT_TOKEN);
