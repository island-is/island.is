import { uuid } from 'uuidv4'

import { InformationForDefendant } from '@island.is/judicial-system/types'

import { createTestingVerdictModule } from '../createTestingVerdictModule'

import { Verdict } from '../../../repository'
import { VerdictService } from '../../verdict.service'

interface Then {
  result: Pick<Verdict, 'serviceInformationForDefendant'>
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalVerdictController - Get verdict supplements', () => {
  const verdictId = uuid()
  const externalPoliceDocumentId = uuid()

  const verdict = {
    id: verdictId,
    externalPoliceDocumentId,
    serviceInformationForDefendant: [
      InformationForDefendant.INSTRUCTIONS_ON_REOPENING_OUT_OF_COURT_CASES,
    ],
  } as Verdict

  let mockVerdictService: VerdictService

  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { internalVerdictController, verdictService } =
      await createTestingVerdictModule()

    mockVerdictService = verdictService

    mockVerdictService.findByExternalPoliceDocumentId = jest.fn()
    const mockFindByExternalPoliceDocumentId =
      mockVerdictService.findByExternalPoliceDocumentId as jest.Mock
    mockFindByExternalPoliceDocumentId.mockResolvedValue(verdict)

    givenWhenThen = async (): Promise<Then> => {
      const then = {} as Then

      await internalVerdictController
        .getVerdictSupplements(externalPoliceDocumentId)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('get verdict supplements', () => {
    beforeEach(async () => {
      await givenWhenThen()
    })

    it('should return service information for defendant ', () => {
      expect(
        mockVerdictService.findByExternalPoliceDocumentId,
      ).toHaveBeenCalledWith(externalPoliceDocumentId)
    })
  })
})
