import { factory, faker } from '@island.is/shared/mocking'
import {
  Stadfang,
  Fasteign,
  Fasteignamat,
  ThinglysturEigandi,
  Notkunareining,
  ThinglysturEigandiWrapper,
  NotkunareiningWrapper,
} from '@island.is/clients/assets'

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

export const pagingData = ({
  page = 1,
  pageSize = 10,
  total = 10,
  totalPages = 1,
  offset = 0,
  hasPreviousPage = false,
  hasNextPage = false,
}) => ({
  page,
  pageSize,
  total,
  totalPages,
  offset,
  hasPreviousPage,
  hasNextPage,
})

export const stadfang = factory<Stadfang>({
  stadfanganumer: () => faker.random.number(999),
  sveitarfelagBirting: () => faker.random.arrayElement(townArray),
  postnumer: () => faker.random.number(800),
  // stadvisir: () => faker.random.arrayElement(streetArray),
  // stadgreinir: () => faker.random.number(99).toString(),
  landeignarnumer: () => faker.random.number(9999),
  birtingStutt: () =>
    `${faker.random.arrayElement(streetArray)} ${faker.random.number(99)}`,
  birting() {
    return `${this.birtingStutt}, ${this.sveitarfelagBirting}`
  },
})

export const fasteign = factory<Fasteign>({
  fasteignanumer: () => faker.helpers.replaceSymbolWithNumber('F?????', '?'),
  sjalfgefidStadfang: () => stadfang(),
})

export const fasteignamat = factory<Fasteignamat>({
  fyrirhugadAr: new Date().getFullYear() + 1,
  // gildandiAr: new Date().getFullYear(),
  gildandiAr: new Date().getFullYear(),

  gildandiFasteignamat: () =>
    faker.random.number({ min: 20000000, max: 50000000 }),
  fyrirhugadFasteignamat() {
    return this.gildandiFasteignamat
      ? this.gildandiFasteignamat + 1500000
      : null
  },

  gildandiMannvirkjamat: () =>
    faker.random.number({ min: 20000000, max: 50000000 }),
  fyrirhugadMannvirkjamat() {
    return this.gildandiMannvirkjamat
      ? this.gildandiMannvirkjamat + 1500000
      : null
  },

  gildandiLodarhlutamat: () =>
    faker.random.number({ min: 20000000, max: 50000000 }),
  fyrirhugadLodarhlutamat() {
    return this.gildandiLodarhlutamat
      ? this.gildandiLodarhlutamat + 1500000
      : null
  },
})

export const eigandi = factory<ThinglysturEigandi>({
  nafn: () => faker.name.findName(),
  kennitala: '0000000000',
  eignarhlutfall: 0.5,
  kaupdagur: () => faker.date.past(),
  heimildBirting: 'A+',
})

export const notkunareining = factory<Notkunareining>({
  notkunareininganumer: () => faker.helpers.replaceSymbolWithNumber('N?', '?'),
  fasteignanumer: () => faker.helpers.replaceSymbolWithNumber('F?????', '?'),
  stadfang: () => stadfang(),
  merking: () => faker.helpers.replaceSymbolWithNumber('Íbúð ?', '?'),
  notkunBirting: () => faker.helpers.replaceSymbolWithNumber('Notkun ?', '?'),
  // starfsemi: () => faker.helpers.replaceSymbolWithNumber('Starfsemi ?', '?'),
  // lysing: () => faker.helpers.replaceSymbolWithNumber('Lýsing ?', '?'),
  skyring: () => faker.helpers.replaceSymbolWithNumber('Skýring ?', '?'),
  byggingararBirting: '2008',
  birtStaerd: () => faker.random.number({ min: 100, max: 300 }),
  birtStaerdMaelieining: 'ME',
  fasteignamat: () => fasteignamat(),
  // lodarmat: () => faker.random.number({ min: 1000000, max: 5000000 }),
  brunabotamat: faker.random.number({
    min: 20000000,
    max: 40000000,
  }),
})

export const assetDetail = factory<Fasteign>({
  ...fasteign(),
  fasteignamat: () => fasteignamat(),
  thinglystirEigendur: {
    data: eigandi.list(10),
    paging: pagingData({ hasNextPage: true }),
  },
  notkunareiningar: {
    data: notkunareining.list(2),
    paging: pagingData({ hasNextPage: true }),
  },
})

export const paginatedThinglystirEigendur = (hasNextPage = true) =>
  factory<ThinglysturEigandiWrapper>({
    data: eigandi.list(10),
    paging: pagingData({ hasNextPage }),
  })()

export const paginatedUnitsOfUse = (hasNextPage = true) =>
  factory<NotkunareiningWrapper>({
    data: notkunareining.list(10),
    paging: pagingData({ hasNextPage }),
  })()
