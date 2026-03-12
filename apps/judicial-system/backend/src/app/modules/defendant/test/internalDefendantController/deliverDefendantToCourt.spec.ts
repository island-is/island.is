import { v4 as uuid } from 'uuid'

import { Message, MessageType } from '@island.is/judicial-system/message'
import { CaseNotificationType, User } from '@island.is/judicial-system/types'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import { CourtService } from '../../../court'
import { Case, Defendant } from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (defendant: Defendant) => Promise<Then>

describe('InternalDefendantController - Deliver defendant to court', () => {
  const userId = uuid()
  const user = { id: userId } as User
  const deliverDefendantToCourtDto = { user }
  const defendantId = uuid()
  const defendantNationalId = '1234567890'
  const defendant = {
    id: defendantId,
    nationalId: defendantNationalId,
  } as Defendant
  const caseId = uuid()
  const courtId = uuid()
  const courtCaseNumber = uuid()
  const defenderEmail = uuid()
  const theCase = {
    id: caseId,
    courtId,
    courtCaseNumber,
    defenderEmail,
  } as Case

  let mockQueuedMessages: Message[]
  let mockCourtService: CourtService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { queuedMessages, courtService, internalDefendantController } =
      await createTestingDefendantModule()

    mockQueuedMessages = queuedMessages
    mockCourtService = courtService
    const mockUpdateCaseWithDefendant =
      mockCourtService.updateCaseWithDefendant as jest.Mock
    mockUpdateCaseWithDefendant.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (defendant: Defendant) => {
      const then = {} as Then

      await internalDefendantController
        .deliverDefendantToCourt(
          caseId,
          defendantId,
          theCase,
          defendant,
          deliverDefendantToCourtDto,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('defendant delivered', () => {
    let then: Then

    beforeEach(async () => {
      const mockUpdateCaseWithDefendant =
        mockCourtService.updateCaseWithDefendant as jest.Mock
      mockUpdateCaseWithDefendant.mockResolvedValueOnce(uuid())

      then = await givenWhenThen(defendant)
    })

    it('should deliver the defendant', () => {
      expect(mockCourtService.updateCaseWithDefendant).toHaveBeenCalledWith(
        user,
        caseId,
        courtId,
        courtCaseNumber,
        defendantNationalId,
        defenderEmail,
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('no national id', () => {
    beforeEach(async () => {
      await givenWhenThen({
        ...defendant,
        noNationalId: true,
      } as Defendant)
    })

    it('should send email to court', () => {
      expect(mockQueuedMessages).toEqual([
        {
          type: MessageType.NOTIFICATION,
          user,
          caseId,
          body: { type: CaseNotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT },
        },
      ])
    })
  })

  describe('delivery fails', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(defendant)
    })

    it('should return a failure response', () => {
      expect(then.result).toEqual({ delivered: false })
    })
  })
})
