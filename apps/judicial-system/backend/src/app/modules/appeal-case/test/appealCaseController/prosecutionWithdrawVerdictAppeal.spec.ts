import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { ForbiddenException } from '@nestjs/common'

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

type GivenWhenThen = (
  dto: TransitionAppealCaseDto,
  appealCase?: AppealCase,
  user?: User,
) => Promise<Then>

// The public prosecution reviewer withdraws the prosecution's appeal of one
// defendant's verdict - the review decision changed away from appealing.
describe('AppealCaseController - Prosecution withdraws a verdict appeal', () => {
  const caseId = uuid()
  const appealCaseId = uuid()
  const defendantId = uuid()
  const otherDefendantId = uuid()
  const reviewerId = uuid()

  const reviewer = {
    id: reviewerId,
    role: UserRole.PROSECUTOR,
    nationalId: '3333333333',
    name: 'Kamilla Haralz',
    title: 'saksóknari',
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

  const theCase = {
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.COMPLETED,
    indictmentReviewerId: reviewerId,
    caseFiles: [],
    defendants: [
      { id: defendantId, verdicts: [{ id: uuid() }] },
      { id: otherDefendantId, verdicts: [{ id: uuid() }] },
    ],
  } as unknown as Case

  const dto: TransitionAppealCaseDto = {
    transition: AppealCaseTransition.WITHDRAW_APPEAL,
    defendantId,
  }

  const event = (
    forDefendantId: string,
    eventType: AppealEventType,
    userRole: UserRole,
    created: string,
  ) =>
    ({
      defendantId: forDefendantId,
      eventType,
      userRole,
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

    givenWhenThen = async (
      transitionDto,
      anAppealCase = appealCase,
      user = reviewer,
    ) => {
      const then = {} as Then

      await appealCaseController
        .transition(
          caseId,
          appealCaseId,
          user,
          theCase,
          anAppealCase,
          transitionDto,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  // The defendant's own appeal of the same verdict stands on its own.
  describe('the prosecution withdraws while the defendant still appeals', () => {
    let then: Then

    beforeEach(async () => {
      ;(
        mockAppealEventLogRepositoryService.findAll as jest.Mock
      ).mockResolvedValue([
        event(
          defendantId,
          AppealEventType.APPEALED,
          UserRole.DEFENDER,
          '2026-06-04T13:34:00Z',
        ),
        event(
          defendantId,
          AppealEventType.APPEALED,
          UserRole.PROSECUTOR,
          '2026-06-05T09:00:00Z',
        ),
      ])

      then = await givenWhenThen(dto)
    })

    it('should record a prosecution APPEAL_WITHDRAWN event for that defendant', () => {
      expect(then.error).toBeUndefined()
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledTimes(
        1,
      )
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          appealCaseId,
          eventType: AppealEventType.APPEAL_WITHDRAWN,
          userRole: UserRole.PROSECUTOR,
          userId: reviewerId,
          defendantId,
        }),
        { transaction },
      )
    })

    it('should leave the defendant own appeal - mirror and defender - alone', () => {
      expect(mockVerdictRepositoryService.update).not.toHaveBeenCalled()
      expect(mockDefendantRepositoryService.update).not.toHaveBeenCalled()
    })

    it('should leave the appeal case standing', () => {
      expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalled()
      expect(then.result).toBe(appealCase)
    })
  })

  describe('the prosecution withdraws the last standing appeal', () => {
    let then: Then

    beforeEach(async () => {
      ;(
        mockAppealEventLogRepositoryService.findAll as jest.Mock
      ).mockResolvedValue([
        event(
          defendantId,
          AppealEventType.APPEALED,
          UserRole.PROSECUTOR,
          '2026-06-05T09:00:00Z',
        ),
      ])

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
    const expectRejected = async (
      transitionDto: TransitionAppealCaseDto,
      anAppealCase?: AppealCase,
      user?: User,
    ) => {
      const then = await givenWhenThen(transitionDto, anAppealCase, user)

      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
      expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalled()
    }

    it('should reject withdrawing a defendant the prosecution did not appeal', async () => {
      ;(
        mockAppealEventLogRepositoryService.findAll as jest.Mock
      ).mockResolvedValue([
        event(
          defendantId,
          AppealEventType.APPEALED,
          UserRole.DEFENDER,
          '2026-06-04T13:34:00Z',
        ),
        event(
          otherDefendantId,
          AppealEventType.APPEALED,
          UserRole.PROSECUTOR,
          '2026-06-05T09:00:00Z',
        ),
      ])

      await expectRejected(dto)
    })

    it('should reject a prosecutor who is not the reviewer assigned to the case', async () => {
      await expectRejected(dto, appealCase, {
        ...reviewer,
        id: uuid(),
      } as User)
    })

    it('should reject a withdrawal once the court of appeals has received the case', async () => {
      await expectRejected(dto, {
        ...appealCase,
        appealState: AppealCaseState.RECEIVED,
      } as AppealCase)
    })
  })
})
