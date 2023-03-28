import { uuid } from 'uuidv4'

import { User } from '@island.is/judicial-system/types'
import { MessageService, MessageType } from '@island.is/judicial-system/message'

import { Case } from '../../../case'
import { Defendant } from '../../models/defendant.model'
import { createTestingDefendantModule } from '../createTestingDefendantModule'

interface Then {
  result: Defendant
  error: Error
}

type GivenWhenThen = (theCase: Case, defendant: Defendant) => Promise<Then>

describe('DefendantController - Update', () => {
  const userId = uuid()
  const caseId = uuid()
  const theCase = { id: caseId } as Case
  const defendantId = uuid()
  const nationalId = uuid()
  const defendant = { id: defendantId, caseId, nationalId } as Defendant
  const defendantToUpdate = { name: 'John Doe' }
  const updatedDefendant = { id: defendantId, caseId, nationalId }

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

    const mockUpdate = mockDefendantModel.update as jest.Mock
    mockUpdate.mockResolvedValue([1, [updatedDefendant]])

    givenWhenThen = async (theCase: Case, defendant: Defendant) => {
      const then = {} as Then

      await defendantController
        .update(
          theCase.id,
          defendant.id,
          { id: userId } as User,
          theCase,
          defendant,
          defendantToUpdate,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('defendant updated', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase, defendant)
    })

    it('should update the defendant', () => {
      expect(mockDefendantModel.update).toHaveBeenCalledWith(
        defendantToUpdate,
        {
          where: { id: defendantId, caseId },
          returning: true,
        },
      )
    })

    it('should return defendant', () => {
      expect(then.result).toBe(updatedDefendant)
    })

    it('should not queue any messages', () => {
      expect(mockMessageService.sendMessagesToQueue).not.toHaveBeenCalled()
    })
  })

  describe('defendant changed after case is delivered to court', () => {
    beforeEach(async () => {
      await givenWhenThen(
        { ...theCase, courtCaseNumber: uuid() } as Case,
        { ...defendant, nationalId: uuid() } as Defendant,
      )
    })

    it('should queue messages', () => {
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
        {
          type: MessageType.SEND_DEFENDANTS_NOT_UPDATED_AT_COURT_NOTIFICATION,
          caseId,
          userId,
        },
        {
          type: MessageType.DELIVER_DEFENDANT_TO_COURT,
          caseId,
          defendantId,
          userId,
        },
      ])
    })
  })

  describe('defendant update fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockDefendantModel.update as jest.Mock
      mockUpdate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(theCase, defendant)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
