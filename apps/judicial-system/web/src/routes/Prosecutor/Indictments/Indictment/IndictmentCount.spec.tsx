import { createIntl } from 'react-intl'

import { IndictmentCountOffense as offense } from '@island.is/judicial-system-web/src/graphql/schema'
import { Substance, SubstanceMap } from '@island.is/judicial-system/types'

import {
  getRelevantSubstances,
  getIncidentDescriptionReason,
} from './IndictmentCount'

const formatMessage = createIntl({ locale: 'is', onError: jest.fn })
  .formatMessage

describe('getRelevantSubstances', () => {
  test('should return relevant substances in the correct order for the indictment description', () => {
    const offenses = [
      offense.DrunkDriving,
      offense.IllegalDrugsDriving,
      offense.PrescriptionDrugsDriving,
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

describe('getIndictmentDescriptionReason', () => {
  test('should return a description for one offense', () => {
    const offenses = [offense.DrivingWithoutLicence]

    const result = getIncidentDescriptionReason(offenses, {}, formatMessage)

    expect(result).toBe('sviptur ökurétti')
  })

  test('should return a description for two offense', () => {
    const offenses = [offense.DrivingWithoutLicence, offense.DrunkDriving]

    const result = getIncidentDescriptionReason(offenses, {}, formatMessage)

    expect(result).toBe('sviptur ökurétti og undir áhrifum áfengis')
  })

  test('should return a description with prescription drugs', () => {
    const offenses = [offense.DrunkDriving, offense.PrescriptionDrugsDriving]

    const result = getIncidentDescriptionReason(offenses, {}, formatMessage)

    expect(result).toBe(
      'undir áhrifum áfengis og óhæfur til að stjórna henni örugglega vegna áhrifa slævandi lyfja',
    )
  })

  test('should return a description with illegal and prescription drugs', () => {
    const offenses = [
      offense.DrunkDriving,
      offense.IllegalDrugsDriving,
      offense.PrescriptionDrugsDriving,
    ]

    const result = getIncidentDescriptionReason(offenses, {}, formatMessage)

    expect(result).toBe(
      'undir áhrifum áfengis og óhæfur til að stjórna henni örugglega vegna áhrifa ávana- og fíkniefna og slævandi lyfja',
    )
  })
})
