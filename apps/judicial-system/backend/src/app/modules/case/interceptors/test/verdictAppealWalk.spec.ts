import { firstValueFrom, of } from 'rxjs'

import { CallHandler, ExecutionContext } from '@nestjs/common'

import {
  AppealCaseRulingDecision,
  AppealCaseState,
  AppealCaseTransition,
  AppealCaseType,
  AppealRulingType,
  CaseFileCategory,
  CaseFileState,
  CaseType,
  InstitutionType,
  UserRole,
  VerdictAppealStatus,
} from '@island.is/judicial-system/types'

import { transitionAppealCase } from '../../../appeal-case/state/appealCase.state'
import { AppealCase, Case, CaseRepositoryService } from '../../../repository'
import { CaseInterceptor } from '../case.interceptor'

// One verdict appeal taken through the court's confirmation and the release of
// its outcome, as a prosecution user is presented it at each step. Confirming
// must not change anything a prosecution user can see; completing releases the
// outcome, but never the court's own ruling document.
describe('CaseInterceptor - a verdict appeal from appeal to completion', () => {
  const prosecutor = {
    role: UserRole.PROSECUTOR,
    nationalId: '0101010101',
    institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
  }

  const outcome = {
    appealRulingDecision: AppealCaseRulingDecision.ACCEPTING,
    appealRulingType: AppealRulingType.VERDICT,
    appealConclusion: 'the appealed judgment stands',
    appealRulingDate: new Date('2024-03-01'),
  }

  // Confirming requires a recorded status of completed, so the appeal carries
  // it before it is confirmed as well.
  const recorded = {
    id: 'verdict_appeal',
    appealType: AppealCaseType.VERDICT,
    appealState: AppealCaseState.APPEALED,
    appealCaseNumber: '2/2024',
    verdictAppealStatus: VerdictAppealStatus.COMPLETED,
    ...outcome,
  }

  const theCase = { id: 'case', type: CaseType.INDICTMENT } as Case

  const makeFile = (id: string, category: CaseFileCategory) => {
    const file = { id, category, state: CaseFileState.STORED_IN_RVG }

    return { ...file, toJSON: () => file }
  }

  const presentToProsecutor = async (
    verdictAppealCase: typeof recorded,
  ): Promise<{
    verdictAppealCase: Record<string, unknown>
    caseFiles: { id: string }[]
  }> => {
    const interceptor = new CaseInterceptor({
      findOriginalAncestorId: (c: { id?: string }) => Promise.resolve(c.id),
    } as unknown as CaseRepositoryService)

    const result = await firstValueFrom(
      interceptor.intercept(
        {
          switchToHttp: () => ({
            getRequest: () => ({ user: { currentUser: prosecutor } }),
          }),
        } as unknown as ExecutionContext,
        {
          handle: () =>
            of({
              toJSON: () => ({}),
              type: CaseType.INDICTMENT,
              defendants: [],
              verdictAppealCase: {
                ...verdictAppealCase,
                toJSON: () => verdictAppealCase,
              },
              caseFiles: [
                makeFile('district_ruling', CaseFileCategory.RULING),
                makeFile(
                  'verdict_appeal_ruling',
                  CaseFileCategory.VERDICT_APPEAL_RULING,
                ),
              ],
            }),
        } as unknown as CallHandler,
      ),
    )

    return result as {
      verdictAppealCase: Record<string, unknown>
      caseFiles: { id: string }[]
    }
  }

  const transition = (
    appealCase: typeof recorded,
    appealCaseTransition: AppealCaseTransition,
  ): typeof recorded => ({
    ...appealCase,
    ...transitionAppealCase(
      appealCaseTransition,
      theCase,
      appealCase as unknown as AppealCase,
    ).appealCaseUpdate,
  })

  const appealed = recorded
  const confirmed = transition(
    appealed,
    AppealCaseTransition.MARK_APPEAL_READY_TO_COMPLETE,
  )
  const completed = transition(confirmed, AppealCaseTransition.COMPLETE_APPEAL)

  it('moves through the two transitions, keeping what the court recorded', () => {
    expect(confirmed).toEqual({
      ...appealed,
      appealState: AppealCaseState.READY_TO_COMPLETE,
    })
    expect(completed).toEqual({
      ...appealed,
      appealState: AppealCaseState.COMPLETED,
    })
  })

  it('presents a confirmed appeal exactly as the appeal before it was confirmed', async () => {
    const beforeConfirming = await presentToProsecutor(appealed)
    const afterConfirming = await presentToProsecutor(confirmed)

    expect(afterConfirming).toEqual(beforeConfirming)
    expect(afterConfirming.verdictAppealCase).toMatchObject({
      appealState: AppealCaseState.APPEALED,
      verdictAppealStatus: VerdictAppealStatus.UNDER_ADVISEMENT,
      appealRulingDecision: undefined,
      appealRulingType: undefined,
      appealConclusion: undefined,
      appealRulingDate: undefined,
    })
    expect(afterConfirming.caseFiles.map((file) => file.id)).toEqual([
      'district_ruling',
    ])
  })

  it('releases the outcome of a completed appeal, but not the court ruling document', async () => {
    const afterCompleting = await presentToProsecutor(completed)

    expect(afterCompleting.verdictAppealCase).toMatchObject({
      ...outcome,
      appealState: AppealCaseState.COMPLETED,
      verdictAppealStatus: VerdictAppealStatus.COMPLETED,
    })
    expect(afterCompleting.caseFiles.map((file) => file.id)).toEqual([
      'district_ruling',
    ])
  })
})
