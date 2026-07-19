const { createApp } = require("./app");

const PORT = Number(process.env.PORT || 3000);

const server = createApp();

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`API de calculo de frete ouvindo na porta ${PORT}`);
  });
}

module.exports = server;
