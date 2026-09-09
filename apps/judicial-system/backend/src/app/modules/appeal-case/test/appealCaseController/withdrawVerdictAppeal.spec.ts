import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException, ForbiddenException } from '@nestjs/common'

import {
  AppealCaseState,
  AppealCaseTransition,
  AppealCaseType,
  AppealEventType,
  CaseState,
  CaseType,
  InstitutionType,
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
  DefendantRepositoryService,
  VerdictRepositoryService,
} from '../../../repository'
import { TransitionAppealCaseDto } from '../../dto/transitionAppealCase.dto'

jest.mock('@island.is/judicial-system/message')

interface Then {
  result: AppealCase
  error: Error
}

type GivenWhenThen = (dto: TransitionAppealCaseDto) => Promise<Then>

// The public prosecution office withdraws a verdict appeal on the defendant's
// behalf, as it registers one - for an appeal that arrived outside the system.
describe('AppealCaseController - Withdraw verdict appeal', () => {
  const caseId = uuid()
  const appealCaseId = uuid()
  const defendantId = uuid()
  const otherDefendantId = uuid()
  const verdictId = uuid()

  const publicProsecutorStaff = {
    id: uuid(),
    role: UserRole.PUBLIC_PROSECUTOR_STAFF,
    nationalId: '3333333333',
    name: 'Skrifstofa Ríkissaksóknara',
    title: 'skrifstofa',
    institution: {
      type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
      name: 'Ríkissaksóknari',
    },
  } as User

  const appealCase = {
    id: appealCaseId,
    caseId,
    appealType: AppealCaseType.VERDICT,
    appealState: AppealCaseState.APPEALED,
  } as AppealCase

  // The office is not the defender of either defendant.
  const theCase = {
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.COMPLETED,
    caseFiles: [],
    defendants: [
      {
        id: defendantId,
        isDefenderChoiceConfirmed: true,
        defenderNationalId: '1111111111',
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

  let mockAppealCaseRepositoryService: AppealCaseRepositoryService
  let mockAppealEventLogRepositoryService: AppealEventLogRepositoryService
  let mockCaseRepositoryService: CaseRepositoryService
  let mockDefendantRepositoryService: DefendantRepositoryService
  let mockVerdictRepositoryService: VerdictRepositoryService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    jest.clearAllMocks()

    const {
      appealCaseController,
      appealCaseRepositoryService,
      appealEventLogRepositoryService,
      caseRepositoryService,
      defendantRepositoryService,
      verdictRepositoryService,
      sequelize,
    } = await createTestingAppealCaseModule()

    mockAppealCaseRepositoryService = appealCaseRepositoryService
    mockAppealEventLogRepositoryService = appealEventLogRepositoryService
    mockCaseRepositoryService = caseRepositoryService
    mockDefendantRepositoryService = defendantRepositoryService
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

    givenWhenThen = async (transitionDto) => {
      const then = {} as Then

      await appealCaseController
        .transition(
          caseId,
          appealCaseId,
          publicProsecutorStaff,
          theCase,
          appealCase,
          transitionDto,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('the office withdraws for one of two appellants', () => {
    let then: Then

    beforeEach(async () => {
      ;(
        mockAppealEventLogRepositoryService.findAll as jest.Mock
      ).mockResolvedValue([
        appealedEvent(defendantId, '2026-06-04T13:34:00Z'),
        appealedEvent(otherDefendantId, '2026-06-05T09:00:00Z'),
      ])

      then = await givenWhenThen(dto)
    })

    it('should record an APPEAL_WITHDRAWN event for that defendant, by the office', () => {
      expect(then.error).toBeUndefined()
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledTimes(
        1,
      )
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          appealCaseId,
          eventType: AppealEventType.APPEAL_WITHDRAWN,
          defendantId,
          userRole: UserRole.PUBLIC_PROSECUTOR_STAFF,
          userId: publicProsecutorStaff.id,
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

    // The appeal defender belongs to the appeal that was just withdrawn.
    it('should clear the appeal defender recorded on the defendant', () => {
      expect(mockDefendantRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        defendantId,
        {
          appealDefenderName: null,
          appealDefenderNationalId: null,
          appealDefenderEmail: null,
          appealDefenderPhoneNumber: null,
          isAppealDefenderConfirmed: null,
        },
        { transaction },
      )
    })

    it('should leave the appeal case standing for the other appellant', () => {
      expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalled()
      expect(then.result).toBe(appealCase)
    })
  })

  describe('the office withdraws for the last appellant', () => {
    let then: Then

    beforeEach(async () => {
      ;(
        mockAppealEventLogRepositoryService.findAll as jest.Mock
      ).mockResolvedValue([appealedEvent(defendantId, '2026-06-04T13:34:00Z')])

      then = await givenWhenThen(dto)
    })

    it('should withdraw the appeal case', () => {
      expect(then.error).toBeUndefined()
      expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
        appealCaseId,
        expect.objectContaining({ appealState: AppealCaseState.WITHDRAWN }),
        { transaction },
      )
    })
  })

  describe('withdrawals that are not allowed', () => {
    it('should reject a withdrawal for a defendant with no standing appeal', async () => {
      ;(
        mockAppealEventLogRepositoryService.findAll as jest.Mock
      ).mockResolvedValue([
        appealedEvent(otherDefendantId, '2026-06-05T09:00:00Z'),
      ])

      const then = await givenWhenThen(dto)

      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
      expect(mockVerdictRepositoryService.update).not.toHaveBeenCalled()
    })

    it('should reject a withdrawal that names no defendant', async () => {
      const then = await givenWhenThen({
        transition: AppealCaseTransition.WITHDRAW_APPEAL,
      })

      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
    })
  })
})
