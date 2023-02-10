import { createIntl } from 'react-intl'

import { CaseDecision, CaseState } from '@island.is/judicial-system/types'
import { CaseType } from '@island.is/judicial-system-web/src/graphql/schema'

import { mapCaseStateToTagVariant, displayCaseType } from './utils'
import { cases as m } from './Cases.strings'

const formatMessage = createIntl({ locale: 'is-IS', onError: jest.fn })
  .formatMessage

describe('displayCaseType', () => {
  const fn = (caseType: CaseType, decision?: CaseDecision) =>
    displayCaseType(formatMessage, caseType, decision)

  test('should display as travel ban when case descition is accepting alternative travel ban', () => {
    expect(
      fn(CaseType.Custody, CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN),
    ).toBe('Farbann')
  })

  it.each([CaseType.Indictment])(
    'should display indictment case: %s',
    (caseType) => {
      expect(fn(caseType)).toEqual('Ákæra')
    },
  )
})

describe('mapCaseStateToTagVariant', () => {
  const fn = (
    state: CaseState,
    isCourtRole: boolean,
    caseType: CaseType,
    isValidToDateInThePast?: boolean,
    courtDate?: string,
  ) =>
    mapCaseStateToTagVariant(
      formatMessage,
      state,
      isCourtRole,
      caseType,
      isValidToDateInThePast,
      courtDate,
    )

  test('should return draft state', () => {
    expect(fn(CaseState.NEW, false, CaseType.Custody)).toEqual({
      color: 'red',
      text: m.tags.draft.defaultMessage,
    })
    expect(fn(CaseState.DRAFT, false, CaseType.Custody)).toEqual({
      color: 'red',
      text: m.tags.draft.defaultMessage,
    })
  })

  test('should return new state', () => {
    expect(fn(CaseState.SUBMITTED, true, CaseType.Custody)).toEqual({
      color: 'purple',
      text: m.tags.new.defaultMessage,
    })
  })

  test('should return sent state', () => {
    expect(fn(CaseState.SUBMITTED, false, CaseType.Custody)).toEqual({
      color: 'purple',
      text: m.tags.sent.defaultMessage,
    })
  })

  test('should return scheduled state', () => {
    expect(
      fn(CaseState.RECEIVED, false, CaseType.Custody, false, '2020-01-01'),
    ).toEqual({
      color: 'mint',
      text: m.tags.scheduled.defaultMessage,
    })
  })

  test('should return received state', () => {
    expect(fn(CaseState.RECEIVED, false, CaseType.Custody)).toEqual({
      color: 'blueberry',
      text: m.tags.received.defaultMessage,
    })
  })

  test('should return active state', () => {
    expect(fn(CaseState.ACCEPTED, false, CaseType.Custody, false)).toEqual({
      color: 'blue',
      text: m.tags.active.defaultMessage,
    })

    expect(fn(CaseState.ACCEPTED, false, CaseType.Indictment)).toEqual({
      color: 'darkerBlue',
      text: m.tags.inactive.defaultMessage,
    })
  })

  test('should return inactive state', () => {
    expect(fn(CaseState.ACCEPTED, false, CaseType.Custody, true)).toEqual({
      color: 'darkerBlue',
      text: m.tags.inactive.defaultMessage,
    })
  })

  test('should return rejected state', () => {
    expect(fn(CaseState.REJECTED, false, CaseType.Custody)).toEqual({
      color: 'rose',
      text: m.tags.rejected.defaultMessage,
    })
  })

  test('should return dismissed state', () => {
    expect(fn(CaseState.DISMISSED, false, CaseType.Custody)).toEqual({
      color: 'dark',
      text: m.tags.dismissed.defaultMessage,
    })
  })

  test('should return unknown state', () => {
    expect(fn('testing' as CaseState, false, CaseType.Custody)).toEqual({
      color: 'white',
      text: m.tags.unknown.defaultMessage,
    })
  })
})
