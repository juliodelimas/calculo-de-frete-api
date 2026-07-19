const { messages } = require("../glossary");
const { quoteFreight } = require("../services/freightService");
const { readJsonBody } = require("../utils/request");
const { sendJson } = require("../utils/http");

async function quoteFreightController(req, res) {
  let payload;

  try {
    payload = await readJsonBody(req);
  } catch (error) {
    sendJson(res, 400, { erro: messages.invalidJson });
    return;
  }

  const result = quoteFreight(payload);

  if (!result.success) {
    sendJson(res, 422, { erros: result.errors });
    return;
  }

  sendJson(res, 200, result.data);
}

module.exports = {
  quoteFreightController,
};
