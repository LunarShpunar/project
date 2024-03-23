export const PRODUCT_PRICES = {
  'Молоко 🥛': parseFloat(`${getRandomInt(2, 4)}.${getRandomInt(1, 99)}`),
  'Сыр 🧀': parseFloat(`${getRandomInt(5, 7)}.${getRandomInt(1, 99)}`),
  'Мороженое 🍦': parseFloat(`${getRandomInt(2, 4)}.${getRandomInt(1, 99)}`),
  'Масло 🧈': parseFloat(`${getRandomInt(7, 10)}.${getRandomInt(1, 99)}`),
}

export function generateData(size = 10) {
  const companies = times(Math.ceil(size / 4), (i) => `Company ${i}`)
  const products = Object.keys(PRODUCT_PRICES)
  return times(size, () => ({
    company:
      Math.random() < 0.3
        ? ''
        : companies[getRandomInt(0, companies.length - 1)],
    product:
      Math.random() < 0.2 ? '' : products[getRandomInt(0, products.length - 1)],
    count: getRandomInt(-3, 15),
  }))
}

function times(n, fn) {
  return Array.from({ length: n }, (_, i) => fn(i))
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
