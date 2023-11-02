import { createIntl } from 'react-intl'

import { Substance, SubstanceMap } from '@island.is/judicial-system/types'
import { IndictmentCountOffense as offense } from '@island.is/judicial-system-web/src/graphql/schema'

import {
  getIncidentDescriptionReason,
  getLegalArguments,
  getRelevantSubstances,
} from './IndictmentCount'

const formatMessage = createIntl({
  locale: 'is',
  onError: jest.fn,
}).formatMessage

describe('getRelevantSubstances', () => {
  test('should return relevant substances in the correct order for the indictment description', () => {
    const offenses = [
      offense.DRUNK_DRIVING,
      offense.ILLEGAL_DRUGS_DRIVING,
      offense.PRESCRIPTION_DRUGS_DRIVING,
    ]
    const substances: SubstanceMap = {
      [Substance.AMPHETAMINE]: '10',
      [Substance.MORPHINE]: '30',
      [Substance.ETIZOLAM]: '0.5',
      [Substance.ALCOHOL]: '1.10',
    }

    const result = getRelevantSubstances(offenses, substances)

    expect(result).toEqual([
      ['ALCOHOL', '1.10'],
      ['AMPHETAMINE', '10'],
      ['ETIZOLAM', '0.5'],
      ['MORPHINE', '30'],
    ])
  })
})

describe('getLegalArguments', () => {
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
})

describe('getIncidentDescriptionReason', () => {
  test('should return a description for one offense', () => {
    const offenses = [offense.DRIVING_WITHOUT_LICENCE]

    const result = getIncidentDescriptionReason(offenses, {}, formatMessage)

    expect(result).toBe('sviptur ökurétti')
  })

  test('should return a description for two offense', () => {
    const offenses = [offense.DRIVING_WITHOUT_LICENCE, offense.DRUNK_DRIVING]

    const result = getIncidentDescriptionReason(offenses, {}, formatMessage)

    expect(result).toBe('sviptur ökurétti og undir áhrifum áfengis')
  })

  test('should return a description with prescription drugs', () => {
    const offenses = [offense.DRUNK_DRIVING, offense.PRESCRIPTION_DRUGS_DRIVING]

    const result = getIncidentDescriptionReason(offenses, {}, formatMessage)

    expect(result).toBe(
      'undir áhrifum áfengis og óhæfur til að stjórna henni örugglega vegna áhrifa slævandi lyfja',
    )
  })

  test('should return a description with illegal drugs', () => {
    const offenses = [offense.DRUNK_DRIVING, offense.ILLEGAL_DRUGS_DRIVING]

    const result = getIncidentDescriptionReason(offenses, {}, formatMessage)

    expect(result).toBe(
      'undir áhrifum áfengis og óhæfur til að stjórna henni örugglega vegna áhrifa ávana- og fíkniefna',
    )
  })

  test('should return a description with illegal drugs as third offence', () => {
    const offenses = [
      offense.DRIVING_WITHOUT_LICENCE,
      offense.DRUNK_DRIVING,
      offense.ILLEGAL_DRUGS_DRIVING,
    ]

    const result = getIncidentDescriptionReason(offenses, {}, formatMessage)

    expect(result).toBe(
      'sviptur ökurétti, undir áhrifum áfengis og óhæfur til að stjórna henni örugglega vegna áhrifa ávana- og fíkniefna',
    )
  })

  test('should return a description with illegal and prescription drugs', () => {
    const offenses = [
      offense.DRUNK_DRIVING,
      offense.ILLEGAL_DRUGS_DRIVING,
      offense.PRESCRIPTION_DRUGS_DRIVING,
    ]

    const result = getIncidentDescriptionReason(offenses, {}, formatMessage)

    expect(result).toBe(
      'undir áhrifum áfengis og óhæfur til að stjórna henni örugglega vegna áhrifa ávana- og fíkniefna og slævandi lyfja',
    )
  })

  test('should return a description with only illegal and prescription drugs', () => {
    const offenses = [
      offense.ILLEGAL_DRUGS_DRIVING,
      offense.PRESCRIPTION_DRUGS_DRIVING,
    ]

    const result = getIncidentDescriptionReason(offenses, {}, formatMessage)

    expect(result).toBe(
      'óhæfur til að stjórna henni örugglega vegna áhrifa ávana- og fíkniefna og slævandi lyfja',
    )
  })
})
