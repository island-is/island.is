import { uuid } from 'uuidv4'

import { CaseType, User } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { randomDate } from '../../../../test'
import { CourtService } from '../../../court'
import { Case } from '../../models/case.model'
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
    const mockUpdateAppealCaseWithAppealReceivedDate =
      mockCourtService.updateAppealCaseWithAppealReceivedDate as jest.Mock
    mockUpdateAppealCaseWithAppealReceivedDate.mockResolvedValue(uuid())

    givenWhenThen = async () => {
      const then = {} as Then

      await internalCaseController
        .deliverAppealReceivedDateToCourtOfAppeals(caseId, theCase, {
          user,
        })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('appeal received date delivered', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should return success', () => {
      expect(
        mockCourtService.updateAppealCaseWithAppealReceivedDate,
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
