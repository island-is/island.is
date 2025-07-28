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

  test('should format legal arguments with 95 and six other articles, not placing "sbr." after grouped articles unless it is the last one', () => {
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
})
