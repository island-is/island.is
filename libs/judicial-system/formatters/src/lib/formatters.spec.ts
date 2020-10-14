import { CaseCustodyRestrictions } from '@island.is/judicial-system/types'

import * as Constants from './constants'
import { formatDate, formatCustodyRestrictions, capitalize } from './formatters'

describe('formatDate', () => {
  test('should return null if date parameter is not provided or is invalid', () => {
    // Arrange
    const date = null
    const date2 = undefined

    // Act
    const time = formatDate(date, Constants.TIME_FORMAT)
    const time2 = formatDate(date2, Constants.TIME_FORMAT)

    // Assert
    expect(time).toBeNull()
    expect(time2).toBeNull()
  })

  test('should return the time with 24h format', () => {
    // Arrange
    const date = '2020-09-10T09:36:57.287Z'
    const date2 = '2020-09-23T23:36:57.287Z'

    // Act
    const time = formatDate(date, Constants.TIME_FORMAT)
    const time2 = formatDate(date2, Constants.TIME_FORMAT)

    // Assert
    expect(time).toEqual('09:36')
    expect(time2).toEqual('23:36')
  })
})

describe('renderRestrictions', () => {
  test('should return a comma separated list of restrictions', () => {
    // Arrange
    const restrictions: CaseCustodyRestrictions[] = [
      CaseCustodyRestrictions.ISOLATION,
      CaseCustodyRestrictions.COMMUNICATION,
    ]

    // Act
    const r = formatCustodyRestrictions(restrictions)

    // Assert
    expect(r).toEqual('B - Einangrun, D - Bréfskoðun, símabann')
  })

  test('should return "Lausgæsla" if no custody restriction is supplyed', () => {
    // Arrange
    const restrictions: CaseCustodyRestrictions[] = []

    // Act
    const r = formatCustodyRestrictions(restrictions)

    // Assert
    expect(r).toEqual('Lausagæsla')
  })
})

describe('capitalize', () => {
  test('should return empty string if text is empty', () => {
    // Arrange
    const text = (undefined as unknown) as string

    // Act
    const r = capitalize(text)

    // Assert
    expect(r).toBe('')
  })
})
