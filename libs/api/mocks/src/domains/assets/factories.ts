import { factory, faker } from '@island.is/shared/mocking'

const townArray = [
  'Reykjavík',
  'Akureyri',
  'Siglufjörður',
  'Egilsstaðir',
  'Ísafjörður',
]

const streetArray = [
  'Langagata',
  'Stuttagata',
  'Norðurgata',
  'Suðurgata',
  'Eldfjallagata',
]

export const stadfang = factory<any>({
  stadfanganr: () => faker.helpers.replaceSymbolWithNumber('s???', '?'),
  sveitarfelag: () => faker.random.arrayElement(townArray),
  postnr: () => faker.random.number(800),
  stadvisir: () => faker.random.arrayElement(streetArray),
  stadgreinir: () => faker.random.number(99),
  landeignarnr: () => faker.helpers.replaceSymbolWithNumber('L????', '?'),
  display() {
    return `${this.stadvisir} ${this.stadgreinir}, ${this.sveitarfelag}`
  },
  displayShort() {
    return `${this.stadvisir} ${this.stadgreinir}`
  },
})

export const fasteign = factory<any>({
  fasteignanr: () => faker.helpers.replaceSymbolWithNumber('F?????', '?'),
  sjalfgefidStadfang: () => stadfang(),
})
