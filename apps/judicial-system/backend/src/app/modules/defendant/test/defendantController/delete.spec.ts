import { v4 as uuid } from 'uuid'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import { CaseNotificationType, User } from '@island.is/judicial-system/types'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import { Case, DefendantRepositoryService } from '../../../repository'
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

  let mockMessageService: MessageService
  let mockDefendantRepositoryService: DefendantRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { messageService, defendantRepositoryService, defendantController } =
      await createTestingDefendantModule()

    mockMessageService = messageService
    mockDefendantRepositoryService = defendantRepositoryService

    const mockDelete = mockDefendantRepositoryService.delete as jest.Mock
    mockDelete.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (courtCaseNumber?: string) => {
      const then = {} as Then

      try {
        then.result = await defendantController.delete(
          caseId,
          defendantId,
          user,
          { id: caseId, courtCaseNumber } as Case,
        )
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

    it('should delete the defendant without queuing', () => {
      expect(mockDefendantRepositoryService.delete).toHaveBeenCalledWith(
        caseId,
        defendantId,
      )
      expect(then.result).toEqual({ deleted: true })
      expect(mockMessageService.sendMessagesToQueue).not.toHaveBeenCalled()
    })
  })

  describe('defendant removed after case is delivered to court', () => {
    beforeEach(async () => {
      const mockDelete = mockDefendantRepositoryService.delete as jest.Mock
      mockDelete.mockResolvedValue(undefined)

      await givenWhenThen(uuid())
    })

    it('should queue messages', () => {
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
        {
          type: MessageType.NOTIFICATION,
          user,
          caseId,
          body: { type: CaseNotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT },
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
