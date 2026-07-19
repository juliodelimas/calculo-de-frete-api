const geographicPrices = {
  local: {
    type: "LOCAL",
    basePrice: 12,
    baseDeliveryDays: 2,
  },
  regional: {
    type: "REGIONAL",
    basePrice: 18,
    baseDeliveryDays: 4,
  },
  national: {
    type: "NACIONAL",
    basePrice: 28,
    baseDeliveryDays: 7,
  },
};

const weightSurcharges = [
  { limit: 1, surcharge: 0 },
  { limit: 5, surcharge: 5 },
  { limit: 10, surcharge: 10 },
  { limit: 30, surcharge: 25 },
];

function findGeographicPrice(originZipCode, destinationZipCode) {
  if (originZipCode[0] === destinationZipCode[0]) {
    return geographicPrices.local;
  }

  if (originZipCode.slice(0, 2) === destinationZipCode.slice(0, 2)) {
    return geographicPrices.regional;
  }

  return geographicPrices.national;
}

function findWeightSurcharge(weightKg) {
  const priceRange = weightSurcharges.find((range) => weightKg <= range.limit);

  if (!priceRange) {
    return 25;
  }

  return priceRange.surcharge;
}

module.exports = {
  findGeographicPrice,
  findWeightSurcharge,
};
