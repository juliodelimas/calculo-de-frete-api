const { messages } = require("../glossary");
const {
  findGeographicPrice,
  findWeightSurcharge,
} = require("../repositories/freightRepository");

function quoteFreight(payload) {
  const errors = validateQuote(payload);

  if (errors.length > 0) {
    return {
      success: false,
      errors,
    };
  }

  const geographicPrice = findGeographicPrice(payload.cepOrigem, payload.cepDestino);

  let freightValue = geographicPrice.basePrice + findWeightSurcharge(payload.pesoKg);
  let deliveryDays = geographicPrice.baseDeliveryDays;

  if (payload.valorDeclarado >= 1000) {
    freightValue += payload.valorDeclarado * 0.01;
  }

  if (payload.valorDeclarado > 500 && geographicPrice.type === "LOCAL") {
    freightValue = 0;
  }

  if (payload.modalidade === "EXPRESSO") {
    freightValue *= 1.6;
    deliveryDays -= 3;
  }

  if (payload.modalidade === "RETIRADA") {
    freightValue = 0;
    deliveryDays = 0;
  }

  return {
    success: true,
    data: {
      valorFrete: Math.round(freightValue),
      prazoDias: deliveryDays,
      modalidade: payload.modalidade,
      mensagem: messages.quoteCreated,
    },
  };
}

function validateQuote(payload) {
  const errors = [];

  if (!isCep(payload.cepOrigem)) {
    errors.push(messages.invalidOriginZipCode);
  }

  if (!isCep(payload.cepDestino)) {
    errors.push(messages.invalidDestinationZipCode);
  }

  if (typeof payload.pesoKg !== "number" || payload.pesoKg < 0 || payload.pesoKg > 50) {
    errors.push(messages.invalidWeight);
  }

  if (typeof payload.valorDeclarado !== "number" || payload.valorDeclarado < 0) {
    errors.push(messages.invalidDeclaredValue);
  }

  if (!["ECONOMICO", "EXPRESSO", "RETIRADA"].includes(payload.modalidade)) {
    errors.push(messages.invalidDeliveryMethod);
  }

  return errors;
}

function isCep(value) {
  return typeof value === "string" && /^[0-9]{8}$/.test(value);
}

module.exports = {
  quoteFreight,
  validateQuote,
};
