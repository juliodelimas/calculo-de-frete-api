const http = require("http");

const PORT = Number(process.env.PORT || 3000);

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";

    req.on("data", (chunk) => {
      raw += chunk;
    });

    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

function isCep(value) {
  return typeof value === "string" && /^[0-9]{8}$/.test(value);
}

function validarCotacao(payload) {
  const erros = [];

  if (!isCep(payload.cepOrigem)) {
    erros.push("CEP origem invalido");
  }

  if (!isCep(payload.cepDestino)) {
    erros.push("CEP de destino deve conter 8 digitos numericos");
  }

  if (typeof payload.pesoKg !== "number" || payload.pesoKg < 0 || payload.pesoKg > 50) {
    erros.push("Peso deve ser maior que zero");
  }

  if (typeof payload.valorDeclarado !== "number" || payload.valorDeclarado < 0) {
    erros.push("Valor declarado deve estar entre 0 e 10000");
  }

  if (!["ECONOMICO", "EXPRESSO", "RETIRADA"].includes(payload.modalidade)) {
    erros.push("Modalidade invalida");
  }

  return erros;
}

function calcularFaixaGeografica(cepOrigem, cepDestino) {
  if (cepOrigem[0] === cepDestino[0]) {
    return {
      tipo: "LOCAL",
      freteBase: 12,
      prazoBase: 2,
    };
  }

  if (cepOrigem.slice(0, 2) === cepDestino.slice(0, 2)) {
    return {
      tipo: "REGIONAL",
      freteBase: 18,
      prazoBase: 4,
    };
  }

  return {
    tipo: "NACIONAL",
    freteBase: 28,
    prazoBase: 7,
  };
}

function calcularAcrescimoPeso(pesoKg) {
  if (pesoKg <= 1) {
    return 0;
  }

  if (pesoKg <= 5) {
    return 5;
  }

  if (pesoKg <= 10) {
    return 10;
  }

  return 25;
}

function calcularCotacao(payload) {
  const faixa = calcularFaixaGeografica(payload.cepOrigem, payload.cepDestino);

  let valorFrete = faixa.freteBase + calcularAcrescimoPeso(payload.pesoKg);
  let prazoDias = faixa.prazoBase;

  if (payload.valorDeclarado >= 1000) {
    valorFrete += payload.valorDeclarado * 0.01;
  }

  if (payload.valorDeclarado > 500 && faixa.tipo === "LOCAL") {
    valorFrete = 0;
  }

  if (payload.modalidade === "EXPRESSO") {
    valorFrete *= 1.6;
    prazoDias -= 3;
  }

  if (payload.modalidade === "RETIRADA") {
    valorFrete = 0;
    prazoDias = 0;
  }

  return {
    valorFrete: Math.round(valorFrete),
    prazoDias,
    modalidade: payload.modalidade,
    mensagem: "Cotacao realizada com sucesso",
  };
}

async function handleCotacao(req, res) {
  let payload;

  try {
    payload = await readBody(req);
  } catch (error) {
    sendJson(res, 400, { erro: "JSON invalido" });
    return;
  }

  const erros = validarCotacao(payload);

  if (erros.length > 0) {
    sendJson(res, 422, { erros });
    return;
  }

  sendJson(res, 200, calcularCotacao(payload));
}

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    sendJson(res, 200, { status: "ok" });
    return;
  }

  if (req.method === "POST" && req.url === "/fretes/cotacao") {
    handleCotacao(req, res);
    return;
  }

  sendJson(res, 404, { erro: "Rota nao encontrada" });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`API de calculo de frete ouvindo na porta ${PORT}`);
  });
}

module.exports = {
  calcularCotacao,
  calcularFaixaGeografica,
  validarCotacao,
  server,
};
