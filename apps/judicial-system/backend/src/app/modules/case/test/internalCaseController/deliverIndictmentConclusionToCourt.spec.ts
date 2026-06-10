import { v4 as uuid } from 'uuid'

import {
  CaseIndictmentRulingDecision,
  CaseType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { randomDate } from '../../../../test'
import { CourtService } from '../../../court'
import { buildIndictmentConclusionContent } from '../../../court/court.service'
import { Case } from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalCaseController - Deliver indictment conclusion to court', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const courtName = 'Héraðsdómur Reykjavíkur'
  const courtCaseNumber = 'S-1/2026'
  const rulingDate = randomDate()

  const theCase = {
    id: caseId,
    type: CaseType.INDICTMENT,
    court: { name: courtName },
    courtCaseNumber,
    indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
    rulingDate,
    rulingModifiedHistory: null,
  } as Case

  let mockCourtService: CourtService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { courtService, internalCaseController } =
      await createTestingCaseModule()

    mockCourtService = courtService
    const mockUpdateIndictmentCaseWithConclusion =
      mockCourtService.updateIndictmentCaseWithConclusion as jest.Mock
    mockUpdateIndictmentCaseWithConclusion.mockResolvedValue(uuid())

    givenWhenThen = async () => {
      const then = {} as Then

      await internalCaseController
        .deliverIndictmentConclusionToCourt(caseId, theCase, {
          user,
        })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('case-level RULING conclusion delivered', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should deliver the indictment conclusion', () => {
      expect(
        mockCourtService.updateIndictmentCaseWithConclusion,
      ).toHaveBeenCalledWith(
        user,
        caseId,
        courtName,
        courtCaseNumber,
        buildIndictmentConclusionContent({
          courtCaseNumber,
          isCorrection: false,
          indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
          rulingDate,
        }),
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })
})
