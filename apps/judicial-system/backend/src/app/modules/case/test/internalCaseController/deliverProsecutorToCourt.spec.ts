import { uuid } from 'uuidv4'

import { MessageService } from '@island.is/judicial-system/message'

import { User } from '../../../user'
import { CourtService } from '../../../court'
import { Case } from '../../../case'
import { DeliverProsecutorToCourtDto } from '../../dto/deliverProsecutorToCourt.dto'
import { DeliverResponse } from '../../models/deliver.response'
import { createTestingCaseModule } from '../createTestingCaseModule'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  body: DeliverProsecutorToCourtDto,
  user: User,
  theCase: Case,
) => Promise<Then>

describe('InternalCaseController - Deliver prosecutor to court', () => {
  const userId = uuid()
  const user = { id: userId } as User
  const prosecutorId = uuid()
  const prosecutorNationalId = uuid()
  const caseId = uuid()
  const courtId = uuid()
  const courtCaseNumber = uuid()
  const theCase = {
    id: caseId,
    courtId,
    courtCaseNumber,
    prosecutor: { id: prosecutorId, nationalId: prosecutorNationalId },
  } as Case

  let mockMessageService: MessageService
  let mockCourtService: CourtService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      messageService,
      courtService,
      internalCaseController,
    } = await createTestingCaseModule()

    mockMessageService = messageService
    mockCourtService = courtService
    const mockUpdateCaseWithProsecutor = mockCourtService.updateCaseWithProsecutor as jest.Mock
    mockUpdateCaseWithProsecutor.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (
      caseId: string,
      body: DeliverProsecutorToCourtDto,
      user: User,
      theCase: Case,
    ) => {
      const then = {} as Then

      await internalCaseController
        .deliverProsecutorToCourt(caseId, body, user, theCase)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('prosecutor delivered', () => {
    let then: Then

    beforeEach(async () => {
      const mockUpdateCaseWithProsecutor = mockCourtService.updateCaseWithProsecutor as jest.Mock
      mockUpdateCaseWithProsecutor.mockResolvedValueOnce(uuid())

      then = await givenWhenThen(caseId, { userId }, user, theCase)
    })

    it('should deliver the defendant', () => {
      expect(mockCourtService.updateCaseWithProsecutor).toHaveBeenCalledWith(
        user,
        caseId,
        courtId,
        courtCaseNumber,
        prosecutorNationalId,
        '',
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('delivery fails', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, { userId }, user, theCase)
    })

    it('should return a failure response', () => {
      expect(then.result).toEqual({ delivered: false })
    })
  })
})
