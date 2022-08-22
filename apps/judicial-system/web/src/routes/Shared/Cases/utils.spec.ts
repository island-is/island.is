import { createIntl } from 'react-intl'

import { requests } from '@island.is/judicial-system-web/messages'
import { CaseState } from '@island.is/judicial-system/types'

import { mapCaseStateToTagVariant } from './utils'
import { request } from 'http'

describe('mapCaseStateToTagVariant', () => {
  const formatMessage = createIntl({ locale: 'is-IS', onError: jest.fn })
    .formatMessage
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
