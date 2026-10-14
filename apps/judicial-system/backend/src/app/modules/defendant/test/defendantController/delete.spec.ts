import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { Message, MessageType } from '@island.is/judicial-system/message'
import {
  RequestCaseNotificationType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import { runInRequestContext } from '../../../../test'
import {
  Case,
  CaseFileRepositoryService,
  DefendantRepositoryService,
} from '../../../repository'
import { DeleteDefendantResponse } from '../../models/delete.response'

interface Then {
  result: DeleteDefendantResponse
  error: Error
}

type GivenWhenThen = (courtCaseNumber?: string) => Promise<Then>

describe('DefendantController - Delete', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const defendantId = uuid()

  let mockQueuedMessages: Message[]
  let mockDefendantRepositoryService: DefendantRepositoryService
  let mockCaseFileRepositoryService: CaseFileRepositoryService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      queuedMessagesAfterCommit,
      sequelize,
      defendantRepositoryService,
      caseFileRepositoryService,
      defendantController,
    } = await createTestingDefendantModule()

    mockQueuedMessages = queuedMessagesAfterCommit
    mockDefendantRepositoryService = defendantRepositoryService
    mockCaseFileRepositoryService = caseFileRepositoryService

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    const mockDelete = mockDefendantRepositoryService.delete as jest.Mock
    mockDelete.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (courtCaseNumber?: string) => {
      const then = {} as Then

      // Guards do not execute in controller unit tests, so the request
      // context the handler takes its transaction from is set up here.
      try {
        await runInRequestContext(async () => {
          then.result = await defendantController.delete(
            caseId,
            defendantId,
            user,
            { id: caseId, courtCaseNumber } as Case,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('defendant deleted', () => {
    let then: Then

    beforeEach(async () => {
      const mockDelete = mockDefendantRepositoryService.delete as jest.Mock
      mockDelete.mockResolvedValue(undefined)

      then = await givenWhenThen()
    })

    it("should delete the defendant's case files", () => {
      expect(
        mockCaseFileRepositoryService.deleteAllForDefendant,
      ).toHaveBeenCalledWith(caseId, defendantId, { transaction })
    })

    it('should delete the defendant without queuing', () => {
      expect(mockDefendantRepositoryService.delete).toHaveBeenCalledWith(
        caseId,
        defendantId,
        { transaction },
      )
      expect(then.result).toEqual({ deleted: true })
      expect(mockQueuedMessages).toEqual([])
    })

    it('should delete the case files before the defendant', () => {
      const mockDeleteFiles =
        mockCaseFileRepositoryService.deleteAllForDefendant as jest.Mock
      const mockDelete = mockDefendantRepositoryService.delete as jest.Mock

      expect(mockDeleteFiles.mock.invocationCallOrder[0]).toBeLessThan(
        mockDelete.mock.invocationCallOrder[0],
      )
    })
  })

  describe('case file deletion fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockDeleteFiles =
        mockCaseFileRepositoryService.deleteAllForDefendant as jest.Mock
      mockDeleteFiles.mockRejectedValue(new Error('Case file error'))

      then = await givenWhenThen()
    })

    it('should not delete the defendant', () => {
      expect(mockDefendantRepositoryService.delete).not.toHaveBeenCalled()
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Case file error')
      expect(mockQueuedMessages).toEqual([])
    })
  })

  describe('defendant removed after case is delivered to court', () => {
    beforeEach(async () => {
      const mockDelete = mockDefendantRepositoryService.delete as jest.Mock
      mockDelete.mockResolvedValue(undefined)

      await givenWhenThen(uuid())
    })

    it('should queue messages', () => {
      expect(mockQueuedMessages).toEqual([
        {
          type: MessageType.NOTIFICATION,
          user,
          caseId,
          body: {
            type: RequestCaseNotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT,
          },
        },
      ])
    })
  })

  describe('defendant deletion fails', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
