import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { ForbiddenException } from '@nestjs/common'

import { capitalize, formatDate } from '@island.is/judicial-system/formatters'
import {
  addMessagesToQueue,
  MessageType,
} from '@island.is/judicial-system/message'
import {
  CaseType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingAppealCaseModule } from '../createTestingAppealCaseModule'

import { nowFactory } from '../../../../factories'
import {
  AppealCase,
  AppealCaseRepositoryService,
  Case,
} from '../../../repository'
import { UserService } from '../../../user'
import { UpdateAppealCaseDto } from '../../dto/updateAppealCase.dto'

jest.mock('@island.is/judicial-system/message')
jest.mock('../../../../factories')

interface Then {
  result: AppealCase
  error: Error
}

type GivenWhenThen = (
  theCase: Case,
  appealCase: AppealCase,
  update: UpdateAppealCaseDto,
) => Promise<Then>

describe('AppealCaseController - Update', () => {
  const caseId = uuid()
  const appealCaseId = uuid()

  const user = {
    id: uuid(),
    role: UserRole.COURT_OF_APPEALS_JUDGE,
    name: 'Anna Logmann',
    title: 'dómari',
    institution: { type: InstitutionType.COURT_OF_APPEALS },
  } as User

  const now = new Date('2024-01-15T10:00:00Z')

  let mockAppealCaseRepositoryService: AppealCaseRepositoryService
  let mockUserService: UserService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    jest.clearAllMocks()

    const {
      appealCaseController,
      appealCaseRepositoryService,
      userService,
      sequelize,
    } = await createTestingAppealCaseModule()

    mockAppealCaseRepositoryService = appealCaseRepositoryService
    mockUserService = userService

    const mockNowFactory = nowFactory as jest.Mock
    mockNowFactory.mockReturnValue(now)

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementation(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    givenWhenThen = async (theCase, appealCase, update) => {
      const then = {} as Then

      const updatedAppealCase = { ...appealCase, ...update } as AppealCase
      const mockUpdate = mockAppealCaseRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updatedAppealCase)

      await appealCaseController
        .update(caseId, appealCaseId, user, theCase, appealCase, update)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('plain update', () => {
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const appealCase = { id: appealCaseId, caseId } as AppealCase
    const update = { appealConclusion: 'Conclusion' }
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase, appealCase, update)
    })

    it('should update the appeal case', () => {
      expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
        appealCaseId,
        { appealConclusion: 'Conclusion' },
        { transaction },
      )
      expect(then.result).toEqual({ ...appealCase, ...update })
    })
  })

  describe('appeal ruling modified history', () => {
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const appealCase = { id: appealCaseId, caseId } as AppealCase
    const update = { appealRulingModifiedHistory: 'Fixed a typo' }

    beforeEach(async () => {
      await givenWhenThen(theCase, appealCase, update)
    })

    it('should prepend the author and timestamp to the history entry', () => {
      expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
        appealCaseId,
        {
          appealRulingModifiedHistory: `${capitalize(
            formatDate(now, 'PPPPp'),
          )} - ${user.name} ${user.title}\n\nFixed a typo`,
        },
        { transaction },
      )
    })
  })

  describe('a new appeal case number is assigned', () => {
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      caseFiles: [],
    } as unknown as Case
    const appealCase = { id: appealCaseId, caseId } as AppealCase
    const update = { appealCaseNumber: 'LANDSRÉTTUR 1/2024' }

    beforeEach(async () => {
      await givenWhenThen(theCase, appealCase, update)
    })

    it('should queue delivery of the received date to the court of appeals', () => {
      expect(addMessagesToQueue).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_RECEIVED_DATE,
          caseId,
        }),
      )
    })
  })

  describe('an assistant is assigned with the wrong role', () => {
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const appealCase = { id: appealCaseId, caseId } as AppealCase
    const assistantId = uuid()
    const update = { appealAssistantId: assistantId }
    let then: Then

    beforeEach(async () => {
      const mockFindById = mockUserService.findById as jest.Mock
      mockFindById.mockResolvedValueOnce({
        id: assistantId,
        role: UserRole.COURT_OF_APPEALS_JUDGE,
      })

      then = await givenWhenThen(theCase, appealCase, update)
    })

    it('should throw ForbiddenException and not update the appeal case', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalled()
    })
  })
})
