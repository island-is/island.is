import { parseNationalRegistryDate } from './health-insurance.utils'

describe('parseNationalRegistryDate', () => {
  it('supports icelandic dates', () => {
    // Act
    const date1 = parseNationalRegistryDate('29.5.2021 00:00:00')
    const date2 = parseNationalRegistryDate('1.5.2021 00:00:00')
    const date3 = parseNationalRegistryDate('1.10.2021 00:00:00')
    const date4 = parseNationalRegistryDate('11.12.2021 00:00:00')

    // Assert
    expect(date1).toEqual(new Date('2021-05-29'))
    expect(date2).toEqual(new Date('2021-05-01'))
    expect(date3).toEqual(new Date('2021-10-01'))
    expect(date4).toEqual(new Date('2021-12-11'))
  })

  it('supports iso dates', () => {
    // Act
    const date = parseNationalRegistryDate('2021-05-29T00:00:00Z')

    // Assert
    expect(date).toEqual(new Date('2021-05-29'))
  })

  it('returns undefined for other inputs', () => {
    // Act
    const test1 = parseNationalRegistryDate(null)
    const test2 = parseNationalRegistryDate('unexpected')
    const test3 = parseNationalRegistryDate('2021--12-32')

    // Assert
    expect(test1).toEqual(undefined)
    expect(test2).toEqual(undefined)
    expect(test3).toEqual(undefined)
  })
})
