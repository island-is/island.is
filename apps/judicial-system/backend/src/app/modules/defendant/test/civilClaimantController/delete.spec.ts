import { uuid } from 'uuidv4'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import { CivilClaimant } from '../../../repository'
import { DeleteCivilClaimantResponse } from '../../models/deleteCivilClaimant.response'

interface Then {
  result: DeleteCivilClaimantResponse
  error: Error
}

type GivenWhenThen = (
  caseId?: string,
  civilClaimaintId?: string,
) => Promise<Then>

describe('CivilClaimantController - Delete', () => {
  const caseId = uuid()
  const civilClaimantId = uuid()

  let mockCivilClaimantModel: typeof CivilClaimant
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { civilClaimantController, civilClaimantModel } =
      await createTestingDefendantModule()

    mockCivilClaimantModel = civilClaimantModel

    const mockDestroy = mockCivilClaimantModel.destroy as jest.Mock
    mockDestroy.mockRejectedValue(new Error('Test error'))

    givenWhenThen = async () => {
      const then = {} as Then

      try {
        then.result = await civilClaimantController.delete(
          caseId,
          civilClaimantId,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('civil claimant deleted', () => {
    let then: Then

    beforeEach(async () => {
      const mockDestroy = mockCivilClaimantModel.destroy as jest.Mock
      mockDestroy.mockResolvedValue(1)

      then = await givenWhenThen(caseId, civilClaimantId)
    })
    it('should delete civil claimant', () => {
      expect(mockCivilClaimantModel.destroy).toHaveBeenCalledWith({
        where: { caseId, id: civilClaimantId },
      })
      expect(then.result).toEqual({ deleted: true })
    })
  })

  describe('civil claimant deletion fails', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Test error')
    })
  })
})
