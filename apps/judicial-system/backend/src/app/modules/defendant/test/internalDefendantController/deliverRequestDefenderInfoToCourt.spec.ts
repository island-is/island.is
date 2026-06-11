import { v4 as uuid } from 'uuid'

import { Message } from '@island.is/judicial-system/message'
import { User } from '@island.is/judicial-system/types'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import { CourtService } from '../../../court'
import { Case, Defendant } from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (defendant: Defendant) => Promise<Then>

describe('InternalDefendantController - Deliver request defender info to court', () => {
  const userId = uuid()
  const user = { id: userId } as User
  const deliverDto = { user }
  const defendantId = uuid()
  const defendantNationalId = '1234567890'
  const defendant = {
    id: defendantId,
    nationalId: defendantNationalId,
  } as Defendant
  const caseId = uuid()
  const courtName = 'Héraðsdómur Reykjavíkur'
  const courtCaseNumber = uuid()
  const defenderEmail = uuid()
  const defenderName = 'Test Verjandi'
  const theCase = {
    id: caseId,
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
    const mockUpdateRequestCaseWithDefenderInfo =
      mockCourtService.updateRequestCaseWithDefenderInfo as jest.Mock
    mockUpdateRequestCaseWithDefenderInfo.mockRejectedValue(
      new Error('Robot email error'),
    )

    givenWhenThen = async (defendant: Defendant) => {
      const then = {} as Then

      await internalDefendantController
        .deliverRequestDefenderInfoToCourt(
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

  describe('defender info delivered', () => {
    let then: Then

    beforeEach(async () => {
      const mockUpdateRequestCaseWithDefenderInfo =
        mockCourtService.updateRequestCaseWithDefenderInfo as jest.Mock
      mockUpdateRequestCaseWithDefenderInfo.mockResolvedValueOnce(uuid())

      then = await givenWhenThen(defendant)
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
      expect(then.result).toEqual({ delivered: true })
    })

    it('should not call court API', () => {
      expect(mockCourtService.updateCaseWithDefendant).not.toHaveBeenCalled()
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
        mockCourtService.updateRequestCaseWithDefenderInfo,
      ).not.toHaveBeenCalled()
    })

    it('should return success', () => {
      expect(then.result).toEqual({ delivered: true })
    })

    it('should not queue notification', () => {
      expect(mockQueuedMessages).toEqual([])
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
  })
})
