const sum = require('./sum');
const usd = require('./printBill');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

test('validates the format', () => {
  expect(usd(1000)).toBe("$1,000.00");
});
