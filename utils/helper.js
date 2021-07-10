const moment = require("moment");

function convertDateToPatern(date) {
  return moment(date).locale("id").format("LL");
}

function convertNumberFormat(number) {
  return number.toLocaleString("id-ID");
}

module.exports = { convertNumberFormat, convertDateToPatern };
