import { firstValueFrom, of } from 'rxjs'

import { CallHandler, ExecutionContext } from '@nestjs/common'

import {
  AppealCaseState,
  CaseState,
  CaseType,
  getStatementDeadline,
} from '@island.is/judicial-system/types'

import { UpdatedCase } from '../../models/case.types'
import {
  transformUpdatedCase,
  UpdatedCaseInterceptor,
} from '../case.interceptor'

const appealReceivedByCourtDate = new Date('2024-01-10T10:00:00.000Z')

const makeCase = (withAppealCase: boolean) =>
  ({
    toJSON: () => ({
      id: 'case-id',
      type: CaseType.CUSTODY,
      state: CaseState.RECEIVED,
      court: { id: 'court-id', name: 'Héraðsdómur' },
      judge: { id: 'judge-id' },
      civilClaimants: [{ id: 'civil-claimant-id' }],
      // Read for the update's own side effects, not for the response
      appealDecisions: [{ id: 'appeal-decision-id' }],
      caseFiles: [{ id: 'case-file-id' }],
      dateLogs: [{ id: 'date-log-id' }],
      defendants: [{ id: 'defendant-id' }],
    }),
    type: CaseType.CUSTODY,
    appealDecisions: [],
    appealCase: withAppealCase
      ? {
          toJSON: () => ({
            id: 'appeal-case-id',
            appealState: AppealCaseState.RECEIVED,
            appealReceivedByCourtDate,
            appealEventLogs: [{ id: 'appeal-event-log-id' }],
          }),
          appealReceivedByCourtDate,
          appealEventLogs: [],
        }
      : undefined,
  } as unknown as UpdatedCase)

describe('transformUpdatedCase', () => {
  it('serves the row with the users and parties the web reads back', () => {
    const result = transformUpdatedCase(makeCase(false))

    expect(result).toMatchObject({
      id: 'case-id',
      type: CaseType.CUSTODY,
      state: CaseState.RECEIVED,
      court: { id: 'court-id', name: 'Héraðsdómur' },
      judge: { id: 'judge-id' },
      civilClaimants: [{ id: 'civil-claimant-id' }],
    })
    expect(result.appealCase).toBeUndefined()
  })

  it('keeps what the update read for its own side effects out of the response', () => {
    const result = transformUpdatedCase(makeCase(false))

    expect(result.appealDecisions).toBeUndefined()
    expect(result.caseFiles).toBeUndefined()
    expect(result.dateLogs).toBeUndefined()
    expect(result.defendants).toBeUndefined()
  })

  it('derives the appeal case the way the full case response does', () => {
    const result = transformUpdatedCase(makeCase(true))
    const appealCase = result.appealCase as Record<string, unknown>

    expect(appealCase).toMatchObject({
      id: 'appeal-case-id',
      appealState: AppealCaseState.RECEIVED,
      appealReceivedByCourtDate,
      statementDeadline: getStatementDeadline(appealReceivedByCourtDate),
      isStatementDeadlineExpired: true,
      appealedInCourt: false,
      appealedOutOfCourt: false,
    })
    expect(appealCase.appealEventLogs).toBeUndefined()
  })
})

describe('UpdatedCaseInterceptor', () => {
  it('serves the case the handler returns as an updated case', async () => {
    const theCase = makeCase(true)
    const next = { handle: () => of(theCase) } as CallHandler

    const result = await firstValueFrom(
      new UpdatedCaseInterceptor().intercept({} as ExecutionContext, next),
    )

    expect(result).toEqual(transformUpdatedCase(theCase))
  })
})
