import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { Message, MessageType } from '@island.is/judicial-system/message'
import {
  CaseType,
  Gender,
  RequestSharedWithDefender,
  User,
} from '@island.is/judicial-system/types'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import { runInRequestContext } from '../../../../test'
import {
  Case,
  Defendant,
  DefendantRepositoryService,
} from '../../../repository'

interface Then {
  result: Defendant
  error: Error
}

type GivenWhenThen = (caseOverride?: Partial<Case>) => Promise<Then>

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
      queuedMessagesAfterCommit,
      sequelize,
      defendantRepositoryService,
      defendantController,
    } = await createTestingDefendantModule()

    mockQueuedMessages = queuedMessagesAfterCommit
    mockDefendantRepositoryService = defendantRepositoryService

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    const mockCreate = mockDefendantRepositoryService.create as jest.Mock
    mockCreate.mockResolvedValue(createdDefendant)

    givenWhenThen = async (caseOverride?: Partial<Case>) => {
      const then = {} as Then

      // Guards do not execute in controller unit tests, so the request
      // context the handler takes its transaction from is set up here.
      try {
        await runInRequestContext(async () => {
          then.result = await defendantController.create(
            theCase.id,
            user,
            { ...theCase, ...caseOverride } as Case,
            defendantToCreate,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

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

  describe('defendant created on a request case with sharing timing', () => {
    beforeEach(async () => {
      await givenWhenThen({
        type: CaseType.CUSTODY,
        requestSharedWithDefender: RequestSharedWithDefender.COURT_DATE,
      })
    })

    it('should seed requestSharedWithDefender from the case', () => {
      expect(mockDefendantRepositoryService.create).toHaveBeenCalledWith(
        {
          ...defendantToCreate,
          caseId,
          requestSharedWithDefender: RequestSharedWithDefender.COURT_DATE,
        },
        { transaction },
      )
    })
  })

  describe('defendant created after case is delivered to court', () => {
    beforeEach(async () => {
      await givenWhenThen({ courtCaseNumber: uuid() })
    })

    it('should queue messages', () => {
      expect(mockQueuedMessages).toEqual([
        {
          type: MessageType.DELIVERY_TO_COURT_DEFENDANT,
          user,
          caseId,
          elementId: defendantId,
        },
        {
          type: MessageType.DELIVERY_TO_COURT_REQUEST_DEFENDANT,
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
