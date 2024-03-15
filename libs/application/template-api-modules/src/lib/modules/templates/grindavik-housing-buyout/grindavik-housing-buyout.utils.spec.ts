// domicileCheck.test.ts

import { ResidenceEntryDto } from '@island.is/clients/national-registry-v2'
import { getDomicileOnDate } from './grindavik-housing-buyout.utils' // Mock data for testing
const mockDomicileData = [
  {
    city: 'CityA',
    postalCode: '1000',
    streetName: 'StreetA',
    municipalityCode: '100',
    houseIdentificationCode: '100000000001',
    realEstateNumber: '1',
    country: 'CountryA',
    dateOfChange: new Date('2023-01-01T00:00:00.000Z'),
  },
  {
    city: 'CityB',
    postalCode: '2000',
    streetName: 'StreetB',
    municipalityCode: '200',
    houseIdentificationCode: '200000000002',
    realEstateNumber: '2',
    country: 'CountryB',
    dateOfChange: new Date('2023-05-15T00:00:00.000Z'),
  },
] as ResidenceEntryDto[]

describe('getDomicileOnDate', () => {
  it('should return the residence entry for the given date', () => {
    const result = getDomicileOnDate(mockDomicileData, '2023-01-01')
    expect(result).toEqual(mockDomicileData[0])
  })

  it('should return null if no residence entry matches the given date', () => {
    const result = getDomicileOnDate(mockDomicileData, '2022-12-31')
    expect(result).toBeNull()
  })
  it('should return entry if the value is null. ', () => {
    const data = [
      {
        city: 'CityC',
        postalCode: '2000',
        streetName: 'StreetC',
        municipalityCode: '200',
        houseIdentificationCode: '300000000003',
        realEstateNumber: '3',
        country: 'CountryC',
        dateOfChange: null,
      },
    ]
    const result = getDomicileOnDate(data, '2022-12-31')
    expect(result).toEqual(data[0])
  })
})
