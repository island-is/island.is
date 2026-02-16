import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { Message, MessageType } from '@island.is/judicial-system/message'
import { Gender, User } from '@island.is/judicial-system/types'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import {
  Case,
  Defendant,
  DefendantRepositoryService,
} from '../../../repository'

interface Then {
  result: Defendant
  error: Error
}

type GivenWhenThen = (courtCaseNumber?: string) => Promise<Then>

describe('DefendantController - Create', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const theCase = { id: caseId } as Case
  const defendantToCreate = {
    nationalId: '0000000000',
    name: 'John Doe',
    gender: Gender.MALE,
    address: 'Somewhere',
  }
  const defendantId = uuid()
  const createdDefendant = { id: defendantId, caseId }

  let mockQueuedMessages: Message[]
  let mockDefendantRepositoryService: DefendantRepositoryService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      queuedMessages,
      sequelize,
      defendantRepositoryService,
      defendantController,
    } = await createTestingDefendantModule()

    mockQueuedMessages = queuedMessages
    mockDefendantRepositoryService = defendantRepositoryService

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    const mockCreate = mockDefendantRepositoryService.create as jest.Mock
    mockCreate.mockResolvedValue(createdDefendant)

    givenWhenThen = async (courtCaseNumber?: string) => {
      const then = {} as Then

      await defendantController
        .create(
          theCase.id,
          user,
          { ...theCase, courtCaseNumber } as Case,
          defendantToCreate,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('defendant created', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should create a defendant', () => {
      expect(mockDefendantRepositoryService.create).toHaveBeenCalledWith(
        { ...defendantToCreate, caseId },
        { transaction },
      )
    })

    it('should return defendant', () => {
      expect(then.result).toBe(createdDefendant)
    })

    it('should not queue any messages', () => {
      expect(mockQueuedMessages).toEqual([])
    })
  })

  describe('defendant created after case is delivered to court', () => {
    beforeEach(async () => {
      await givenWhenThen(uuid())
    })

    it('should queue messages', () => {
      expect(mockQueuedMessages).toEqual([
        {
          type: MessageType.DELIVERY_TO_COURT_DEFENDANT,
          user,
          caseId,
          elementId: defendantId,
        },
      ])
    })
  })

  describe('defendant creation fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockDefendantRepositoryService.create as jest.Mock
      mockCreate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen()
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
