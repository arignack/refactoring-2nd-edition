import { usd } from './src/printBill.js';

test('validates the format', () => {
  expect(usd(1000)).toBe("$1,000.00");
});
