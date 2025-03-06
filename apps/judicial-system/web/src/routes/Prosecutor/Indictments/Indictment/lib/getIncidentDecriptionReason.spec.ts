import { IndictmentCountOffense } from '@island.is/judicial-system/types'
import { Offense } from '@island.is/judicial-system-web/src/graphql/schema'
import { formatMessage } from '@island.is/judicial-system-web/src/utils/testHelpers'

import { getIncidentDescriptionReason } from './getIncidentDescriptionReason'

describe('getIncidentDescriptionReason', () => {
  test('should return a description for one offense', () => {
    const offenses = [
      {
        offense: IndictmentCountOffense.DRIVING_WITHOUT_LICENCE,
        substances: {},
      },
    ] as Offense[]

    const result = getIncidentDescriptionReason(offenses, formatMessage)

    expect(result).toBe('sviptur ökurétti')
  })

  test('should return a description for one offense for two offenses', () => {
    const offenses = [
      {
        offense: IndictmentCountOffense.DRIVING_WITHOUT_LICENCE,
        substances: {},
      },
      {
        offense: IndictmentCountOffense.OTHER,
        substances: {},
      },
    ] as Offense[]

    const result = getIncidentDescriptionReason(offenses, formatMessage)

    expect(result).toBe('sviptur ökurétti')
  })

  test('should return a description for two offense', () => {
    const offenses = [
      {
        offense: IndictmentCountOffense.DRIVING_WITHOUT_LICENCE,
        substances: {},
      },
      { offense: IndictmentCountOffense.DRUNK_DRIVING, substances: {} },
    ] as Offense[]

    const result = getIncidentDescriptionReason(offenses, formatMessage)

    expect(result).toBe('sviptur ökurétti og undir áhrifum áfengis')
  })

  test('should return a description with prescription drugs', () => {
    const offenses = [
      {
        offense: IndictmentCountOffense.DRUNK_DRIVING,
        substances: {},
      },
      {
        offense: IndictmentCountOffense.PRESCRIPTION_DRUGS_DRIVING,
        substances: {},
      },
    ] as Offense[]

    const result = getIncidentDescriptionReason(offenses, formatMessage)

    expect(result).toBe(
      'undir áhrifum áfengis og óhæfur til að stjórna henni örugglega vegna áhrifa slævandi lyfja',
    )
  })

  test('should return a description with illegal drugs', () => {
    const offenses = [
      {
        offense: IndictmentCountOffense.DRUNK_DRIVING,
        substances: {},
      },
      { offense: IndictmentCountOffense.ILLEGAL_DRUGS_DRIVING, substances: {} },
    ] as Offense[]

    const result = getIncidentDescriptionReason(offenses, formatMessage)

    expect(result).toBe(
      'undir áhrifum áfengis og óhæfur til að stjórna henni örugglega vegna áhrifa ávana- og fíkniefna',
    )
  })

  test('should return a description with illegal drugs as third offense', () => {
    const offenses = [
      {
        offense: IndictmentCountOffense.DRIVING_WITHOUT_LICENCE,
        substances: {},
      },
      { offense: IndictmentCountOffense.DRUNK_DRIVING, substances: {} },
      { offense: IndictmentCountOffense.ILLEGAL_DRUGS_DRIVING, substances: {} },
    ] as Offense[]

    const result = getIncidentDescriptionReason(offenses, formatMessage)

    expect(result).toBe(
      'sviptur ökurétti, undir áhrifum áfengis og óhæfur til að stjórna henni örugglega vegna áhrifa ávana- og fíkniefna',
    )
  })

  test('should return a description with illegal and prescription drugs', () => {
    const offenses = [
      {
        offense: IndictmentCountOffense.DRUNK_DRIVING,
        substances: {},
      },
      { offense: IndictmentCountOffense.ILLEGAL_DRUGS_DRIVING, substances: {} },
      {
        offense: IndictmentCountOffense.PRESCRIPTION_DRUGS_DRIVING,
        substances: {},
      },
    ] as Offense[]

    const result = getIncidentDescriptionReason(offenses, formatMessage)

    expect(result).toBe(
      'undir áhrifum áfengis og óhæfur til að stjórna henni örugglega vegna áhrifa ávana- og fíkniefna og slævandi lyfja',
    )
  })

  test('should return a description with only illegal and prescription drugs', () => {
    const offenses = [
      {
        offense: IndictmentCountOffense.ILLEGAL_DRUGS_DRIVING,
        substances: {},
      },
      {
        offense: IndictmentCountOffense.PRESCRIPTION_DRUGS_DRIVING,
        substances: {},
      },
    ] as Offense[]

    const result = getIncidentDescriptionReason(offenses, formatMessage)

    expect(result).toBe(
      'óhæfur til að stjórna henni örugglega vegna áhrifa ávana- og fíkniefna og slævandi lyfja',
    )
  })

  test('should return a description with only prescription and illegal drugs, in that order', () => {
    const offenses = [
      {
        offense: IndictmentCountOffense.PRESCRIPTION_DRUGS_DRIVING,
        substances: {},
      },
      {
        offense: IndictmentCountOffense.ILLEGAL_DRUGS_DRIVING,
        substances: {},
      },
    ] as Offense[]

    const result = getIncidentDescriptionReason(offenses, formatMessage)

    expect(result).toBe(
      'óhæfur til að stjórna henni örugglega vegna áhrifa ávana- og fíkniefna og slævandi lyfja',
    )
  })
})
