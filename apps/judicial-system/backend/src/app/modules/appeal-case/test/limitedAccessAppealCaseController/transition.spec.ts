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

describe('LimitedAccessAppealCaseController - Transition', () => {
  const caseId = uuid()
  const appealCaseId = uuid()

  const defender = {
    id: uuid(),
    role: UserRole.DEFENDER,
    nationalId: '1111111111',
  } as User

  const now = new Date('2024-01-15T10:00:00Z')

  let mockAppealCaseRepositoryService: AppealCaseRepositoryService
  let mockEventService: EventService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    jest.clearAllMocks()

    const {
      limitedAccessAppealCaseController,
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

      await limitedAccessAppealCaseController
        .transition(caseId, appealCaseId, defender, theCase, appealCase, dto)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('defence user withdraws an appeal', () => {
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const appealCase = {
      id: appealCaseId,
      appealState: AppealCaseState.APPEALED,
    } as AppealCase
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
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
      expect(then.result).toEqual(
        expect.objectContaining({ appealState: AppealCaseState.APPEALED }),
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

    it('should post the transition event', () => {
      expect(mockEventService.postEvent).toHaveBeenCalledWith(
        AppealCaseTransition.WITHDRAW_APPEAL,
        theCase,
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
        AppealCaseTransition.WITHDRAW_APPEAL,
      )
    })

    it('should still transition the appeal case', () => {
      expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
        appealCaseId,
        expect.objectContaining({ appealState: AppealCaseState.WITHDRAWN }),
        { transaction },
      )
    })

    it('should queue the withdrawn notification for the ruling-order appeal', () => {
      expect(addMessagesToQueue).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.APPEAL_CASE_NOTIFICATION,
          caseId,
          elementId: appealCaseId,
          body: { type: AppealCaseNotificationType.APPEAL_WITHDRAWN },
        }),
      )
    })
  })
})
