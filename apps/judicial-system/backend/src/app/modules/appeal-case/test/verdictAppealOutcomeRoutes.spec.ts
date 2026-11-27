import { firstValueFrom, of } from 'rxjs'
import { v4 as uuid } from 'uuid'

import { CallHandler, ExecutionContext } from '@nestjs/common'
import { INTERCEPTORS_METADATA } from '@nestjs/common/constants'

import {
  AppealCaseRulingDecision,
  AppealCaseState,
  AppealCaseType,
  AppealRulingType,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system/types'

import { AppealCaseController } from '../appealCase.controller'
import { VerdictAppealOutcomeInterceptor } from '../interceptors/verdictAppealOutcome.interceptor'
import { LimitedAccessAppealCaseController } from '../limitedAccessAppealCase.controller'

const nationalId = '0101010101'

const outcome = {
  appealRulingDecision: AppealCaseRulingDecision.ACCEPTING,
  appealRulingType: AppealRulingType.VERDICT,
  appealConclusion: 'the appealed judgment stands',
  appealRulingModifiedHistory: 'the judgment was corrected',
  appealRulingDate: new Date('2024-03-01'),
}

const prosecutor = {
  role: UserRole.PROSECUTOR,
  nationalId,
  institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
}
const defender = { role: UserRole.DEFENDER, nationalId }
const courtOfAppealsJudge = {
  role: UserRole.COURT_OF_APPEALS_JUDGE,
  nationalId,
  institution: { type: InstitutionType.COURT_OF_APPEALS },
}

type Handler = (...args: unknown[]) => unknown

const handlerOf = (
  controller: { prototype: object },
  method: string,
): Handler => {
  const handler: unknown = Reflect.get(controller.prototype, method)

  if (typeof handler !== 'function') {
    throw new Error(`No handler ${method}`)
  }

  return handler as Handler
}

const interceptorsOf = (handler: Handler): unknown[] =>
  Reflect.getMetadata(INTERCEPTORS_METADATA, handler) ?? []

describe.each([
  [AppealCaseController, 'create', prosecutor],
  [AppealCaseController, 'update', prosecutor],
  [AppealCaseController, 'createEventLog', prosecutor],
  [AppealCaseController, 'transition', prosecutor],
  [LimitedAccessAppealCaseController, 'create', defender],
  [LimitedAccessAppealCaseController, 'createEventLog', defender],
  [LimitedAccessAppealCaseController, 'transition', defender],
])('%p %s - verdict appeal outcome', (controller, method, otherUser) => {
  const handler = handlerOf(controller, method)
  const appealCase = {
    id: uuid(),
    appealType: AppealCaseType.VERDICT,
    appealState: AppealCaseState.READY_TO_COMPLETE,
    appealCaseNumber: '2/2024',
    ...outcome,
  }

  const intercept = (currentUser: unknown) => {
    if (!interceptorsOf(handler).includes(VerdictAppealOutcomeInterceptor)) {
      throw new Error(`${method} does not carry the interceptor`)
    }

    const instance = new VerdictAppealOutcomeInterceptor()

    return firstValueFrom(
      instance.intercept(
        {
          switchToHttp: () => ({
            getRequest: () => ({ user: { currentUser } }),
          }),
        } as unknown as ExecutionContext,
        {
          handle: () => of({ ...appealCase, toJSON: () => appealCase }),
        } as unknown as CallHandler,
      ),
    ) as Promise<Record<string, unknown>>
  }

  it('carries the verdict appeal outcome interceptor', () => {
    expect(interceptorsOf(handler)).toContain(VerdictAppealOutcomeInterceptor)
  })

  it('withholds the outcome from a user outside the court of appeals', async () => {
    const result = await intercept(otherUser)

    expect(result).toMatchObject({
      id: appealCase.id,
      appealCaseNumber: '2/2024',
      appealState: AppealCaseState.APPEALED,
      appealRulingDecision: undefined,
      appealRulingType: undefined,
      appealConclusion: undefined,
      appealRulingModifiedHistory: undefined,
      appealRulingDate: undefined,
    })
  })

  it('includes the outcome for a court of appeals user', async () => {
    const result = await intercept(courtOfAppealsJudge)

    expect(result).toEqual(appealCase)
  })
})

describe.each([
  [AppealCaseController, 'getDefenderAppointmentLetterPdf'],
  [AppealCaseController, 'getSpokespersonAppointmentLetterPdf'],
  [LimitedAccessAppealCaseController, 'getDefenderAppointmentLetterPdf'],
  [LimitedAccessAppealCaseController, 'getSpokespersonAppointmentLetterPdf'],
])('%p %s', (controller, method) => {
  it('does not carry the verdict appeal outcome interceptor', () => {
    expect(interceptorsOf(handlerOf(controller, method))).not.toContain(
      VerdictAppealOutcomeInterceptor,
    )
  })
})

// Completing many verdict appeals returns them as a list, which the
// interceptor presents one by one.
describe('AppealCaseController completeVerdictAppeals - verdict appeal outcome', () => {
  it('carries the verdict appeal outcome interceptor', () => {
    expect(
      interceptorsOf(handlerOf(AppealCaseController, 'completeVerdictAppeals')),
    ).toContain(VerdictAppealOutcomeInterceptor)
  })
})
