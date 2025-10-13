import { uuid } from 'uuidv4'

import { VerdictServiceStatus } from '@island.is/judicial-system/types'

import { createTestingVerdictModule } from '../createTestingVerdictModule'

import { Verdict } from '../../../repository'
import { PoliceUpdateVerdictDto } from '../../dto/policeUpdateVerdict.dto'

interface Then {
  result: Verdict
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalVerdictController - Update verdict', () => {
  const verdictId = uuid()
  const externalPoliceDocumentId = uuid()

  const verdict = { id: verdictId, externalPoliceDocumentId } as Verdict

  const dto = {
    serviceDate: new Date(2025, 1, 1),
    serviceStatus: VerdictServiceStatus.ELECTRONICALLY,
    comment: 'test',
  } as PoliceUpdateVerdictDto

  let mockVerdictModel: typeof Verdict

  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { internalVerdictController, verdictModel } =
      await createTestingVerdictModule()

    mockVerdictModel = verdictModel

    givenWhenThen = async (): Promise<Then> => {
      const then = {} as Then

      await internalVerdictController
        .updateVerdict(externalPoliceDocumentId, verdict, dto)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('verdict updated', () => {
    const updatedVerdict = { ...verdict, ...dto }

    let then: Then

    beforeEach(async () => {
      const mockFind = mockVerdictModel.findOne as jest.Mock
      mockFind.mockResolvedValueOnce([1, [verdict]])

      const mockUpdate = mockVerdictModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1, [updatedVerdict]])

      then = await givenWhenThen()
    })

    it('should update the verdict ', () => {
      expect(mockVerdictModel.update).toHaveBeenCalledWith(dto, {
        where: { id: verdictId },
        returning: true,
      })
      expect(then.result).toBe(updatedVerdict)
    })
  })
})
