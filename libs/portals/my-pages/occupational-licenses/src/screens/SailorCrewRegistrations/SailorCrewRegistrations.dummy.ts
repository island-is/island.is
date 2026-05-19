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
  maritimeBookType: string
  dateFrom: string
  dateTo: string
}

export const DUMMY_EXEMPTIONS: RegistrationExemptionEntry[] = [
  {
    id: 'MOCK-1',
    shipName: '[MOCK] Testskip',
    rank: '[MOCK] Stýrimaður',
    dateFrom: '2015-10-11',
    dateTo: '2015-10-11',
    shipRegistrationNo: 'MOCK-3999',
    exemptionLowerStatus: '[MOCK] Já',
    advertised: '[MOCK] Nei',
    numberOfDays: '373',
  },
  {
    id: 'MOCK-2',
    shipName: '[MOCK] Testskip',
    rank: '[MOCK] Stýrimaður',
    dateFrom: '2015-10-11',
    dateTo: '2015-10-11',
    shipRegistrationNo: 'MOCK-4001',
    exemptionLowerStatus: '[MOCK] Nei',
    advertised: '[MOCK] Já',
    numberOfDays: '120',
  },
  {
    id: 'MOCK-3',
    shipName: '[MOCK] Testskip',
    rank: '[MOCK] Stýrimaður',
    dateFrom: '2015-10-11',
    dateTo: '2015-10-11',
    shipRegistrationNo: 'MOCK-4002',
    exemptionLowerStatus: '[MOCK] Já',
    advertised: '[MOCK] Nei',
    numberOfDays: '210',
  },
]

export const DUMMY_MARITIME_BOOKS: MaritimeBookEntry[] = [
  {
    id: 'MOCK-1',
    maritimeBookSerial: '[MOCK] 144322',
    maritimeBookType: '[MOCK] Sjómannabók',
    dateFrom: '2015-10-11',
    dateTo: '2015-10-11',
  },
  {
    id: 'MOCK-2',
    maritimeBookSerial: '[MOCK] 144323',
    maritimeBookType: '[MOCK] Sjómannabók',
    dateFrom: '2015-10-11',
    dateTo: '2015-10-11',
  },
  {
    id: 'MOCK-3',
    maritimeBookSerial: '[MOCK] 144324',
    maritimeBookType: '[MOCK] Sjómannabók',
    dateFrom: '2015-10-11',
    dateTo: '2015-10-11',
  },
]
