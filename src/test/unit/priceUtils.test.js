const { calculatePriceWithTax } = require("../../utils/priceUtils");

describe("Utils: priceUtils", () => {
  
  test("You should apply a 21% tax to a price of 100", () => {
    expect(calculatePriceWithTax(100)).toBe(121);
  });

  test("You should apply a 10% tax to a price of 50", () => {
    expect(calculatePriceWithTax(50, 10)).toBe(55);
  });

  test("You should round the final price to 2 decimals", () => {
    expect(calculatePriceWithTax(59.99, 15)).toBe(68.99);
  });

  test("You should return null for negative price", () => {
    expect(calculatePriceWithTax(-50)).toBeNull();
  });

  test("ºYou should return null for negative tax percentage", () => {
    expect(calculatePriceWithTax(50, -10)).toBeNull();
  });
  
});
