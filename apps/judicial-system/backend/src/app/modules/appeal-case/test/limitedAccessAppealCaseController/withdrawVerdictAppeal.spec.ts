import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { addMessagesToQueue } from '@island.is/judicial-system/message'
import {
  AppealCaseState,
  AppealCaseTransition,
  AppealCaseType,
  AppealEventType,
  CaseState,
  CaseType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingAppealCaseModule } from '../createTestingAppealCaseModule'

import {
  AppealCase,
  AppealCaseRepositoryService,
  AppealEventLog,
  AppealEventLogRepositoryService,
  Case,
  CaseRepositoryService,
  VerdictRepositoryService,
} from '../../../repository'
import { TransitionAppealCaseDto } from '../../dto/transitionAppealCase.dto'

jest.mock('@island.is/judicial-system/message')

interface Then {
  result: AppealCase
  error: Error
}

type GivenWhenThen = (
  theCase: Case,
  appealCase: AppealCase,
  dto: TransitionAppealCaseDto,
) => Promise<Then>

describe('LimitedAccessAppealCaseController - Withdraw verdict appeal', () => {
  const caseId = uuid()
  const appealCaseId = uuid()
  const defendantId = uuid()
  const otherDefendantId = uuid()
  const verdictId = uuid()
  const defenderNationalId = '1111111111'

  const defender = {
    id: uuid(),
    role: UserRole.DEFENDER,
    nationalId: defenderNationalId,
    name: 'Lára Lögmann',
    title: 'lögmaður',
  } as User

  const appealCase = {
    id: appealCaseId,
    caseId,
    appealType: AppealCaseType.VERDICT,
    appealState: AppealCaseState.APPEALED,
  } as AppealCase

  const theCase = {
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.COMPLETED,
    caseFiles: [],
    defendants: [
      {
        id: defendantId,
        isDefenderChoiceConfirmed: true,
        defenderNationalId,
        verdicts: [{ id: verdictId }],
      },
      {
        id: otherDefendantId,
        isDefenderChoiceConfirmed: true,
        defenderNationalId: '2222222222',
        verdicts: [{ id: uuid() }],
      },
    ],
  } as unknown as Case

  const dto: TransitionAppealCaseDto = {
    transition: AppealCaseTransition.WITHDRAW_APPEAL,
    defendantId,
  }

  const appealedEvent = (id: string, created: string) =>
    ({
      defendantId: id,
      eventType: AppealEventType.APPEALED,
      created: new Date(created),
    } as AppealEventLog)

  const withdrawnEvent = (id: string, created: string) =>
    ({
      defendantId: id,
      eventType: AppealEventType.APPEAL_WITHDRAWN,
      created: new Date(created),
    } as AppealEventLog)

  let mockAppealCaseRepositoryService: AppealCaseRepositoryService
  let mockAppealEventLogRepositoryService: AppealEventLogRepositoryService
  let mockCaseRepositoryService: CaseRepositoryService
  let mockVerdictRepositoryService: VerdictRepositoryService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    jest.clearAllMocks()

    const {
      limitedAccessAppealCaseController,
      appealCaseRepositoryService,
      appealEventLogRepositoryService,
      caseRepositoryService,
      verdictRepositoryService,
      sequelize,
    } = await createTestingAppealCaseModule()

    mockAppealCaseRepositoryService = appealCaseRepositoryService
    mockAppealEventLogRepositoryService = appealEventLogRepositoryService
    mockCaseRepositoryService = caseRepositoryService
    mockVerdictRepositoryService = verdictRepositoryService

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementation(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )
    ;(
      mockCaseRepositoryService.lockByIdForUpdate as jest.Mock
    ).mockResolvedValue(true)
    ;(mockAppealCaseRepositoryService.update as jest.Mock).mockResolvedValue({
      ...appealCase,
      appealState: AppealCaseState.WITHDRAWN,
    })

    givenWhenThen = async (aCase, anAppealCase, transitionDto) => {
      const then = {} as Then

      await limitedAccessAppealCaseController
        .transition(
          caseId,
          appealCaseId,
          defender,
          aCase,
          anAppealCase,
          transitionDto,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('one of several appellants withdraws', () => {
    let then: Then

    beforeEach(async () => {
      ;(
        mockAppealEventLogRepositoryService.findAll as jest.Mock
      ).mockResolvedValue([
        appealedEvent(defendantId, '2026-06-04T13:34:00Z'),
        appealedEvent(otherDefendantId, '2026-06-05T09:00:00Z'),
      ])

      then = await givenWhenThen(theCase, appealCase, dto)
    })

    it('should record an APPEAL_WITHDRAWN event for that defendant alone', () => {
      expect(then.error).toBeUndefined()
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledTimes(
        1,
      )
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          caseId,
          appealCaseId,
          eventType: AppealEventType.APPEAL_WITHDRAWN,
          defendantId,
        }),
        { transaction },
      )
    })

    it('should clear the appeal date mirrored onto the verdict', () => {
      expect(mockVerdictRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        defendantId,
        verdictId,
        { appealDate: null },
        { transaction },
      )
    })

    // The verdict appeal stands as long as anyone is still appealing it, so neither the
    // appeal case nor the notification moves.
    it('should leave the appeal case standing', () => {
      expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalled()
      expect(addMessagesToQueue).not.toHaveBeenCalled()
      expect(then.result).toBe(appealCase)
    })
  })

  describe('the last appellant withdraws', () => {
    let then: Then

    beforeEach(async () => {
      ;(
        mockAppealEventLogRepositoryService.findAll as jest.Mock
      ).mockResolvedValue([
        appealedEvent(defendantId, '2026-06-04T13:34:00Z'),
        appealedEvent(otherDefendantId, '2026-06-05T09:00:00Z'),
        withdrawnEvent(otherDefendantId, '2026-06-06T09:00:00Z'),
      ])

      then = await givenWhenThen(theCase, appealCase, dto)
    })

    it('should withdraw the appeal case itself', () => {
      expect(then.error).toBeUndefined()
      expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
        appealCaseId,
        { appealState: AppealCaseState.WITHDRAWN },
        { transaction },
      )
    })

    it('should notify that the appeal was withdrawn', () => {
      expect(addMessagesToQueue).toHaveBeenCalled()
    })
  })

  describe('withdrawals that are not allowed', () => {
    it('should reject a withdrawal that names no defendant', async () => {
      const then = await givenWhenThen(theCase, appealCase, {
        transition: AppealCaseTransition.WITHDRAW_APPEAL,
      })

      expect(then.error).toBeDefined()
      expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
    })

    it('should reject a withdrawal by someone who is not the confirmed defender', async () => {
      const then = await givenWhenThen(theCase, appealCase, {
        transition: AppealCaseTransition.WITHDRAW_APPEAL,
        defendantId: otherDefendantId,
      })

      expect(then.error).toBeDefined()
      expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
    })

    it('should reject a withdrawal when the defendant is not appealing', async () => {
      ;(
        mockAppealEventLogRepositoryService.findAll as jest.Mock
      ).mockResolvedValue([
        appealedEvent(defendantId, '2026-06-04T13:34:00Z'),
        withdrawnEvent(defendantId, '2026-06-05T09:00:00Z'),
      ])

      const then = await givenWhenThen(theCase, appealCase, dto)

      expect(then.error).toBeDefined()
      expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
      expect(mockVerdictRepositoryService.update).not.toHaveBeenCalled()
    })

    // A defendant may appeal again while the deadline runs, so a withdrawal
    // followed by a fresh appeal leaves them standing.
    it('should allow a withdrawal after the defendant appealed again', async () => {
      ;(
        mockAppealEventLogRepositoryService.findAll as jest.Mock
      ).mockResolvedValue([
        appealedEvent(defendantId, '2026-06-04T13:34:00Z'),
        withdrawnEvent(defendantId, '2026-06-05T09:00:00Z'),
        appealedEvent(defendantId, '2026-06-06T09:00:00Z'),
      ])

      const then = await givenWhenThen(theCase, appealCase, dto)

      expect(then.error).toBeUndefined()
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: AppealEventType.APPEAL_WITHDRAWN,
          defendantId,
        }),
        { transaction },
      )
    })
  })
})
