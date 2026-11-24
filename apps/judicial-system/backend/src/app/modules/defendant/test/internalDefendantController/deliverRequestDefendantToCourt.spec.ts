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

describe('InternalDefendantController - Deliver request defendant to court', () => {
  const userId = uuid()
  const user = { id: userId } as User
  const deliverDto = { user }
  const defendantId = uuid()
  const defendantNationalId = '1234567890'
  const defenderEmail = uuid()
  const defenderName = 'Test Verjandi'
  const defendant = {
    id: defendantId,
    nationalId: defendantNationalId,
    defenderEmail,
    defenderName,
  } as Defendant
  const caseId = uuid()
  const courtName = 'Héraðsdómur Reykjavíkur'
  const courtCaseNumber = uuid()
  const theCase = {
    id: caseId,
    court: { name: courtName },
    courtCaseNumber,
  } as Case

  let mockQueuedMessages: Message[]
  let mockCourtService: CourtService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      queuedMessagesAfterCommit,
      courtService,
      internalDefendantController,
    } = await createTestingDefendantModule()

    mockQueuedMessages = queuedMessagesAfterCommit

    mockCourtService = courtService
    const mockUpdateRequestCaseWithDefendant =
      mockCourtService.updateRequestCaseWithDefendant as jest.Mock
    mockUpdateRequestCaseWithDefendant.mockRejectedValue(
      new Error('Robot email error'),
    )

    givenWhenThen = async (defendant: Defendant) => {
      const then = {} as Then

      await internalDefendantController
        .deliverRequestDefendantToCourt(
          caseId,
          defendantId,
          theCase,
          defendant,
          deliverDto,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('defendant delivered', () => {
    let then: Then

    beforeEach(async () => {
      const mockUpdateRequestCaseWithDefendant =
        mockCourtService.updateRequestCaseWithDefendant as jest.Mock
      mockUpdateRequestCaseWithDefendant.mockResolvedValueOnce(uuid())

      then = await givenWhenThen(defendant)
    })

    it('should send robot email with the defendant and defender info', () => {
      expect(
        mockCourtService.updateRequestCaseWithDefendant,
      ).toHaveBeenCalledWith(
        user,
        caseId,
        courtName,
        courtCaseNumber,
        defendantNationalId,
        defenderName,
        defenderEmail,
      )
      expect(then.result).toEqual({ delivered: true })
    })

    it('should not queue notification', () => {
      expect(mockQueuedMessages).toEqual([])
    })
  })

  describe.each([
    {
      label: 'no national id flag',
      defendant: { noNationalId: true, nationalId: defendantNationalId },
    },
    {
      label: 'temporary national id',
      defendant: { nationalId: '1234567895' },
    },
    {
      label: 'invalid length',
      defendant: { nationalId: '123' },
    },
    {
      label: 'missing national id',
      defendant: { nationalId: undefined },
    },
  ])('invalid national id - $label', ({ defendant: defendantOverride }) => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        ...defendant,
        ...defendantOverride,
      } as Defendant)
    })

    it('should not send robot email', () => {
      expect(
        mockCourtService.updateRequestCaseWithDefendant,
      ).not.toHaveBeenCalled()
    })

    it('should return success', () => {
      expect(then.result).toEqual({ delivered: true })
    })

    it('should ask the court to verify the defendants', () => {
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

  describe('robot email fails', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(defendant)
    })

    it('should return a failure response', () => {
      expect(then.result).toEqual({ delivered: false })
    })

    it('should not queue notification', () => {
      expect(mockQueuedMessages).toEqual([])
    })
  })
})
