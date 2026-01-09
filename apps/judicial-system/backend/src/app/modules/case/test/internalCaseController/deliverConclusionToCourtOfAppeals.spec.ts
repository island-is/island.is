import { v4 as uuid } from 'uuid'

import {
  CaseType,
  NotificationType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { randomDate } from '../../../../test'
import { CourtService } from '../../../court'
import { Case } from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalCaseController - Deliver conclusion to court of appeals', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const appealCaseNumber = uuid()
  const appealRulingDecision = uuid()
  const appealRulingDate = randomDate()

  const theCase = {
    id: caseId,
    type: CaseType.CUSTODY,
    appealCaseNumber,
    appealRulingDecision,
    notifications: [
      {
        type: NotificationType.APPEAL_COMPLETED,
        created: appealRulingDate,
      },
    ],
  } as Case

  let mockCourtService: CourtService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { courtService, internalCaseController } =
      await createTestingCaseModule()

    mockCourtService = courtService
    const mockUpdateAppealCaseWithConclusion =
      mockCourtService.updateAppealCaseWithConclusion as jest.Mock
    mockUpdateAppealCaseWithConclusion.mockResolvedValue(uuid())

    givenWhenThen = async () => {
      const then = {} as Then

      await internalCaseController
        .deliverConclusionToCourtOfAppeals(caseId, theCase, {
          user,
        })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('conclusion delivered', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should return success', () => {
      expect(
        mockCourtService.updateAppealCaseWithConclusion,
      ).toHaveBeenCalledWith(
        user,
        caseId,
        appealCaseNumber,
        false,
        appealRulingDecision,
        appealRulingDate,
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
