import { IndictmentCountOffense } from '@island.is/judicial-system/types'
import { formatMessage } from '@island.is/judicial-system-web/src/utils/testHelpers'

import { getDeprecatedIncidentDescriptionReason } from './getDeprecatedIncidentDescriptionReason'

describe('getDeprecatedIncidentDescriptionReason', () => {
  test('should return a description for one offense', () => {
    const offenses = [IndictmentCountOffense.DRIVING_WITHOUT_LICENCE]

    const result = getDeprecatedIncidentDescriptionReason(
      offenses,
      {},
      formatMessage,
    )

    expect(result).toBe('sviptur ökurétti')
  })

  test('should return a description for two offense', () => {
    const offenses = [
      IndictmentCountOffense.DRIVING_WITHOUT_LICENCE,
      IndictmentCountOffense.DRUNK_DRIVING,
    ]

    const result = getDeprecatedIncidentDescriptionReason(
      offenses,
      {},
      formatMessage,
    )

    expect(result).toBe('sviptur ökurétti og undir áhrifum áfengis')
  })

  test('should return a description with prescription drugs', () => {
    const offenses = [
      IndictmentCountOffense.DRUNK_DRIVING,
      IndictmentCountOffense.PRESCRIPTION_DRUGS_DRIVING,
    ]

    const result = getDeprecatedIncidentDescriptionReason(
      offenses,
      {},
      formatMessage,
    )

    expect(result).toBe(
      'undir áhrifum áfengis og óhæfur til að stjórna henni örugglega vegna áhrifa slævandi lyfja',
    )
  })

  test('should return a description with illegal drugs', () => {
    const offenses = [
      IndictmentCountOffense.DRUNK_DRIVING,
      IndictmentCountOffense.ILLEGAL_DRUGS_DRIVING,
    ]

    const result = getDeprecatedIncidentDescriptionReason(
      offenses,
      {},
      formatMessage,
    )

    expect(result).toBe(
      'undir áhrifum áfengis og óhæfur til að stjórna henni örugglega vegna áhrifa ávana- og fíkniefna',
    )
  })

  test('should return a description with illegal drugs as third offense', () => {
    const offenses = [
      IndictmentCountOffense.DRIVING_WITHOUT_LICENCE,
      IndictmentCountOffense.DRUNK_DRIVING,
      IndictmentCountOffense.ILLEGAL_DRUGS_DRIVING,
    ]

    const result = getDeprecatedIncidentDescriptionReason(
      offenses,
      {},
      formatMessage,
    )

    expect(result).toBe(
      'sviptur ökurétti, undir áhrifum áfengis og óhæfur til að stjórna henni örugglega vegna áhrifa ávana- og fíkniefna',
    )
  })

  test('should return a description with illegal and prescription drugs', () => {
    const offenses = [
      IndictmentCountOffense.DRUNK_DRIVING,
      IndictmentCountOffense.ILLEGAL_DRUGS_DRIVING,
      IndictmentCountOffense.PRESCRIPTION_DRUGS_DRIVING,
    ]

    const result = getDeprecatedIncidentDescriptionReason(
      offenses,
      {},
      formatMessage,
    )

    expect(result).toBe(
      'undir áhrifum áfengis og óhæfur til að stjórna henni örugglega vegna áhrifa ávana- og fíkniefna og slævandi lyfja',
    )
  })

  test('should return a description with only illegal and prescription drugs', () => {
    const offenses = [
      IndictmentCountOffense.ILLEGAL_DRUGS_DRIVING,
      IndictmentCountOffense.PRESCRIPTION_DRUGS_DRIVING,
    ]

    const result = getDeprecatedIncidentDescriptionReason(
      offenses,
      {},
      formatMessage,
    )

    expect(result).toBe(
      'óhæfur til að stjórna henni örugglega vegna áhrifa ávana- og fíkniefna og slævandi lyfja',
    )
  })
})
