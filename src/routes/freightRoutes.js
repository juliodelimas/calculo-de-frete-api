const { quoteFreightController } = require("../controllers/freightController");

async function freightRoutes(req, res) {
  if (req.method === "POST" && req.url === "/fretes/cotacao") {
    await quoteFreightController(req, res);
    return true;
  }

  return false;
}

module.exports = {
  freightRoutes,
};
