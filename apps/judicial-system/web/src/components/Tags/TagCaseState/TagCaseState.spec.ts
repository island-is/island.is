import { createIntl } from 'react-intl'

import { tables } from '@island.is/judicial-system-web/messages'
import {
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  IndictmentDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { mapCaseStateToTagVariant } from './TagCaseState'
import { strings } from './TagCaseState.strings'

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
    indictmendRulingDecision?: CaseIndictmentRulingDecision | null,
    indictmentDecision?: IndictmentDecision | null,
  ) =>
    mapCaseStateToTagVariant(
      formatMessage,
      state,
      caseType,
      isValidToDateInThePast,
      courtDate,
      isCourtRole,
      indictmendRulingDecision,
      indictmentDecision,
    )

  test('should return draft state', () => {
    expect(fn(CaseState.NEW, false, CaseType.CUSTODY)).toEqual({
      color: 'red',
      text: strings.draft.defaultMessage,
    })
    expect(fn(CaseState.DRAFT, false, CaseType.CUSTODY)).toEqual({
      color: 'red',
      text: strings.draft.defaultMessage,
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
      text: strings.sent.defaultMessage,
    })
  })

  test('should return scheduled state', () => {
    expect(
      fn(CaseState.RECEIVED, false, CaseType.CUSTODY, false, '2020-01-01'),
    ).toEqual({
      color: 'mint',
      text: strings.scheduled.defaultMessage,
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
      text: strings.active.defaultMessage,
    })

    expect(
      fn(
        CaseState.COMPLETED,
        false,
        CaseType.INDICTMENT,
        false,
        undefined,
        CaseIndictmentRulingDecision.RULING,
      ),
    ).toEqual({
      color: 'darkerBlue',
      text: 'Dómur',
    })

    expect(
      fn(
        CaseState.COMPLETED,
        false,
        CaseType.INDICTMENT,
        false,
        undefined,
        CaseIndictmentRulingDecision.FINE,
      ),
    ).toEqual({
      color: 'darkerBlue',
      text: 'Viðurlagaákvörðun',
    })

    expect(
      fn(
        CaseState.COMPLETED,
        false,
        CaseType.INDICTMENT,
        false,
        undefined,
        CaseIndictmentRulingDecision.DISMISSAL,
      ),
    ).toEqual({
      color: 'darkerBlue',
      text: 'Frávísun',
    })

    expect(
      fn(
        CaseState.COMPLETED,
        false,
        CaseType.INDICTMENT,
        false,
        undefined,
        CaseIndictmentRulingDecision.CANCELLATION,
      ),
    ).toEqual({
      color: 'darkerBlue',
      text: 'Niðurfelling',
    })

    expect(
      fn(
        CaseState.COMPLETED,
        false,
        CaseType.INDICTMENT,
        false,
        undefined,
        CaseIndictmentRulingDecision.WITHDRAWAL,
      ),
    ).toEqual({
      color: 'darkerBlue',
      text: 'Afturkallað',
    })

    expect(fn(CaseState.COMPLETED, false, CaseType.INDICTMENT)).toEqual({
      color: 'darkerBlue',
      text: 'Lokið',
    })
  })

  test('should return inactive state', () => {
    expect(fn(CaseState.ACCEPTED, false, CaseType.CUSTODY, true)).toEqual({
      color: 'darkerBlue',
      text: strings.inactive.defaultMessage,
    })
  })

  test('should return rejected state', () => {
    expect(fn(CaseState.REJECTED, false, CaseType.CUSTODY)).toEqual({
      color: 'rose',
      text: strings.rejected.defaultMessage,
    })
  })

  test('should return dismissed state', () => {
    expect(fn(CaseState.DISMISSED, false, CaseType.CUSTODY)).toEqual({
      color: 'dark',
      text: strings.dismissed.defaultMessage,
    })
  })

  test('should return unknown state', () => {
    expect(fn('testing' as CaseState, false, CaseType.CUSTODY)).toEqual({
      color: 'white',
      text: strings.unknown.defaultMessage,
    })
  })

  test('should return reassignment state', () => {
    expect(
      fn(
        CaseState.RECEIVED,
        false,
        CaseType.INDICTMENT,
        false,
        undefined,
        null,
        IndictmentDecision.REDISTRIBUTING,
      ),
    ).toEqual({
      color: 'blue',
      text: strings.reassignment.defaultMessage,
    })
  })

  test('should return postponed until verdict state', () => {
    expect(
      fn(
        CaseState.RECEIVED,
        false,
        CaseType.INDICTMENT,
        false,
        '2020-01-01',
        null,
        IndictmentDecision.POSTPONING_UNTIL_VERDICT,
      ),
    ).toEqual({
      color: 'mint',
      text: strings.postponedUntilVerdict.defaultMessage,
    })
  })

  test('should return postponed until verdict state', () => {
    expect(
      fn(
        CaseState.RECEIVED,
        false,
        CaseType.INDICTMENT,
        false,
        '2020-01-01',
        null,
        IndictmentDecision.POSTPONING,
      ),
    ).toEqual({
      color: 'mint',
      text: strings.scheduled.defaultMessage,
    })
  })

  test('should return postponed until verdict state', () => {
    expect(
      fn(
        CaseState.RECEIVED,
        false,
        CaseType.INDICTMENT,
        false,
        '2020-01-01',
        null,
        IndictmentDecision.SCHEDULING,
      ),
    ).toEqual({
      color: 'mint',
      text: strings.scheduled.defaultMessage,
    })
  })

  test('should return postponed until verdict state', () => {
    expect(
      fn(
        CaseState.RECEIVED,
        false,
        CaseType.INDICTMENT,
        false,
        '2020-01-01',
        null,
        IndictmentDecision.COMPLETING,
      ),
    ).toEqual({
      color: 'mint',
      text: strings.scheduled.defaultMessage,
    })
  })

  test('should return revoked state', () => {
    expect(
      fn(CaseState.WAITING_FOR_CANCELLATION, false, CaseType.INDICTMENT),
    ).toEqual({ color: 'rose', text: strings.recalled.defaultMessage })
  })
})
