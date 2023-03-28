import { uuid } from 'uuidv4'

import { Gender, User } from '@island.is/judicial-system/types'
import { MessageService, MessageType } from '@island.is/judicial-system/message'

import { Case } from '../../../case'
import { Defendant } from '../../models/defendant.model'
import { createTestingDefendantModule } from '../createTestingDefendantModule'

interface Then {
  result: Defendant
  error: Error
}

type GivenWhenThen = (theCase: Case) => Promise<Then>

describe('DefendantController - Create', () => {
  const userId = uuid()
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

    const mockCreate = mockDefendantModel.create as jest.Mock
    mockCreate.mockResolvedValue(createdDefendant)

    givenWhenThen = async (theCase: Case) => {
      const then = {} as Then

      await defendantController
        .create(theCase.id, { id: userId } as User, theCase, defendantToCreate)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('defendant created', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase)
    })

    it('should create a defendant', () => {
      expect(mockDefendantModel.create).toHaveBeenCalledWith({
        ...defendantToCreate,
        caseId,
      })
    })

    it('should return defendant', () => {
      expect(then.result).toBe(createdDefendant)
    })

    it('should not queue any messages', () => {
      expect(mockMessageService.sendMessagesToQueue).not.toHaveBeenCalled()
    })
  })

  describe('defendant created after case is delivered to court', () => {
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
        {
          type: MessageType.DELIVER_DEFENDANT_TO_COURT,
          caseId,
          defendantId,
          userId,
        },
      ])
    })
  })

  describe('defendant creation fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockDefendantModel.create as jest.Mock
      mockCreate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(theCase)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
