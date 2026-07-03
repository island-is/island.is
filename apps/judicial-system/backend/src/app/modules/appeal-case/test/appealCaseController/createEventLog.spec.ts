import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import {
  addMessagesToQueue,
  MessageType,
} from '@island.is/judicial-system/message'
import {
  AppealCaseNotificationType,
  AppealEventType,
  CaseType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingAppealCaseModule } from '../createTestingAppealCaseModule'

import {
  AppealCase,
  AppealEventLogRepositoryService,
  Case,
} from '../../../repository'
import { CreateAppealEventLogDto } from '../../dto/createAppealEventLog.dto'

jest.mock('@island.is/judicial-system/message')

interface Then {
  result: AppealCase
  error: Error
}

type GivenWhenThen = (theCase: Case, user: User) => Promise<Then>

describe('AppealCaseController - Create event log', () => {
  const caseId = uuid()
  const appealCaseId = uuid()
  const defendantId = uuid()
  const defenderNationalId = '0101302129'

  const appealCase = { id: appealCaseId, caseId } as AppealCase

  const prosecutor = {
    id: uuid(),
    role: UserRole.PROSECUTOR,
    nationalId: '0000000000',
    institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
  } as User

  const defender = {
    id: uuid(),
    role: UserRole.DEFENDER,
    nationalId: defenderNationalId,
  } as User

  let mockAppealEventLogRepositoryService: AppealEventLogRepositoryService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    jest.clearAllMocks()

    const { appealCaseController, appealEventLogRepositoryService, sequelize } =
      await createTestingAppealCaseModule()

    mockAppealEventLogRepositoryService = appealEventLogRepositoryService

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementation(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    givenWhenThen = async (theCase, user) => {
      const then = {} as Then

      const dto: CreateAppealEventLogDto = {
        eventType: AppealEventType.APPEAL_STATEMENT_SENT,
      }

      await appealCaseController
        .createEventLog(caseId, appealCaseId, user, theCase, appealCase, dto)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('prosecution user sends an appeal statement', () => {
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase, prosecutor)
    })

    it('should record the appeal event log', () => {
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
        {
          caseId,
          appealCaseId,
          eventType: AppealEventType.APPEAL_STATEMENT_SENT,
          userRole: UserRole.PROSECUTOR,
          userId: prosecutor.id,
          nationalId: prosecutor.nationalId,
          userName: prosecutor.name,
          userTitle: prosecutor.title,
          institutionName: prosecutor.institution?.name,
        },
        { transaction },
      )
    })

    it('should queue the appeal statement notification', () => {
      expect(addMessagesToQueue).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.APPEAL_CASE_NOTIFICATION,
          caseId,
          body: { type: AppealCaseNotificationType.APPEAL_STATEMENT },
        }),
      )
    })

    it('should return the appeal case', () => {
      expect(then.result).toBe(appealCase)
    })
  })

  describe('confirmed defender sends an appeal statement on an indictment case', () => {
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      defendants: [
        {
          id: defendantId,
          isDefenderChoiceConfirmed: true,
          defenderNationalId,
        },
      ],
    } as unknown as Case

    beforeEach(async () => {
      await givenWhenThen(theCase, defender)
    })

    it('should tie the event log to the represented defendant', () => {
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
        {
          caseId,
          appealCaseId,
          eventType: AppealEventType.APPEAL_STATEMENT_SENT,
          userRole: UserRole.DEFENDER,
          defendantId,
          nationalId: defender.nationalId,
          userName: defender.name,
          userTitle: defender.title,
          institutionName: defender.institution?.name,
        },
        { transaction },
      )
    })
  })

  describe('unconfirmed defender sends an appeal statement on an indictment case', () => {
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      defendants: [
        {
          id: defendantId,
          isDefenderChoiceConfirmed: false,
          defenderNationalId,
        },
      ],
    } as unknown as Case

    beforeEach(async () => {
      await givenWhenThen(theCase, defender)
    })

    it('should not tie the event log to any defendant', () => {
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
        {
          caseId,
          appealCaseId,
          eventType: AppealEventType.APPEAL_STATEMENT_SENT,
          userRole: UserRole.DEFENDER,
          nationalId: defender.nationalId,
          userName: defender.name,
          userTitle: defender.title,
          institutionName: defender.institution?.name,
        },
        { transaction },
      )
    })
  })
})
