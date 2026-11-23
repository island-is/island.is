import { firstValueFrom, of } from 'rxjs'
import { v4 as uuid } from 'uuid'

import { CallHandler, ExecutionContext } from '@nestjs/common'

import {
  AppealCaseRulingDecision,
  AppealCaseState,
  AppealCaseType,
  AppealRulingType,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system/types'

import { VerdictAppealOutcomeInterceptor } from '../verdictAppealOutcome.interceptor'

const nationalId = '0101010101'

const outcome = {
  appealRulingDecision: AppealCaseRulingDecision.ACCEPTING,
  appealRulingType: AppealRulingType.VERDICT,
  appealConclusion: 'the appealed judgment stands',
  appealRulingModifiedHistory: 'the judgment was corrected',
  appealRulingDate: new Date('2024-03-01'),
}
const withheldOutcome = {
  appealRulingDecision: undefined,
  appealRulingType: undefined,
  appealConclusion: undefined,
  appealRulingModifiedHistory: undefined,
  appealRulingDate: undefined,
}

const nonCourtOfAppealsUsers: [string, unknown][] = [
  [
    'a prosecution user',
    {
      role: UserRole.PROSECUTOR,
      nationalId,
      institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
    },
  ],
  [
    'a public prosecution office user',
    {
      role: UserRole.PUBLIC_PROSECUTOR_STAFF,
      nationalId,
      institution: { type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE },
    },
  ],
  [
    'a district court user',
    {
      role: UserRole.DISTRICT_COURT_JUDGE,
      nationalId,
      institution: { type: InstitutionType.DISTRICT_COURT },
    },
  ],
  ['a defence user', { role: UserRole.DEFENDER, nationalId }],
]

const courtOfAppealsUsers: [string, unknown][] = [
  UserRole.COURT_OF_APPEALS_JUDGE,
  UserRole.COURT_OF_APPEALS_REGISTRAR,
  UserRole.COURT_OF_APPEALS_ASSISTANT,
].map((role) => [
  role,
  { role, nationalId, institution: { type: InstitutionType.COURT_OF_APPEALS } },
])

const makeAppealCase = (
  appealType: AppealCaseType,
  appealState: AppealCaseState,
) => {
  const appealCase = {
    id: uuid(),
    appealType,
    appealState,
    appealCaseNumber: '2/2024',
    ...outcome,
  }

  return { ...appealCase, toJSON: () => appealCase }
}

describe('VerdictAppealOutcomeInterceptor', () => {
  const intercept = (appealCase: unknown, currentUser: unknown) =>
    firstValueFrom(
      new VerdictAppealOutcomeInterceptor().intercept(
        {
          switchToHttp: () => ({
            getRequest: () => ({ user: { currentUser } }),
          }),
        } as unknown as ExecutionContext,
        { handle: () => of(appealCase) } as unknown as CallHandler,
      ),
    ) as Promise<Record<string, unknown>>

  describe.each(nonCourtOfAppealsUsers)(
    'when the user is %s',
    (_, currentUser) => {
      describe.each([AppealCaseState.APPEALED, AppealCaseState.COMPLETED])(
        'and the verdict appeal is %s',
        (appealState) => {
          const appealCase = makeAppealCase(AppealCaseType.VERDICT, appealState)
          let result: Record<string, unknown>

          beforeEach(async () => {
            result = await intercept(appealCase, currentUser)
          })

          it('withholds the outcome', () => {
            expect(result).toMatchObject(withheldOutcome)
          })

          it('presents the appeal as in progress', () => {
            expect(result).toMatchObject({
              id: appealCase.id,
              appealState: AppealCaseState.APPEALED,
              appealCaseNumber: '2/2024',
            })
          })
        },
      )

      it('still presents a withdrawn appeal as withdrawn', async () => {
        const result = await intercept(
          makeAppealCase(AppealCaseType.VERDICT, AppealCaseState.WITHDRAWN),
          currentUser,
        )

        expect(result).toMatchObject({
          ...withheldOutcome,
          appealState: AppealCaseState.WITHDRAWN,
        })
      })
    },
  )

  describe.each(courtOfAppealsUsers)(
    'when the user is a court of appeals %s',
    (_, currentUser) => {
      it.each([AppealCaseState.APPEALED, AppealCaseState.COMPLETED])(
        'includes the outcome and the state of a %s verdict appeal',
        async (appealState) => {
          const appealCase = makeAppealCase(AppealCaseType.VERDICT, appealState)

          const result = await intercept(appealCase, currentUser)

          expect(result).toEqual({
            id: appealCase.id,
            appealType: AppealCaseType.VERDICT,
            appealCaseNumber: '2/2024',
            ...outcome,
            appealState,
          })
        },
      )
    },
  )

  describe.each([...nonCourtOfAppealsUsers, ...courtOfAppealsUsers])(
    'when the user is %s and the appeal is a ruling appeal',
    (_, currentUser) => {
      it('returns the appeal case untouched', async () => {
        const appealCase = makeAppealCase(
          AppealCaseType.RULING,
          AppealCaseState.COMPLETED,
        )

        const result = await intercept(appealCase, currentUser)

        expect(result).toBe(appealCase)
      })
    },
  )

  it('passes an empty result through', async () => {
    const result = await intercept(undefined, nonCourtOfAppealsUsers[0][1])

    expect(result).toBeUndefined()
  })
})
