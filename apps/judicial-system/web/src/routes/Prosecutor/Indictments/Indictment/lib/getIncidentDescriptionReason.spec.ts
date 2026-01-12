import {
  Gender,
  IndictmentCountOffense,
  Offense,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { createFormatMessage } from '@island.is/judicial-system-web/src/utils/testHelpers.logic'

import { getIncidentDescriptionReason } from './getIncidentDescriptionReason'

describe('getIncidentDescriptionReason', () => {
  const formatMessage = createFormatMessage()

  test('should return a description for one offense', () => {
    const offenses = [
      {
        offense: IndictmentCountOffense.DRIVING_WITHOUT_LICENCE,
        substances: {},
      },
    ] as Offense[]

    const result = getIncidentDescriptionReason(
      offenses,
      Gender.MALE,
      formatMessage,
    )

    expect(result).toBe('sviptur ökurétti')
  })

  test('should return a gender based description for one offense', () => {
    const offenses = [
      {
        offense: IndictmentCountOffense.DRIVING_WITHOUT_LICENCE,
        substances: {},
      },
    ] as Offense[]

    const result = getIncidentDescriptionReason(
      offenses,
      Gender.FEMALE,
      formatMessage,
    )

    expect(result).toBe('svipt ökurétti')
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

    const result = getIncidentDescriptionReason(
      offenses,
      Gender.MALE,
      formatMessage,
    )

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

    const result = getIncidentDescriptionReason(
      offenses,
      Gender.MALE,
      formatMessage,
    )

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

    const result = getIncidentDescriptionReason(
      offenses,
      Gender.MALE,
      formatMessage,
    )

    expect(result).toBe(
      'undir áhrifum áfengis og óhæfur til að stjórna henni örugglega vegna áhrifa slævandi lyfja',
    )
  })

  test('should return a gender based description with prescription drugs', () => {
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

    const result = getIncidentDescriptionReason(
      offenses,
      Gender.OTHER,
      formatMessage,
    )

    expect(result).toBe(
      'undir áhrifum áfengis og óhæft til að stjórna henni örugglega vegna áhrifa slævandi lyfja',
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

    const result = getIncidentDescriptionReason(
      offenses,
      Gender.MALE,
      formatMessage,
    )

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

    const result = getIncidentDescriptionReason(
      offenses,
      Gender.MALE,
      formatMessage,
    )

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

    const result = getIncidentDescriptionReason(
      offenses,
      Gender.MALE,
      formatMessage,
    )

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

    const result = getIncidentDescriptionReason(
      offenses,
      Gender.MALE,
      formatMessage,
    )

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

    const result = getIncidentDescriptionReason(
      offenses,
      Gender.MALE,
      formatMessage,
    )

    expect(result).toBe(
      'óhæfur til að stjórna henni örugglega vegna áhrifa ávana- og fíkniefna og slævandi lyfja',
    )
  })

  test('should return a description for no valid license', () => {
    const offenses = [
      {
        offense: IndictmentCountOffense.DRIVING_WITHOUT_VALID_LICENSE,
        substances: {},
      },
    ] as Offense[]

    const result = getIncidentDescriptionReason(
      offenses,
      Gender.MALE,
      formatMessage,
    )

    expect(result).toBe('án gildra ökuréttinda')
  })

  test('should return a description for never having license', () => {
    const offenses = [
      {
        offense: IndictmentCountOffense.DRIVING_WITHOUT_EVER_HAVING_LICENSE,
        substances: {},
      },
    ] as Offense[]

    const result = getIncidentDescriptionReason(
      offenses,
      Gender.MALE,
      formatMessage,
    )

    expect(result).toBe('án þess að hafa öðlast ökurétt')
  })
})
