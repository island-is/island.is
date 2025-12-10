import { tables } from '@island.is/judicial-system-web/messages'
import {
  CaseIndictmentRulingDecision,
  CaseListEntry,
  CaseState,
  CaseType,
  IndictmentDecision,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockJudge } from '@island.is/judicial-system-web/src/utils/mocks'
import { createFormatMessage } from '@island.is/judicial-system-web/src/utils/testHelpers.logic'

import { mapCaseStateToTagVariant } from './TagCaseState.logic'
import { strings } from './TagCaseState.strings'

describe('mapCaseStateToTagVariant', () => {
  const theCase = { id: 'test' }

  const formatMessage = createFormatMessage()
  const fn = (theCase: CaseListEntry, user?: User) =>
    mapCaseStateToTagVariant(formatMessage, theCase, user)

  test('should return draft state', () => {
    expect(
      fn({ ...theCase, state: CaseState.NEW, type: CaseType.CUSTODY }),
    ).toEqual({
      color: 'red',
      text: strings.draft.defaultMessage,
    })
    expect(
      fn({ ...theCase, state: CaseState.DRAFT, type: CaseType.CUSTODY }),
    ).toEqual({
      color: 'red',
      text: strings.draft.defaultMessage,
    })
  })

  test('should return new state', () => {
    expect(
      fn(
        { ...theCase, state: CaseState.SUBMITTED, type: CaseType.CUSTODY },
        mockJudge,
      ),
    ).toEqual({
      color: 'purple',
      text: tables.newTag.defaultMessage,
    })
  })

  test('should return sent state', () => {
    expect(
      fn({ ...theCase, state: CaseState.SUBMITTED, type: CaseType.CUSTODY }),
    ).toEqual({
      color: 'purple',
      text: strings.sent.defaultMessage,
    })
  })

  test('should return scheduled state', () => {
    expect(
      fn({
        ...theCase,
        state: CaseState.RECEIVED,
        type: CaseType.CUSTODY,
        isValidToDateInThePast: false,
        courtDate: '2020-01-01',
      }),
    ).toEqual({
      color: 'mint',
      text: strings.scheduled.defaultMessage,
    })
  })

  test('should return received state', () => {
    expect(
      fn({ ...theCase, state: CaseState.RECEIVED, type: CaseType.CUSTODY }),
    ).toEqual({
      color: 'blueberry',
      text: tables.receivedTag.defaultMessage,
    })
  })

  test('should return active state', () => {
    expect(
      fn({
        ...theCase,
        state: CaseState.ACCEPTED,
        type: CaseType.CUSTODY,
        isValidToDateInThePast: false,
      }),
    ).toEqual({
      color: 'blue',
      text: strings.active.defaultMessage,
    })

    expect(
      fn({
        ...theCase,
        state: CaseState.COMPLETED,
        type: CaseType.INDICTMENT,
        isValidToDateInThePast: false,
        courtDate: undefined,
        indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      }),
    ).toEqual({
      color: 'darkerBlue',
      text: 'Dómur',
    })

    expect(
      fn({
        ...theCase,
        state: CaseState.COMPLETED,
        type: CaseType.INDICTMENT,
        isValidToDateInThePast: false,
        courtDate: undefined,
        indictmentRulingDecision: CaseIndictmentRulingDecision.FINE,
      }),
    ).toEqual({
      color: 'darkerBlue',
      text: 'Viðurlagaákvörðun',
    })

    expect(
      fn({
        ...theCase,
        state: CaseState.COMPLETED,

        type: CaseType.INDICTMENT,
        isValidToDateInThePast: false,
        courtDate: undefined,
        indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
      }),
    ).toEqual({
      color: 'darkerBlue',
      text: 'Frávísun',
    })

    expect(
      fn({
        ...theCase,
        state: CaseState.COMPLETED,

        type: CaseType.INDICTMENT,
        isValidToDateInThePast: false,
        courtDate: undefined,
        indictmentRulingDecision: CaseIndictmentRulingDecision.CANCELLATION,
      }),
    ).toEqual({
      color: 'darkerBlue',
      text: 'Niðurfelling',
    })

    expect(
      fn({
        ...theCase,
        state: CaseState.COMPLETED,
        type: CaseType.INDICTMENT,
        isValidToDateInThePast: false,
        courtDate: undefined,
        indictmentRulingDecision: CaseIndictmentRulingDecision.WITHDRAWAL,
      }),
    ).toEqual({
      color: 'darkerBlue',
      text: 'Afturkallað',
    })

    expect(
      fn({ ...theCase, state: CaseState.COMPLETED, type: CaseType.INDICTMENT }),
    ).toEqual({
      color: 'darkerBlue',
      text: 'Lokið',
    })
  })

  test('should return inactive state', () => {
    expect(
      fn({
        ...theCase,
        state: CaseState.ACCEPTED,
        type: CaseType.CUSTODY,
        isValidToDateInThePast: true,
      }),
    ).toEqual({
      color: 'darkerBlue',
      text: strings.inactive.defaultMessage,
    })
  })

  test('should return rejected state', () => {
    expect(
      fn({ ...theCase, state: CaseState.REJECTED, type: CaseType.CUSTODY }),
    ).toEqual({
      color: 'rose',
      text: strings.rejected.defaultMessage,
    })
  })

  test('should return dismissed state', () => {
    expect(
      fn({ ...theCase, state: CaseState.DISMISSED, type: CaseType.CUSTODY }),
    ).toEqual({
      color: 'dark',
      text: strings.dismissed.defaultMessage,
    })
  })

  test('should return unknown state', () => {
    expect(
      fn({ ...theCase, state: 'testing' as CaseState, type: CaseType.CUSTODY }),
    ).toEqual({
      color: 'white',
      text: strings.unknown.defaultMessage,
    })
  })

  test('should return reassignment state', () => {
    expect(
      fn({
        ...theCase,
        state: CaseState.RECEIVED,
        type: CaseType.INDICTMENT,
        isValidToDateInThePast: false,
        courtDate: undefined,
        indictmentRulingDecision: null,
        indictmentDecision: IndictmentDecision.REDISTRIBUTING,
      }),
    ).toEqual({
      color: 'blue',
      text: strings.reassignment.defaultMessage,
    })
  })

  test('should return postponed until verdict state', () => {
    expect(
      fn({
        ...theCase,
        state: CaseState.RECEIVED,
        type: CaseType.INDICTMENT,
        isValidToDateInThePast: false,
        courtDate: '2020-01-01',
        indictmentRulingDecision: null,
        indictmentDecision: IndictmentDecision.POSTPONING_UNTIL_VERDICT,
      }),
    ).toEqual({
      color: 'mint',
      text: strings.postponedUntilVerdict.defaultMessage,
    })
  })

  test('should return postponed until verdict state', () => {
    expect(
      fn({
        ...theCase,
        state: CaseState.RECEIVED,
        type: CaseType.INDICTMENT,
        isValidToDateInThePast: false,
        courtDate: '2020-01-01',
        indictmentRulingDecision: null,
        indictmentDecision: IndictmentDecision.POSTPONING,
      }),
    ).toEqual({
      color: 'mint',
      text: strings.scheduled.defaultMessage,
    })
  })

  test('should return postponed until verdict state', () => {
    expect(
      fn({
        ...theCase,
        state: CaseState.RECEIVED,
        type: CaseType.INDICTMENT,
        isValidToDateInThePast: false,
        courtDate: '2020-01-01',
        indictmentRulingDecision: null,
        indictmentDecision: IndictmentDecision.SCHEDULING,
      }),
    ).toEqual({
      color: 'mint',
      text: strings.scheduled.defaultMessage,
    })
  })

  test('should return postponed until verdict state', () => {
    expect(
      fn({
        ...theCase,
        state: CaseState.RECEIVED,
        type: CaseType.INDICTMENT,
        isValidToDateInThePast: false,
        courtDate: '2020-01-01',
        indictmentRulingDecision: null,
        indictmentDecision: IndictmentDecision.COMPLETING,
      }),
    ).toEqual({
      color: 'mint',
      text: strings.scheduled.defaultMessage,
    })
  })

  test('should return revoked state', () => {
    expect(
      fn({
        ...theCase,
        state: CaseState.WAITING_FOR_CANCELLATION,
        type: CaseType.INDICTMENT,
      }),
    ).toEqual({ color: 'rose', text: strings.recalled.defaultMessage })
  })
})
