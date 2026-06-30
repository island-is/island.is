import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { ForbiddenException } from '@nestjs/common'

import {
  addMessagesToQueue,
  MessageType,
} from '@island.is/judicial-system/message'
import {
  AppealCaseNotificationType,
  AppealCaseState,
  AppealCaseTransition,
  AppealDecisionPartyRole,
  AppealEventType,
  CaseAppealDecision,
  CaseType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingAppealCaseModule } from '../createTestingAppealCaseModule'

import { nowFactory } from '../../../../factories'
import { EventService } from '../../../event'
import {
  AppealCase,
  AppealCaseRepositoryService,
  AppealDecision,
  AppealDecisionRepositoryService,
  AppealEventLogRepositoryService,
  Case,
} from '../../../repository'
import { TransitionAppealCaseDto } from '../../dto/transitionAppealCase.dto'

jest.mock('@island.is/judicial-system/message')
jest.mock('../../../../factories')

interface Then {
  result: AppealCase
  error: Error
}

type GivenWhenThen = (
  theCase: Case,
  appealCase: AppealCase,
  transition: AppealCaseTransition,
  actingUser?: User,
) => Promise<Then>

describe('AppealCaseController - Transition', () => {
  const caseId = uuid()
  const appealCaseId = uuid()

  const user = {
    id: uuid(),
    role: UserRole.COURT_OF_APPEALS_JUDGE,
    institution: { type: InstitutionType.COURT_OF_APPEALS },
  } as User

  const now = new Date('2024-01-15T10:00:00Z')

  let mockAppealCaseRepositoryService: AppealCaseRepositoryService
  let mockAppealDecisionRepositoryService: AppealDecisionRepositoryService
  let mockAppealEventLogRepositoryService: AppealEventLogRepositoryService
  let mockEventService: EventService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    jest.clearAllMocks()

    const {
      appealCaseController,
      appealCaseRepositoryService,
      appealDecisionRepositoryService,
      appealEventLogRepositoryService,
      eventService,
      sequelize,
    } = await createTestingAppealCaseModule()

    mockAppealCaseRepositoryService = appealCaseRepositoryService
    mockAppealDecisionRepositoryService = appealDecisionRepositoryService
    mockAppealEventLogRepositoryService = appealEventLogRepositoryService
    mockEventService = eventService

    const mockNowFactory = nowFactory as jest.Mock
    mockNowFactory.mockReturnValue(now)

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementation(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    givenWhenThen = async (theCase, appealCase, transition, actingUser = user) => {
      const then = {} as Then

      const dto: TransitionAppealCaseDto = { transition }

      const updatedAppealCase = { ...appealCase } as AppealCase
      const mockUpdate = mockAppealCaseRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updatedAppealCase)

      await appealCaseController
        .transition(caseId, appealCaseId, actingUser, theCase, appealCase, dto)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('receive appeal', () => {
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const appealCase = {
      id: appealCaseId,
      appealState: AppealCaseState.APPEALED,
    } as AppealCase

    beforeEach(async () => {
      await givenWhenThen(
        theCase,
        appealCase,
        AppealCaseTransition.RECEIVE_APPEAL,
      )
    })

    it('should move the appeal case to received', () => {
      expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
        appealCaseId,
        expect.objectContaining({ appealState: AppealCaseState.RECEIVED }),
        { transaction },
      )
    })

    it('should queue the appeal received notification', () => {
      expect(addMessagesToQueue).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.APPEAL_CASE_NOTIFICATION,
          caseId,
          body: { type: AppealCaseNotificationType.APPEAL_RECEIVED_BY_COURT },
        }),
      )
    })

    it('should post the transition event', () => {
      expect(mockEventService.postEvent).toHaveBeenCalledWith(
        AppealCaseTransition.RECEIVE_APPEAL,
        theCase,
      )
    })
  })

  describe('complete appeal', () => {
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      caseFiles: [],
    } as unknown as Case
    const appealCase = {
      id: appealCaseId,
      appealState: AppealCaseState.RECEIVED,
    } as AppealCase

    beforeEach(async () => {
      await givenWhenThen(
        theCase,
        appealCase,
        AppealCaseTransition.COMPLETE_APPEAL,
      )
    })

    it('should move the appeal case to completed', () => {
      expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
        appealCaseId,
        expect.objectContaining({ appealState: AppealCaseState.COMPLETED }),
        { transaction },
      )
    })

    it('should queue the appeal completed notification and conclusion delivery', () => {
      expect(addMessagesToQueue).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.APPEAL_CASE_NOTIFICATION,
          caseId,
          body: { type: AppealCaseNotificationType.APPEAL_COMPLETED },
        }),
        expect.objectContaining({
          type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_CONCLUSION,
          caseId,
        }),
      )
    })
  })

  describe('withdraw appeal', () => {
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const appealCase = {
      id: appealCaseId,
      appealState: AppealCaseState.APPEALED,
    } as AppealCase

    beforeEach(async () => {
      await givenWhenThen(
        theCase,
        appealCase,
        AppealCaseTransition.WITHDRAW_APPEAL,
      )
    })

    it('should move the appeal case to withdrawn', () => {
      expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
        appealCaseId,
        expect.objectContaining({ appealState: AppealCaseState.WITHDRAWN }),
        { transaction },
      )
    })

    it('should queue the appeal withdrawn notification', () => {
      expect(addMessagesToQueue).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.APPEAL_CASE_NOTIFICATION,
          caseId,
          body: { type: AppealCaseNotificationType.APPEAL_WITHDRAWN },
        }),
      )
    })
  })

  describe('ruling-order appeals queue case notifications', () => {
    const theCase = { id: caseId, type: CaseType.INDICTMENT } as Case
    const appealCase = {
      id: appealCaseId,
      appealState: AppealCaseState.APPEALED,
      rulingFileId: uuid(),
    } as AppealCase

    beforeEach(async () => {
      await givenWhenThen(
        theCase,
        appealCase,
        AppealCaseTransition.RECEIVE_APPEAL,
      )
    })

    it('should still transition the appeal case', () => {
      expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
        appealCaseId,
        expect.objectContaining({ appealState: AppealCaseState.RECEIVED }),
        { transaction },
      )
    })

    it('should queue the received notification for the ruling-order appeal', () => {
      expect(addMessagesToQueue).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.APPEAL_CASE_NOTIFICATION,
          caseId,
          elementId: appealCaseId,
          body: { type: AppealCaseNotificationType.APPEAL_RECEIVED_BY_COURT },
        }),
      )
    })
  })

  describe('withdraw an in-court ruling-order appeal', () => {
    const rulingFileId = uuid()
    const defendantId = uuid()
    const prosecutorDecisionId = uuid()
    const defendantDecisionId = uuid()

    const prosecutor = {
      id: uuid(),
      role: UserRole.PROSECUTOR,
      nationalId: '0000000000',
      institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
    } as User

    const appealCase = {
      id: appealCaseId,
      rulingFileId,
      appealState: AppealCaseState.APPEALED,
    } as AppealCase

    // Both the prosecution and a defendant appealed this ruling in court.
    const caseWithDecisions = (
      decisions: Partial<AppealDecision>[],
    ): Case =>
      ({
        id: caseId,
        type: CaseType.INDICTMENT,
        defendants: [{ id: defendantId }],
        appealDecisions: decisions,
      } as unknown as Case)

    const bothAppealed: Partial<AppealDecision>[] = [
      {
        id: prosecutorDecisionId,
        rulingFileId,
        partyRole: AppealDecisionPartyRole.PROSECUTOR,
        decision: CaseAppealDecision.APPEAL,
      },
      {
        id: defendantDecisionId,
        rulingFileId,
        partyRole: AppealDecisionPartyRole.DEFENDANT,
        defendantId,
        decision: CaseAppealDecision.APPEAL,
      },
    ]

    describe('one of two appealing parties withdraws', () => {
      let then: Then

      beforeEach(async () => {
        // After the prosecution withdraws, the defendant's appeal still stands.
        ;(
          mockAppealDecisionRepositoryService.findAll as jest.Mock
        ).mockResolvedValue([
          { ...bothAppealed[0], withdrawnDate: now },
          bothAppealed[1],
        ])

        then = await givenWhenThen(
          caseWithDecisions(bothAppealed),
          appealCase,
          AppealCaseTransition.WITHDRAW_APPEAL,
          prosecutor,
        )
      })

      it('should stamp the withdrawing party with the server time', () => {
        expect(
          mockAppealDecisionRepositoryService.update,
        ).toHaveBeenCalledWith(
          prosecutorDecisionId,
          { withdrawnDate: now },
          { transaction },
        )
      })

      it('should record an APPEAL_WITHDRAWN event', () => {
        expect(
          mockAppealEventLogRepositoryService.create,
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            appealCaseId,
            eventType: AppealEventType.APPEAL_WITHDRAWN,
            userRole: UserRole.PROSECUTOR,
          }),
          { transaction },
        )
      })

      it('should leave the appeal standing - no transition, no notification', () => {
        expect(then.error).toBeUndefined()
        expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalled()
        expect(addMessagesToQueue).not.toHaveBeenCalledWith(
          expect.objectContaining({
            body: { type: AppealCaseNotificationType.APPEAL_WITHDRAWN },
          }),
        )
      })
    })

    describe('the last appealing party withdraws', () => {
      beforeEach(async () => {
        ;(
          mockAppealDecisionRepositoryService.findAll as jest.Mock
        ).mockResolvedValue([{ ...bothAppealed[0], withdrawnDate: now }])

        await givenWhenThen(
          caseWithDecisions([bothAppealed[0]]),
          appealCase,
          AppealCaseTransition.WITHDRAW_APPEAL,
          prosecutor,
        )
      })

      it('should withdraw the appeal case and queue the withdrawn notification', () => {
        expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
          appealCaseId,
          expect.objectContaining({
            appealState: AppealCaseState.WITHDRAWN,
          }),
          { transaction },
        )
        expect(addMessagesToQueue).toHaveBeenCalledWith(
          expect.objectContaining({
            body: { type: AppealCaseNotificationType.APPEAL_WITHDRAWN },
          }),
        )
      })
    })

    describe('a party that did not appeal in court tries to withdraw', () => {
      let then: Then

      beforeEach(async () => {
        then = await givenWhenThen(
          caseWithDecisions([
            {
              id: prosecutorDecisionId,
              rulingFileId,
              partyRole: AppealDecisionPartyRole.PROSECUTOR,
              decision: CaseAppealDecision.ACCEPT,
            },
            bothAppealed[1],
          ]),
          appealCase,
          AppealCaseTransition.WITHDRAW_APPEAL,
          prosecutor,
        )
      })

      it('should reject and stamp nothing', () => {
        expect(then.error).toBeInstanceOf(ForbiddenException)
        expect(
          mockAppealDecisionRepositoryService.update,
        ).not.toHaveBeenCalled()
      })
    })
  })
})
