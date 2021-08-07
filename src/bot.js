require("dotenv").config();
const { Telegraf } = require("telegraf");
const { convertNumberFormat, convertToPattern } = require("../common/helper");
const axios = require("axios");

const url_case = process.env.BASE_URL;
const url_vaccine = process.env.BASE_URL_VACCINE;
const repo_url = process.env.REPO_URL;
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start((ctx) =>
  ctx.reply(
    "Selamat datang di Pantaucovid masukan perintah '/menu' untuk melihat menu."
  )
);

bot.on("sticker", (ctx) => ctx.reply("👍"));

bot.command("menu", (ctx) => {
  bot.telegram.sendMessage(ctx.chat.id, "Pilih Menu :", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Kasus Harian", callback_data: "kasus" },
          { text: "Vaksin", callback_data: "vaksin" },
        ],
        [
          { text: "Info RS", callback_data: "rs" },
          {
            text: "Info Bot",
            url: repo_url,
          },
        ],
      ],
    },
  });
});

bot.action("kasus", async (ctx) => {
  try {
    const { data } = await axios.get(url_case);
    const { confirmed, recovered, deaths, lastUpdate } = data;

    const messages = `
    Update Kasus ${convertToPattern(lastUpdate.value)}
    🟠 positif : ${convertNumberFormat(confirmed.value)}
    🟢 sembuh : ${convertNumberFormat(recovered.value)}
    🔴 meninggal : ${convertNumberFormat(deaths.value)}
    `;
    bot.telegram.sendMessage(ctx.chat.id, messages);
  } catch (error) {
    console.log(error);
  }
});

bot.action("rs", async (ctx) => {
  bot.telegram.sendMessage(ctx.chat.id, "Soon");
});

bot.action("vaksin", async (ctx) => {
  try {
    const { data } = await axios.get(url_vaccine);
    const { last_updated, monitoring } = data;
    const {
      total_sasaran_vaksinasi,
      sasaran_vaksinasi_sdmk,
      sasaran_vaksinasi_petugas_publik,
      sasaran_vaksinasi_lansia,
      vaksinasi1,
      vaksinasi2,
    } = monitoring[0];

    const message = `
    Data ${convertToPattern(last_updated)}
    💉 Sasaran Vaksinasi :
    Total : ${convertNumberFormat(total_sasaran_vaksinasi)}
    SDMK  : ${convertNumberFormat(sasaran_vaksinasi_sdmk)}
    Petugas Publik : ${convertNumberFormat(sasaran_vaksinasi_petugas_publik)}
    Lansia : ${convertNumberFormat(sasaran_vaksinasi_lansia)}
    Dosis Vaksin 1 : ${convertNumberFormat(vaksinasi1)}
    Dosis Vaksin 2 : ${convertNumberFormat(vaksinasi2)}

    `;

    bot.telegram.sendMessage(ctx.chat.id, message);
  } catch (error) {
    console.log(error);
  }
});

bot.launch();
