require("dotenv").config();
const { Telegraf } = require("telegraf");
const { convertNumberFormat, convertDateToPatern } = require("../utils/helper");
const axios = require("axios");

const url = process.env.BASE_URL;
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start((ctx) => ctx.reply("Selamat datang di Pantaucovid"));
bot.on("sticker", (ctx) => ctx.reply("👍"));

// Main command
bot.command("kasus", (ctx) => {
  getKasus(ctx);
});

async function getKasus(ctx) {
  try {
    const response = await axios.get(url);
    const lastUpdate = convertDateToPatern(response.data.lastUpdate.value);
    const confirmed = convertNumberFormat(response.data.confirmed.value);
    const recovered = convertNumberFormat(response.data.recovered.value);
    const deaths = convertNumberFormat(response.data.deaths.value);
    const message = `Update kasus ${lastUpdate} \nTerkonfirmasi Positif : ${confirmed} \nSembuh : ${recovered} \nMeninggal : ${deaths}`;
    ctx.reply(message);
  } catch (error) {
    console.log(error);
  }
}

bot.launch();
