import { createIntl } from 'react-intl'

import { requests } from '@island.is/judicial-system-web/messages'
import {
  CaseDecision,
  CaseState,
  CaseType,
} from '@island.is/judicial-system/types'

import { mapCaseStateToTagVariant, displayCaseType } from './utils'

const formatMessage = createIntl({ locale: 'is-IS', onError: jest.fn })
  .formatMessage

describe('displayCaseType', () => {
  const fn = (caseType: CaseType, decision?: CaseDecision) =>
    displayCaseType(formatMessage, caseType, decision)

  test('should display as travel ban when case descition is accepting alternative travel ban', () => {
    expect(
      fn(CaseType.CUSTODY, CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN),
    ).toBe('Farbann')
  })

  test.each`
    caseType
    ${CaseType.CHILD_PROTECTION_LAWS}
    ${CaseType.PROPERTY_DAMAGE}
    ${CaseType.NARCOTICS_OFFENSE}
    ${CaseType.EMBEZZLEMENT}
    ${CaseType.FRAUD}
    ${CaseType.DOMESTIC_VIOLENCE}
    ${CaseType.ASSAULT_LEADING_TO_DEATH}
    ${CaseType.MURDER}
    ${CaseType.MAJOR_ASSULT}
    ${CaseType.MINOR_ASSULT}
    ${CaseType.RAPE}
    ${CaseType.UTILITY_THEFT}
    ${CaseType.AGGRAVETED_ASSULT}
    ${CaseType.TAX_VIOLATION}
    ${CaseType.ATTEMPTED_MURDER}
    ${CaseType.TRAFFIC_VIOLATION}
    ${CaseType.THEFT}
    ${CaseType.OTHER_CRIMINAL_OFFENSES}
    ${CaseType.SEXUAL_OFFENSES_OTHER_THAN_RAPE}
    ${CaseType.OTHER_OFFENSES}
  `('should display indictment case: $caseType', ({ caseType }) => {
    expect(fn(caseType)).toEqual('Ákæra')
  })
})

describe('mapCaseStateToTagVariant', () => {
  const fn = (
    state: CaseState,
    isCourtRole: boolean,
    isInvestigationCase?: boolean,
    isValidToDateInThePast?: boolean,
    courtDate?: string,
  ) =>
    mapCaseStateToTagVariant(
      formatMessage,
      state,
      isCourtRole,
      isInvestigationCase,
      isValidToDateInThePast,
      courtDate,
    )

  test('should return draft state', () => {
    expect(fn(CaseState.NEW, false)).toEqual({
      color: 'red',
      text: requests.tags.draft.defaultMessage,
    })
    expect(fn(CaseState.DRAFT, false)).toEqual({
      color: 'red',
      text: requests.tags.draft.defaultMessage,
    })
  })

  test('should return new state', () => {
    expect(fn(CaseState.SUBMITTED, true)).toEqual({
      color: 'purple',
      text: requests.tags.new.defaultMessage,
    })
  })

  test('should return sent state', () => {
    expect(fn(CaseState.SUBMITTED, false)).toEqual({
      color: 'purple',
      text: requests.tags.sent.defaultMessage,
    })
  })

  test('should return scheduled state', () => {
    expect(fn(CaseState.RECEIVED, false, false, false, '2020-01-01')).toEqual({
      color: 'mint',
      text: requests.tags.scheduled.defaultMessage,
    })
  })

  test('should return received state', () => {
    expect(fn(CaseState.RECEIVED, false)).toEqual({
      color: 'blueberry',
      text: requests.tags.received.defaultMessage,
    })
  })

  test('should return active state', () => {
    expect(fn(CaseState.ACCEPTED, false, false, false)).toEqual({
      color: 'blue',
      text: requests.tags.active.defaultMessage,
    })
  })

  test('should return inactive state', () => {
    expect(fn(CaseState.ACCEPTED, false, false, true)).toEqual({
      color: 'darkerBlue',
      text: requests.tags.inactive.defaultMessage,
    })
  })

  test('should return rejected state', () => {
    expect(fn(CaseState.REJECTED, false)).toEqual({
      color: 'rose',
      text: requests.tags.rejected.defaultMessage,
    })
  })

  test('should return dismissed state', () => {
    expect(fn(CaseState.DISMISSED, false)).toEqual({
      color: 'dark',
      text: requests.tags.dismissed.defaultMessage,
    })
  })

  test('should return unknown state', () => {
    expect(fn('testing' as CaseState, false)).toEqual({
      color: 'white',
      text: requests.tags.unknown.defaultMessage,
    })
  })
})
