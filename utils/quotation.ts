export function generateQuotationNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().substring(2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(
    4,
    "0",
  );

  return `QT-${year}${month}-${randomNum}`;
}

export function calculateTotal(
  selectedProducts: Array<{ productId: string; quantity: number }>,
  warrantyPrice: number,
  products: any[],
  paymentMultiplier: number = 1,
): number {
  // Calculate base price
  let baseTotal = warrantyPrice;

  for (const item of selectedProducts) {
    const product = products.find((p) => p.id === item.productId);
    if (product) {
      baseTotal += product.unitPrice * item.quantity;
    }
  }

  // Apply payment multiplier
  return baseTotal * paymentMultiplier;
}

export function calculatePaymentDetails(
  totalPrice: number,
  paymentOption: any,
): {
  totalCost: number;
  deposit: number;
  monthlyPayment: number | null;
  term: number | null;
} {
  if (!paymentOption || paymentOption.type === "one-off") {
    return {
      totalCost: totalPrice,
      deposit: totalPrice,
      monthlyPayment: null,
      term: null,
    };
  }

  // For lease options
  if (paymentOption.type === "lease") {
    const totalCost = totalPrice;
    const deposit = totalCost * (paymentOption.depositPercentage / 100);
    const remainingAmount = totalCost - deposit;
    const monthlyPayment = remainingAmount / paymentOption.termMonths;

    return {
      totalCost,
      deposit,
      monthlyPayment,
      term: paymentOption.termMonths,
    };
  }

  // For rental options
  if (paymentOption.type === "rental") {
    const deposit = totalPrice * (paymentOption.depositPercentage / 100);
    const monthlyPayment = (totalPrice * paymentOption.multiplier) /
      paymentOption.termMonths;
    const totalCost = deposit + (monthlyPayment * paymentOption.termMonths);

    return {
      totalCost,
      deposit,
      monthlyPayment,
      term: paymentOption.termMonths,
    };
  }

  // Default fallback
  return {
    totalCost: totalPrice,
    deposit: totalPrice,
    monthlyPayment: null,
    term: null,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function calculateValidUntil(date: Date, daysValid = 30): Date {
  const validUntil = new Date(date);
  validUntil.setDate(validUntil.getDate() + daysValid);
  return validUntil;
}
