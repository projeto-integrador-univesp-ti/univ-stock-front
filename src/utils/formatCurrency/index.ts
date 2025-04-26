const formatBRLCurrencytoNumber = (value: string): number => {
  return Number(value.replace(/\./g, "").replace(",", "."));
};

const formatToBRLCurrency = (value: string): string => {
  const numericValue = value.replace(/\D/g, "");
  const intValue = parseInt(numericValue, 10);

  if (isNaN(intValue)) return "";

  const formatted = (intValue / 100).toLocaleString("pt-BR", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatted;
};

const normalizeDecimal = (value: string): string => {
  const [int, dec = ""] = value.replace(/\./g, ",").split(",");
  const paddedDec = (dec + "00").slice(0, 2);
  return `${int},${paddedDec}`;
};

export { formatBRLCurrencytoNumber, formatToBRLCurrency, normalizeDecimal };
