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
} from '@island.is/api/schema'

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
  propertyNumber: () => faker.number.int(999),
  municipality: () => faker.helpers.arrayElement(townArray),
  postNumber: () => faker.number.int(800),
  locationNumber: () => faker.number.int(9999),
  displayShort: () =>
    `${faker.helpers.arrayElement(streetArray)} ${faker.number.int(99)}`,
  display() {
    return `${this.displayShort}, ${this.municipality}`
  },
})

export const singleProperty = factory<SimpleProperties>({
  propertyNumber: () => 'F' + faker.string.numeric(5),
  defaultAddress: () => stadfang(),
})

export const propertyAppraisal = factory<Appraisal>({
  plannedYear: new Date().getFullYear() + 1,
  activeYear: new Date().getFullYear(),

  activeAppraisal: () => faker.number.int({ min: 20000000, max: 50000000 }),
  plannedAppraisal() {
    return this.activeAppraisal ? this.activeAppraisal + 1500000 : null
  },

  activeStructureAppraisal: () =>
    faker.number.int({ min: 20000000, max: 50000000 }),
  plannedStructureAppraisal() {
    return this.activeStructureAppraisal
      ? this.activeStructureAppraisal + 1500000
      : null
  },

  activePlotAssessment: () =>
    faker.number.int({ min: 20000000, max: 50000000 }),
  plannedPlotAssessment() {
    return this.activePlotAssessment
      ? this.activePlotAssessment + 1500000
      : null
  },
})

export const propertyOwnerFactory = factory<PropertyOwner>({
  name: () => faker.person.fullName(),
  ssn: '0000000000',
  ownership: 0.5,
  purchaseDate: () => faker.date.past(),
  grantDisplay: 'A+',
})

export const propertyUnitOnUse = factory<UnitOfUse>({
  unitOfUseNumber: () => 'N' + faker.string.numeric(1),
  propertyNumber: () => 'F' + faker.string.numeric(5),
  address: () => stadfang(),
  marking: () => 'Íbúð ' + faker.string.numeric(1),
  usageDisplay: () => 'Notkun ' + faker.string.numeric(1),
  explanation: () => 'Skýring ' + faker.string.numeric(1),
  buildYearDisplay: '2008',
  displaySize: () => faker.number.int({ min: 100, max: 300 }),
  appraisal: () => propertyAppraisal(),
  fireAssessment: faker.number.int({
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
