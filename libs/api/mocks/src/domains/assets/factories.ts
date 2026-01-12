import { factory, faker } from '@island.is/shared/mocking'
import {
  PropertyLocation,
  SimpleProperties,
  Appraisal,
  PropertyOwner,
  UnitOfUse,
  PropertyDetail,
  PropertyOwnersModel,
  UnitsOfUseModel,
} from '../../types'

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

export const stadfang = factory<PropertyLocation>({
  propertyNumber: () => faker.datatype.number(999),
  municipality: () => faker.random.arrayElement(townArray),
  postNumber: () => faker.datatype.number(800),
  locationNumber: () => faker.datatype.number(9999),
  displayShort: () =>
    `${faker.random.arrayElement(streetArray)} ${faker.datatype.number(99)}`,
  display() {
    return `${this.displayShort}, ${this.municipality}`
  },
})

export const singleProperty = factory<SimpleProperties>({
  propertyNumber: () => faker.helpers.replaceSymbolWithNumber('F?????', '?'),
  defaultAddress: () => stadfang(),
})

export const propertyAppraisal = factory<Appraisal>({
  plannedYear: new Date().getFullYear() + 1,
  activeYear: new Date().getFullYear(),

  activeAppraisal: () =>
    faker.datatype.number({ min: 20000000, max: 50000000 }),
  plannedAppraisal() {
    return this.activeAppraisal ? this.activeAppraisal + 1500000 : null
  },

  activeStructureAppraisal: () =>
    faker.datatype.number({ min: 20000000, max: 50000000 }),
  plannedStructureAppraisal() {
    return this.activeStructureAppraisal
      ? this.activeStructureAppraisal + 1500000
      : null
  },

  activePlotAssessment: () =>
    faker.datatype.number({ min: 20000000, max: 50000000 }),
  plannedPlotAssessment() {
    return this.activePlotAssessment
      ? this.activePlotAssessment + 1500000
      : null
  },
})

export const propertyOwnerFactory = factory<PropertyOwner>({
  name: () => faker.name.findName(),
  ssn: '0000000000',
  ownership: 0.5,
  purchaseDate: () => faker.date.past(),
  grantDisplay: 'A+',
})

export const propertyUnitOnUse = factory<UnitOfUse>({
  unitOfUseNumber: () => faker.helpers.replaceSymbolWithNumber('N?', '?'),
  propertyNumber: () => faker.helpers.replaceSymbolWithNumber('F?????', '?'),
  address: () => stadfang(),
  marking: () => faker.helpers.replaceSymbolWithNumber('Íbúð ?', '?'),
  usageDisplay: () => faker.helpers.replaceSymbolWithNumber('Notkun ?', '?'),
  explanation: () => faker.helpers.replaceSymbolWithNumber('Skýring ?', '?'),
  buildYearDisplay: '2008',
  displaySize: () => faker.datatype.number({ min: 100, max: 300 }),
  appraisal: () => propertyAppraisal(),
  fireAssessment: faker.datatype.number({
    min: 20000000,
    max: 40000000,
  }),
})

export const assetDetail = factory<PropertyDetail>({
  defaultAddress: singleProperty().defaultAddress,
  propertyNumber: singleProperty().propertyNumber,
  appraisal: () => propertyAppraisal(),
  registeredOwners: {
    registeredOwners: propertyOwnerFactory.list(10),
    paging: pagingData({ hasNextPage: true }),
  },
  unitsOfUse: {
    unitsOfUse: propertyUnitOnUse.list(2),
    paging: pagingData({ hasNextPage: true }),
  },
  land: {
    landNumber: '123456',
    landAppraisal: 75000000,
    useDisplay: 'Íbúðarhúsalóð',
    area: '300000',
    areaUnit: 'm²',
    registeredOwners: {
      registeredOwners: [],
      paging: null,
    },
  },
})

export const paginatedConfirmedOwners = (hasNextPage = true) =>
  factory<PropertyOwnersModel>({
    registeredOwners: propertyOwnerFactory.list(10),
    paging: pagingData({ hasNextPage }),
  })()

export const paginatedUnitsOfUse = (hasNextPage = true) =>
  factory<UnitsOfUseModel>({
    unitsOfUse: propertyUnitOnUse.list(10),
    paging: pagingData({ hasNextPage }),
  })()
