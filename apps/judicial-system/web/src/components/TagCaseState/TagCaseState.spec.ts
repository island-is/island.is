import { createIntl } from 'react-intl'

import { CaseState, CaseType } from '@island.is/judicial-system/types'
import { tables } from '@island.is/judicial-system-web/messages'

import { mapCaseStateToTagVariant } from './TagCaseState'
import { tagCaseState as m } from './TagCaseState.strings'

const formatMessage = createIntl({
  locale: 'is-IS',
  onError: jest.fn,
}).formatMessage

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
      caseType,
      isValidToDateInThePast,
      courtDate,
      isCourtRole,
    )

  test('should return draft state', () => {
    expect(fn(CaseState.NEW, false, CaseType.CUSTODY)).toEqual({
      color: 'red',
      text: m.draft.defaultMessage,
    })
    expect(fn(CaseState.DRAFT, false, CaseType.CUSTODY)).toEqual({
      color: 'red',
      text: m.draft.defaultMessage,
    })
  })

  test('should return new state', () => {
    expect(fn(CaseState.SUBMITTED, true, CaseType.CUSTODY)).toEqual({
      color: 'purple',
      text: tables.newTag.defaultMessage,
    })
  })

  test('should return sent state', () => {
    expect(fn(CaseState.SUBMITTED, false, CaseType.CUSTODY)).toEqual({
      color: 'purple',
      text: m.sent.defaultMessage,
    })
  })

  test('should return scheduled state', () => {
    expect(
      fn(CaseState.RECEIVED, false, CaseType.CUSTODY, false, '2020-01-01'),
    ).toEqual({
      color: 'mint',
      text: m.scheduled.defaultMessage,
    })
  })

  test('should return received state', () => {
    expect(fn(CaseState.RECEIVED, false, CaseType.CUSTODY)).toEqual({
      color: 'blueberry',
      text: tables.receivedTag.defaultMessage,
    })
  })

  test('should return active state', () => {
    expect(fn(CaseState.ACCEPTED, false, CaseType.CUSTODY, false)).toEqual({
      color: 'blue',
      text: m.active.defaultMessage,
    })

    expect(fn(CaseState.ACCEPTED, false, CaseType.INDICTMENT)).toEqual({
      color: 'darkerBlue',
      text: m.inactive.defaultMessage,
    })
  })

  test('should return inactive state', () => {
    expect(fn(CaseState.ACCEPTED, false, CaseType.CUSTODY, true)).toEqual({
      color: 'darkerBlue',
      text: m.inactive.defaultMessage,
    })
  })

  test('should return rejected state', () => {
    expect(fn(CaseState.REJECTED, false, CaseType.CUSTODY)).toEqual({
      color: 'rose',
      text: m.rejected.defaultMessage,
    })
  })

  test('should return dismissed state', () => {
    expect(fn(CaseState.DISMISSED, false, CaseType.CUSTODY)).toEqual({
      color: 'dark',
      text: m.dismissed.defaultMessage,
    })
  })

  test('should return unknown state', () => {
    expect(fn('testing' as CaseState, false, CaseType.CUSTODY)).toEqual({
      color: 'white',
      text: m.unknown.defaultMessage,
    })
  })
})
