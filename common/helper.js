const moment = require("moment");

function convertToPattern(date) {
  return moment(date).locale("id").format("LL");
}

function convertNumberFormat(number) {
  return number.toLocaleString("id-ID");
}

module.exports = { convertNumberFormat, convertToPattern };
