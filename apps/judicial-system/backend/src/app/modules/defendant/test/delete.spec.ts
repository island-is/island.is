import { uuid } from 'uuidv4'

import { Defendant } from '../models/defendant.model'
import { DeleteDefendantResponse } from '../models/delete.response'
import { createTestingDefendantModule } from './createTestingDefendantModule'

interface Then {
  result: DeleteDefendantResponse
  error: Error
}

type GivenWhenThen = (caseId: string, defendantId: string) => Promise<Then>

describe('DefendantController - Delete', () => {
  let mockDefendantModel: typeof Defendant
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      defendantModel,
      defendantController,
    } = await createTestingDefendantModule()

    mockDefendantModel = defendantModel

    givenWhenThen = async (caseId: string, defendantId: string) => {
      const then = {} as Then

      try {
        then.result = await defendantController.delete(caseId, defendantId)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('defendant deleted', () => {
    const caseId = uuid()
    const defendantId = uuid()

    beforeEach(async () => {
      await givenWhenThen(caseId, defendantId)
    })

    it('should delete the defendant', () => {
      expect(mockDefendantModel.destroy).toHaveBeenCalledWith({
        where: { id: defendantId, caseId },
      })
    })
  })

  describe('deletion completed', () => {
    const caseId = uuid()
    const defendantId = uuid()
    let then: Then

    beforeEach(async () => {
      const mockDestroy = mockDefendantModel.destroy as jest.Mock
      mockDestroy.mockResolvedValueOnce(1)

      then = await givenWhenThen(caseId, defendantId)
    })

    it('should return number of deleted defendants', () => {
      expect(then.result).toEqual({ deleted: true })
    })
  })

  describe('defendant deletion fails', () => {
    const caseId = uuid()
    const defendantId = uuid()
    let then: Then

    beforeEach(async () => {
      const mockDestroy = mockDefendantModel.destroy as jest.Mock
      mockDestroy.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, defendantId)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
