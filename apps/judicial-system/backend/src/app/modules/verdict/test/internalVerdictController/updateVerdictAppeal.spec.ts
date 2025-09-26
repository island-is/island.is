import { uuid } from 'uuidv4'

import {
  CaseIndictmentRulingDecision,
  ServiceRequirement,
  VerdictAppealDecision,
  VerdictServiceStatus,
} from '@island.is/judicial-system/types'

import { createTestingVerdictModule } from '../createTestingVerdictModule'

import { Case, Defendant, Verdict } from '../../../repository'
import { InternalUpdateVerdictDto } from '../../dto/internalUpdateVerdict.dto'

interface Then {
  result: Verdict
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalVerdictController - Update verdict appeal', () => {
  const caseId = uuid()
  const defendantNationalId = '0000000000'
  const verdictId = uuid()

  const verdict = {
    id: verdictId,
    serviceRequirement: ServiceRequirement.REQUIRED,
    serviceDate: new Date(2025, 2, 2),
    serviceStatus: VerdictServiceStatus.ELECTRONICALLY,
  } as Verdict

  const defendant = { nationalId: defendantNationalId, verdict } as Defendant

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
  let mockVerdictModel: typeof Verdict

  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { internalVerdictController, verdictModel } =
      await createTestingVerdictModule()

    mockVerdictModel = verdictModel

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

      const mockFind = mockVerdictModel.findOne as jest.Mock
      mockFind.mockResolvedValueOnce([1, [verdict]])

      const mockUpdate = mockVerdictModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1, [updatedVerdict]])

      then = await givenWhenThen()
    })

    it('should update the verdict', () => {
      expect(mockVerdictModel.update).toHaveBeenCalledWith(dto, {
        where: { id: verdictId },
        returning: true,
      })
      expect(then.result).toBe(updatedVerdict)
    })
  })
})
