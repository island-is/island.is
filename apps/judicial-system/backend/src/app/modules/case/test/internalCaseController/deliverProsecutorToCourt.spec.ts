import { v4 as uuid } from 'uuid'

import { User } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { CourtService } from '../../../court'
import { Case } from '../../../repository'
import { DeliverDto } from '../../dto/deliver.dto'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  body: DeliverDto,
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

  let mockCourtService: CourtService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { courtService, internalCaseController } =
      await createTestingCaseModule()

    mockCourtService = courtService
    const mockUpdateCaseWithProsecutor =
      mockCourtService.updateCaseWithProsecutor as jest.Mock
    mockUpdateCaseWithProsecutor.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (caseId: string, theCase: Case, body: DeliverDto) => {
      const then = {} as Then

      await internalCaseController
        .deliverProsecutorToCourt(caseId, theCase, body)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('prosecutor delivered', () => {
    let then: Then

    beforeEach(async () => {
      const mockUpdateCaseWithProsecutor =
        mockCourtService.updateCaseWithProsecutor as jest.Mock
      mockUpdateCaseWithProsecutor.mockResolvedValueOnce(uuid())

      then = await givenWhenThen(caseId, theCase, { user })
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
      then = await givenWhenThen(caseId, theCase, { user })
    })

    it('should return a failure response', () => {
      expect(then.result).toEqual({ delivered: false })
    })
  })
})
