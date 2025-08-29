import { uuid } from 'uuidv4'

import { CaseDecision, CaseType, User } from '@island.is/judicial-system/types'

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

describe('InternalCaseController - Deliver case conclusion to court', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const courtName = uuid()
  const courtCaseNumber = uuid()
  const decision = CaseDecision.ACCEPTING
  const rulingDate = randomDate()
  const validToDate = randomDate()
  const isolationToDate = randomDate()

  const theCase = {
    id: caseId,
    type: CaseType.CUSTODY,
    court: { name: courtName },
    courtCaseNumber,
    decision,
    rulingDate,
    validToDate,
    isCustodyIsolation: true,
    isolationToDate,
  } as Case

  let mockCourtService: CourtService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { courtService, internalCaseController } =
      await createTestingCaseModule()

    mockCourtService = courtService
    const mockUpdateCaseWithConclusion =
      mockCourtService.updateCaseWithConclusion as jest.Mock
    mockUpdateCaseWithConclusion.mockResolvedValue(uuid())

    givenWhenThen = async () => {
      const then = {} as Then

      await internalCaseController
        .deliverCaseConclusionToCourt(caseId, theCase, {
          user,
        })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('case conclusion delivered', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should return success', () => {
      expect(mockCourtService.updateCaseWithConclusion).toHaveBeenCalledWith(
        user,
        caseId,
        courtName,
        courtCaseNumber,
        false,
        decision,
        rulingDate,
        validToDate,
        isolationToDate,
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
