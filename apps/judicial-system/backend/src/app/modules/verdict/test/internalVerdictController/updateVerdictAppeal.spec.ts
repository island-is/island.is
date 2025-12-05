import { uuid } from 'uuidv4'

import {
  CaseIndictmentRulingDecision,
  ServiceRequirement,
  VerdictAppealDecision,
  VerdictServiceStatus,
} from '@island.is/judicial-system/types'

import { createTestingVerdictModule } from '../createTestingVerdictModule'

import {
  Case,
  Defendant,
  Verdict,
  VerdictRepositoryService,
} from '../../../repository'
import { InternalUpdateVerdictDto } from '../../dto/internalUpdateVerdict.dto'

interface Then {
  result: Verdict
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalVerdictController - Update verdict appeal', () => {
  const caseId = uuid()
  const defendantId = uuid()
  const defendantNationalId = '0000000000'
  const verdictId = uuid()

  const verdict = {
    id: verdictId,
    caseId,
    defendantId,
    serviceRequirement: ServiceRequirement.REQUIRED,
    serviceDate: new Date(2025, 2, 2),
    serviceStatus: VerdictServiceStatus.ELECTRONICALLY,
  } as Verdict

  const defendant = {
    id: defendantId,
    nationalId: defendantNationalId,
    verdict,
  } as Defendant

  const theCase = {
    id: caseId,
    defendants: [defendant],
    indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
    rulingDate: new Date(2025, 1, 1),
  } as Case

  const dto = {
    appealDecision: VerdictAppealDecision.ACCEPT,
  } as InternalUpdateVerdictDto

  const now = new Date(2025, 2, 10)
  let mockVerdictRepositoryService: VerdictRepositoryService

  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { internalVerdictController, verdictRepositoryService } =
      await createTestingVerdictModule()

    mockVerdictRepositoryService = verdictRepositoryService

    givenWhenThen = async (): Promise<Then> => {
      const then = {} as Then

      await internalVerdictController
        .updateVerdictAppeal(
          caseId,
          defendantNationalId,
          theCase,
          defendant,
          verdict,
          dto,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('verdict updated', () => {
    const updatedVerdict = { ...verdict, ...dto }

    let then: Then

    beforeEach(async () => {
      jest.spyOn(Date, 'now').mockImplementation(() => now.getTime())

      const mockUpdate = mockVerdictRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updatedVerdict)

      then = await givenWhenThen()
    })

    it('should update the verdict', () => {
      expect(mockVerdictRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        defendantId,
        verdictId,
        dto,
        { transaction: undefined },
      )
      expect(then.result).toBe(updatedVerdict)
    })
  })
})
