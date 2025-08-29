import { uuid } from 'uuidv4'

import { CaseType, User } from '@island.is/judicial-system/types'

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

describe('InternalCaseController - Deliver received date to court of appeals', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const appealCaseNumber = uuid()
  const appealReceivedByCourtDate = randomDate()

  const theCase = {
    id: caseId,
    type: CaseType.CUSTODY,
    appealCaseNumber,
    appealReceivedByCourtDate,
  } as Case

  let mockCourtService: CourtService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { courtService, internalCaseController } =
      await createTestingCaseModule()

    mockCourtService = courtService
    const mockUpdateAppealCaseWithReceivedDate =
      mockCourtService.updateAppealCaseWithReceivedDate as jest.Mock
    mockUpdateAppealCaseWithReceivedDate.mockResolvedValue(uuid())

    givenWhenThen = async () => {
      const then = {} as Then

      await internalCaseController
        .deliverReceivedDateToCourtOfAppeals(caseId, theCase, {
          user,
        })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('received date delivered', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should return success', () => {
      expect(
        mockCourtService.updateAppealCaseWithReceivedDate,
      ).toHaveBeenCalledWith(
        user,
        caseId,
        appealCaseNumber,
        appealReceivedByCourtDate,
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
