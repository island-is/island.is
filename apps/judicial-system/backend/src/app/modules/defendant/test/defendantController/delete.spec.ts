import { uuid } from 'uuidv4'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import { User } from '@island.is/judicial-system/types'

import { Case } from '../../../case'
import { Defendant } from '../../models/defendant.model'
import { DeleteDefendantResponse } from '../../models/delete.response'
import { createTestingDefendantModule } from '../createTestingDefendantModule'

interface Then {
  result: DeleteDefendantResponse
  error: Error
}

type GivenWhenThen = (theCase: Case) => Promise<Then>

describe('DefendantController - Delete', () => {
  const userId = uuid()
  const caseId = uuid()
  const theCase = { id: caseId } as Case
  const defendantId = uuid()

  let mockMessageService: MessageService
  let mockDefendantModel: typeof Defendant
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      messageService,
      defendantModel,
      defendantController,
    } = await createTestingDefendantModule()

    mockMessageService = messageService
    mockDefendantModel = defendantModel

    const mockDestroy = mockDefendantModel.destroy as jest.Mock
    mockDestroy.mockResolvedValue(1)

    givenWhenThen = async (theCase: Case) => {
      const then = {} as Then

      try {
        then.result = await defendantController.delete(
          caseId,
          defendantId,
          { id: userId } as User,
          theCase,
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
      then = await givenWhenThen(theCase)
    })

    it('should delete the defendant', () => {
      expect(mockDefendantModel.destroy).toHaveBeenCalledWith({
        where: { id: defendantId, caseId },
      })
    })

    it('should return number of deleted defendants', () => {
      expect(then.result).toEqual({ deleted: true })
    })

    it('should not queue any messages', () => {
      expect(mockMessageService.sendMessagesToQueue).not.toHaveBeenCalled()
    })
  })

  describe('defendant removed after case is delivered to court', () => {
    beforeEach(async () => {
      await givenWhenThen({ ...theCase, courtCaseNumber: uuid() } as Case)
    })

    it('should queue messages', () => {
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
        {
          type: MessageType.SEND_DEFENDANTS_NOT_UPDATED_AT_COURT_NOTIFICATION,
          caseId,
          userId,
        },
      ])
    })
  })

  describe('defendant deletion fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockDestroy = mockDefendantModel.destroy as jest.Mock
      mockDestroy.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(theCase)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
