export type RegistrationExemptionEntry = {
  id: string
  shipName: string
  rank: string
  dateFrom: string
  dateTo: string
  shipRegistrationNo: string
  exemptionLowerStatus: string
  advertised: string
  numberOfDays: string
}

export type MaritimeBookEntry = {
  id: string
  maritimeBookSerial: string
  dateFrom: string
  dateTo: string
}

export const DUMMY_EXEMPTIONS: RegistrationExemptionEntry[] = [
  {
    id: '1',
    shipName: 'Testskip',
    rank: 'Stýrimaður',
    dateFrom: '2015-10-11',
    dateTo: '2015-10-11',
    shipRegistrationNo: '3999',
    exemptionLowerStatus: 'Já',
    advertised: 'Nei',
    numberOfDays: '373',
  },
  {
    id: '2',
    shipName: 'Testskip',
    rank: 'Stýrimaður',
    dateFrom: '2015-10-11',
    dateTo: '2015-10-11',
    shipRegistrationNo: '4001',
    exemptionLowerStatus: 'Nei',
    advertised: 'Já',
    numberOfDays: '120',
  },
  {
    id: '3',
    shipName: 'Testskip',
    rank: 'Stýrimaður',
    dateFrom: '2015-10-11',
    dateTo: '2015-10-11',
    shipRegistrationNo: '4002',
    exemptionLowerStatus: 'Já',
    advertised: 'Nei',
    numberOfDays: '210',
  },
]

export const DUMMY_MARITIME_BOOKS: MaritimeBookEntry[] = [
  {
    id: '1',
    maritimeBookSerial: '144322',
    dateFrom: '2015-10-11',
    dateTo: '2015-10-11',
  },
  {
    id: '2',
    maritimeBookSerial: '144323',
    dateFrom: '2015-10-11',
    dateTo: '2015-10-11',
  },
  {
    id: '3',
    maritimeBookSerial: '144324',
    dateFrom: '2015-10-11',
    dateTo: '2015-10-11',
  },
]
