require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ================== KONFIGURASI ==================
const TOKEN = process.env.DISCORD_TOKEN;

if (!TOKEN) {
  console.error("❌ DISCORD_TOKEN belum ditemukan (.env)");
  process.exit(1);
}

// username in-game (WAJIB lowercase) → Discord user
const PLAYER_MAP = {
  "jeeyugg": {
    userId: "1379366018287145052",
    displayName: "Jeeyugg"
  },
  "brendonp18": {
    userId: "352821498966310912",
    displayName: "brendonp18"
  },
  "brendontalon2gether": {
    userId: "352821498966310912",
    displayName: "BrendonTalon2gether"
  },
  "kingtalon1k": {
    userId: "352821498966310912",
    displayName: "KingTalon1k"
  }
};

// 🎨 WARNA RARITY
const RARITY_COLOR = {
  common: 0x95a5a6,
  uncommon: 0x2ecc71,
  rare: 0x9b59b6,
  epic: 0xe74c3c,
  legendary: 0xf1c40f,
  secret: 0x1abc9c // tosca terang
};
// =================================================

// ✅ READY EVENT TANPA WARNING
client.once("clientReady", () => {
  console.log(`🤖 Bot online sebagai ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  // ❌ hanya webhook
  if (!message.webhookId) return;
  if (!message.embeds || message.embeds.length === 0) return;

  const embed = message.embeds[0];

  // Gabungkan title + description untuk deteksi username
  const combinedText = (
    `${embed.title || ""}\n${embed.description || ""}`
  ).toLowerCase();

  // 🐟 Ambil & BERSIHKAN nama ikan (INI KUNCI FIX)
  let fishName =
    embed.fields
      ?.find(f =>
        f.name.toLowerCase().includes("fish name") ||
        f.name.toLowerCase().includes("name")
      )
      ?.value || "Unknown Fish";

  fishName = fishName
    .replace(/^>\s*/g, "")     // hapus >
    .replace(/\n/g, " ")       // hapus newline
    .trim();

  // ⭐ Ambil rarity
  let rarity =
    embed.fields
      ?.find(f =>
        f.name.toLowerCase().includes("tier") ||
        f.name.toLowerCase().includes("rarity")
      )
      ?.value || "common";

  rarity = rarity.toLowerCase().replace(/\n/g, "").trim();

  for (const [gameName, data] of Object.entries(PLAYER_MAP)) {
    if (!combinedText.includes(gameName)) continue;

    const resultEmbed = new EmbedBuilder()
      .setTitle("🎣 Fish Caught!")
      .setColor(RARITY_COLOR[rarity] || 0xffffff)
      .setDescription(
        `👤 <@${data.userId}>\n` +
        `✨ **${data.displayName} naik   ${fishName}**`
      )
      .setFooter({ text: "auto tag by brendon si raja iblis" })
      .setTimestamp();

    await message.channel.send({ embeds: [resultEmbed] });
    break;
  }
});

client.login(TOKEN);
