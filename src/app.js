const http = require("http");
const { sendJson } = require("./utils/http");
const { freightRoutes } = require("./routes/freightRoutes");

function createApp() {
  return http.createServer(async (req, res) => {
    if (req.method === "GET" && req.url === "/health") {
      sendJson(res, 200, { status: "ok" });
      return;
    }

    const handled = await freightRoutes(req, res);

    if (!handled) {
      sendJson(res, 404, { erro: "Rota nao encontrada" });
    }
  });
}

module.exports = {
  createApp,
};
