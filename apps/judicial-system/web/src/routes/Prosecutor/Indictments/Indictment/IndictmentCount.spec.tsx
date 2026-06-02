import { createFormatMessage } from '@island.is/judicial-system-web/src/utils/testHelpers.logic'

import { getLegalArguments } from './IndictmentCount'

describe('getLegalArguments', () => {
  const formatMessage = createFormatMessage()

  test('should format legal arguments with article 95 and one other article', () => {
    const lawsBroken = [
      [58, 1],
      [95, 1],
    ]

    const result = getLegalArguments(lawsBroken, formatMessage)

    expect(result).toEqual(
      'Telst háttsemi þessi varða við 1. mgr. 58. gr., sbr. 1. mgr. 95. gr. umferðarlaga nr. 77/2019.',
    )
  })

  test('should format legal arguments with article 95 and two other articles', () => {
    const lawsBroken = [
      [49, 1],
      [49, 2],
      [58, 1],
      [95, 1],
    ]

    const result = getLegalArguments(lawsBroken, formatMessage)

    expect(result).toEqual(
      'Telst háttsemi þessi varða við 1., sbr. 2. mgr. 49. gr. og 1. mgr. 58. gr., sbr. 1. mgr. 95. gr. umferðarlaga nr. 77/2019.',
    )
  })

  test('should format legal arguments without article 95 and one other article', () => {
    const lawsBroken = [
      [49, 1],
      [49, 2],
    ]

    const result = getLegalArguments(lawsBroken, formatMessage)

    expect(result).toEqual(
      'Telst háttsemi þessi varða við 1., sbr. 2. mgr. 49. gr. umferðarlaga nr. 77/2019.',
    )
  })

  test('should format legal arguments without article 95 and two other articles', () => {
    const lawsBroken = [
      [49, 1],
      [49, 2],
      [58, 1],
    ]

    const result = getLegalArguments(lawsBroken, formatMessage)

    expect(result).toEqual(
      'Telst háttsemi þessi varða við 1., sbr. 2. mgr. 49. gr. og 1. mgr. 58. gr. umferðarlaga nr. 77/2019.',
    )
  })

  test('should format legal arguments with 95 and three other articles, not placing "sbr." after grouped articles unless it is the last one', () => {
    const lawsBroken = [
      [48, 1],
      [48, 2],
      [49, 1],
      [49, 3],
      [50, 1],
      [50, 2],
      [95, 1],
    ]

    const result = getLegalArguments(lawsBroken, formatMessage)

    expect(result).toEqual(
      'Telst háttsemi þessi varða við 1., sbr. 2. mgr. 48. gr., 1., sbr. 3. mgr. 49. gr. og 1., sbr. 2. mgr. 50. gr., sbr. 1. mgr. 95. gr. umferðarlaga nr. 77/2019.',
    )
  })

  test('should format legal arguments with speeding', () => {
    const lawsBroken = [
      [37, 0],
      [49, 1],
      [49, 2],
      [95, 1],
    ]

    const result = getLegalArguments(lawsBroken, formatMessage)

    expect(result).toEqual(
      'Telst háttsemi þessi varða við 37. gr. og 1., sbr. 2. mgr. 49. gr., sbr. 1. mgr. 95. gr. umferðarlaga nr. 77/2019.',
    )
  })

  test('should format a zero sub article that is not first', () => {
    const lawsBroken = [
      [37, 0],
      [49, 1],
      [49, 2],
      [21, 0],
      [95, 1],
    ]

    const result = getLegalArguments(lawsBroken, formatMessage)

    expect(result).toEqual(
      'Telst háttsemi þessi varða við 37. gr., 21. gr., og 1., sbr. 2. mgr. 49. gr., sbr. 1. mgr. 95. gr. umferðarlaga nr. 77/2019.',
    )
  })

  test('should format all zero sub articles', () => {
    const lawsBroken = [
      [37, 0],
      [21, 0],
      [95, 0],
    ]

    const result = getLegalArguments(lawsBroken, formatMessage)

    expect(result).toEqual(
      'Telst háttsemi þessi varða við 37. gr., 21. gr., og 95. gr. umferðarlaga nr. 77/2019.',
    )
  })

  test('should format multiple zero sub articles followed by multiple non-zero groups', () => {
    const lawsBroken = [
      [37, 0],
      [21, 0],
      [49, 1],
      [49, 2],
      [58, 1],
      [95, 1],
    ]

    const result = getLegalArguments(lawsBroken, formatMessage)

    // The "og" precedes the last non-zero group, so no comma is placed before it
    expect(result).toEqual(
      'Telst háttsemi þessi varða við 37. gr., 21. gr., 1., sbr. 2. mgr. 49. gr. og 1. mgr. 58. gr., sbr. 1. mgr. 95. gr. umferðarlaga nr. 77/2019.',
    )
  })

  test('should format a single zero sub article on its own', () => {
    const lawsBroken = [[37, 0]]

    const result = getLegalArguments(lawsBroken, formatMessage)

    expect(result).toEqual(
      'Telst háttsemi þessi varða við 37. gr. umferðarlaga nr. 77/2019.',
    )
  })

  test('should return an empty string when there are no laws broken', () => {
    const result = getLegalArguments([], formatMessage)

    expect(result).toEqual('')
  })

  test('should format the general law on its own without a leading comma', () => {
    const lawsBroken = [[95, 1]]

    const result = getLegalArguments(lawsBroken, formatMessage)

    expect(result).toEqual(
      'Telst háttsemi þessi varða við sbr. 1. mgr. 95. gr. umferðarlaga nr. 77/2019.',
    )
  })
})
