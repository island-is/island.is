import { v4 as uuid } from 'uuid'

import { Message, MessageType } from '@island.is/judicial-system/message'
import {
  RequestCaseNotificationType,
  User,
} from '@island.is/judicial-system/types'

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
  const courtName = 'Héraðsdómur Reykjavíkur'
  const courtCaseNumber = uuid()
  const defenderEmail = uuid()
  const defenderName = 'Test Verjandi'
  const theCase = {
    id: caseId,
    courtId,
    court: { name: courtName },
    courtCaseNumber,
    defenderEmail,
    defenderName,
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
    const mockUpdateRequestCaseWithDefenderInfo =
      mockCourtService.updateRequestCaseWithDefenderInfo as jest.Mock
    mockUpdateRequestCaseWithDefenderInfo.mockResolvedValue(uuid())

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

    it('should deliver the defendant via API', () => {
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

    it('should send robot email with defender info', () => {
      expect(
        mockCourtService.updateRequestCaseWithDefenderInfo,
      ).toHaveBeenCalledWith(
        user,
        caseId,
        courtName,
        courtCaseNumber,
        defendantNationalId,
        defenderName,
        defenderEmail,
      )
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
          body: {
            type: RequestCaseNotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT,
          },
        },
      ])
    })

    it('should not send robot email', () => {
      expect(
        mockCourtService.updateRequestCaseWithDefenderInfo,
      ).not.toHaveBeenCalled()
    })
  })

  describe('API delivery fails', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(defendant)
    })

    it('should return a failure response', () => {
      expect(then.result).toEqual({ delivered: false })
    })

    it('should still send robot email', () => {
      expect(
        mockCourtService.updateRequestCaseWithDefenderInfo,
      ).toHaveBeenCalledWith(
        user,
        caseId,
        courtName,
        courtCaseNumber,
        defendantNationalId,
        defenderName,
        defenderEmail,
      )
    })
  })

  describe('robot email fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockUpdateCaseWithDefendant =
        mockCourtService.updateCaseWithDefendant as jest.Mock
      mockUpdateCaseWithDefendant.mockResolvedValueOnce(uuid())

      const mockUpdateRequestCaseWithDefenderInfo =
        mockCourtService.updateRequestCaseWithDefenderInfo as jest.Mock
      mockUpdateRequestCaseWithDefenderInfo.mockRejectedValueOnce(
        new Error('Robot email error'),
      )

      then = await givenWhenThen(defendant)
    })

    it('should still return success from API delivery', () => {
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
