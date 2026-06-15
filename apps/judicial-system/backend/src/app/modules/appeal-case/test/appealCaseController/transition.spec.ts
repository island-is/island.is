import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import {
  addMessagesToQueue,
  MessageType,
} from '@island.is/judicial-system/message'
import {
  AppealCaseNotificationType,
  AppealCaseState,
  AppealCaseTransition,
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
  let mockEventService: EventService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    jest.clearAllMocks()

    const {
      appealCaseController,
      appealCaseRepositoryService,
      eventService,
      sequelize,
    } = await createTestingAppealCaseModule()

    mockAppealCaseRepositoryService = appealCaseRepositoryService
    mockEventService = eventService

    const mockNowFactory = nowFactory as jest.Mock
    mockNowFactory.mockReturnValue(now)

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementation(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    givenWhenThen = async (theCase, appealCase, transition) => {
      const then = {} as Then

      const dto: TransitionAppealCaseDto = { transition }

      const updatedAppealCase = { ...appealCase } as AppealCase
      const mockUpdate = mockAppealCaseRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updatedAppealCase)

      await appealCaseController
        .transition(caseId, appealCaseId, user, theCase, appealCase, dto)
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
})
