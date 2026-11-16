import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { BadRequestException, ForbiddenException } from '@nestjs/common'

import { MessageType } from '@island.is/judicial-system/message'
import {
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  IndictmentCaseNotificationType,
  ServiceRequirement,
  User,
  UserRole,
  VerdictAppealDecision,
} from '@island.is/judicial-system/types'

import { createTestingVerdictModule } from '../createTestingVerdictModule'

import {
  getOrCreateTransaction,
  queueMessagesAfterCommit,
} from '../../../../middleware'
import { runInRequestContext } from '../../../../test'
import {
  Case,
  Defendant,
  Verdict,
  VerdictRepositoryService,
} from '../../../repository'

jest.mock('../../../../middleware/queueMessagesAfterCommit')

interface Then {
  result: Verdict
  error: Error
}

type GivenWhenThen = (
  verdictOverrides?: Partial<Verdict>,
  defendantOverrides?: Partial<Defendant>,
  caseOverrides?: Partial<Case>,
) => Promise<Then>

describe('LimitedAccessVerdictController - Accept verdict', () => {
  const caseId = uuid()
  const defendantId = uuid()
  const verdictId = uuid()
  const defenderNationalId = '1111111111'

  const defender = {
    id: uuid(),
    role: UserRole.DEFENDER,
    nationalId: defenderNationalId,
    name: 'Lára Lögmann',
  } as User

  // Derived from the clock: one verdict served just now, one served long
  // enough ago that its appeal deadline has passed whenever the spec runs.
  const servedNow = new Date()
  const servedLongAgo = new Date()
  servedLongAgo.setFullYear(servedLongAgo.getFullYear() - 1)

  const acceptedVerdict = {
    id: verdictId,
    appealDecision: VerdictAppealDecision.ACCEPT,
  } as Verdict

  let mockVerdictRepositoryService: VerdictRepositoryService
  let mockSequelize: Sequelize
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    jest.clearAllMocks()

    const {
      limitedAccessVerdictController,
      verdictRepositoryService,
      sequelize,
    } = await createTestingVerdictModule()

    mockVerdictRepositoryService = verdictRepositoryService
    mockSequelize = sequelize

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    const mockUpdate = mockVerdictRepositoryService.update as jest.Mock
    mockUpdate.mockResolvedValue(acceptedVerdict)

    givenWhenThen = async (
      verdictOverrides = {},
      defendantOverrides = {},
      caseOverrides = {},
    ) => {
      const then = {} as Then

      const verdict = {
        id: verdictId,
        caseId,
        defendantId,
        serviceRequirement: ServiceRequirement.REQUIRED,
        serviceDate: servedNow,
        appealDecision: VerdictAppealDecision.POSTPONE,
        ...verdictOverrides,
      } as Verdict

      const defendant = {
        id: defendantId,
        isDefenderChoiceConfirmed: true,
        defenderNationalId,
        verdicts: [verdict],
        ...defendantOverrides,
      } as Defendant

      const theCase = {
        id: caseId,
        type: CaseType.INDICTMENT,
        state: CaseState.COMPLETED,
        indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
        rulingDate: servedNow,
        defendants: [defendant],
        ...caseOverrides,
      } as Case

      // The route is guarded by LimitedAccessCaseExistsForUpdateGuard, so the
      // request transaction is already open by the time the handler runs.
      // Guards do not execute in controller unit tests, so the request context
      // and that transaction are set up here instead.
      try {
        await runInRequestContext(async () => {
          await getOrCreateTransaction(mockSequelize)

          then.result = await limitedAccessVerdictController.acceptVerdict(
            caseId,
            defendantId,
            defender,
            theCase,
            defendant,
            verdict,
            { appealDecision: VerdictAppealDecision.ACCEPT },
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  const expectAccepted = (then: Then) => {
    expect(then.error).toBeUndefined()
    expect(mockSequelize.transaction).toHaveBeenCalledTimes(1)
    expect(mockVerdictRepositoryService.update).toHaveBeenCalledWith(
      caseId,
      defendantId,
      verdictId,
      { appealDecision: VerdictAppealDecision.ACCEPT },
      { transaction },
    )
    expect(then.result).toBe(acceptedVerdict)
    expect(queueMessagesAfterCommit).toHaveBeenCalledTimes(1)
    expect(queueMessagesAfterCommit).toHaveBeenCalledWith({
      type: MessageType.NOTIFICATION,
      user: defender,
      caseId,
      body: {
        type: IndictmentCaseNotificationType.INDICTMENT_VERDICT_ACCEPTED_BY_DEFENDER,
      },
    })
  }

  const expectRejected = (then: Then) => {
    expect(then.error).toBeInstanceOf(ForbiddenException)
    expect(mockVerdictRepositoryService.update).not.toHaveBeenCalled()
    expect(queueMessagesAfterCommit).not.toHaveBeenCalled()
  }

  it('should accept a served verdict inside the appeal deadline and tell the public prosecution', async () => {
    expectAccepted(await givenWhenThen())
  })

  it('should accept a verdict with no position registered', async () => {
    expectAccepted(await givenWhenThen({ appealDecision: undefined }))
  })

  it('should accept the verdict of a defendant who was present in court', async () => {
    expectAccepted(
      await givenWhenThen({
        serviceRequirement: ServiceRequirement.NOT_APPLICABLE,
        serviceDate: undefined,
      }),
    )
  })

  // Nothing changed, so there is nothing to write and nothing to announce.
  it('should neither write nor notify when the verdict is already accepted', async () => {
    const then = await givenWhenThen({
      appealDecision: VerdictAppealDecision.ACCEPT,
    })

    expect(then.error).toBeUndefined()
    expect(then.result.appealDecision).toBe(VerdictAppealDecision.ACCEPT)
    expect(mockVerdictRepositoryService.update).not.toHaveBeenCalled()
    expect(queueMessagesAfterCommit).not.toHaveBeenCalled()
  })

  it("should reject another defendant's defender", async () => {
    expectRejected(
      await givenWhenThen({}, { defenderNationalId: '2222222222' }),
    )
  })

  it('should reject a defender the court has not confirmed', async () => {
    expectRejected(
      await givenWhenThen({}, { isDefenderChoiceConfirmed: false }),
    )
  })

  it('should reject a case that did not end in a ruling', async () => {
    expectRejected(
      await givenWhenThen(
        {},
        {},
        { indictmentRulingDecision: CaseIndictmentRulingDecision.FINE },
      ),
    )
  })

  it('should reject a verdict that has not been served', async () => {
    expectRejected(await givenWhenThen({ serviceDate: undefined }))
  })

  it('should reject a default judgement', async () => {
    expectRejected(await givenWhenThen({ isDefaultJudgement: true }))
  })

  // The deadline binds accepting the way it binds the defender's appeal.
  it('should reject a verdict whose appeal deadline has passed', async () => {
    const then = await givenWhenThen({ serviceDate: servedLongAgo })

    expect(then.error).toBeInstanceOf(BadRequestException)
    expect(mockVerdictRepositoryService.update).not.toHaveBeenCalled()
    expect(queueMessagesAfterCommit).not.toHaveBeenCalled()
  })

  it('should reject a verdict that has been appealed', async () => {
    expectRejected(await givenWhenThen({ appealDate: new Date() }))
  })
})
