require("dotenv").config();
const { Telegraf } = require("telegraf");
const { convertNumberFormat, convertToPattern } = require("../common/helper");
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
    const { data } = await axios.get(url);
    const { confirmed, recovered, deaths, lastUpdate } = data;

    const message = `Update kasus ${convertToPattern(
      lastUpdate.value
    )} \nPositif : ${convertNumberFormat(
      confirmed.value
    )} \nSembuh : ${convertNumberFormat(
      recovered.value
    )} \nMeninggal : ${convertNumberFormat(deaths.value)}`;

    ctx.reply(message);
  } catch (error) {
    console.log(error);
  }
}

bot.launch();
