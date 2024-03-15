// domicileCheck.test.ts

import { ResidenceEntryDto } from '@island.is/clients/national-registry-v2'
import { getDomicileAtPostalCodeOnDate } from './grindavik-housing-buyout.utils'

// Mock data for testing
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

describe('hasDomicileAtPostalCodeOnDate', () => {
  it('should return true for a postal code and date matching an entry', () => {
    const result = getDomicileAtPostalCodeOnDate(
      mockDomicileData,
      '1000',
      '2023-01-02',
    )
    expect(result).toBeTruthy()
  })

  it('should return false for a postal code not matching any entry', () => {
    const result = getDomicileAtPostalCodeOnDate(
      mockDomicileData,
      '9999',
      '2023-01-02',
    )
    expect(result).toBeFalsy()
  })

  it('should return false for a date before the domicile start date', () => {
    const result = getDomicileAtPostalCodeOnDate(
      mockDomicileData,
      '1000',
      '2022-12-31',
    )
    expect(result).toBeFalsy()
  })

  it('should handle null postal codes correctly', () => {
    // Adding an entry with a null postal code for this test
    const dataWithNullPostalCode = [
      ...mockDomicileData,
      {
        city: 'CityC',
        postalCode: null,
        streetName: 'StreetC',
        municipalityCode: '300',
        houseIdentificationCode: '300000000003',
        realEstateNumber: '3',
        country: 'CountryC',
        dateOfChange: '2023-07-01T00:00:00.000Z',
      },
    ] as ResidenceEntryDto[]

    const result = getDomicileAtPostalCodeOnDate(
      dataWithNullPostalCode,
      '3000',
      '2023-08-01',
    )
    expect(result).toBeFalsy()
  })

  it('should handle null dates correctly', () => {
    // Adding an entry with a null date for this test
    const dataWithNullDate = [
      ...mockDomicileData,
      {
        city: 'CityD',
        postalCode: '4000',
        streetName: 'StreetD',
        municipalityCode: '400',
        houseIdentificationCode: '400000000004',
        realEstateNumber: '4',
        country: 'CountryD',
        dateOfChange: null,
      },
    ] as ResidenceEntryDto[]

    const result = getDomicileAtPostalCodeOnDate(
      dataWithNullDate,
      '4000',
      '2023-08-01',
    )
    expect(result).toBeFalsy()
  })
})
