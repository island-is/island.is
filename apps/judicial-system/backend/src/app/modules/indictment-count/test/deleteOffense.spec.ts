import { uuid } from 'uuidv4'

import { createTestingIndictmentCountModule } from './createTestingIndictmentCountModule'

import { Offense } from '../../repository'
import { DeleteResponse } from '../models/delete.response'

interface Then {
  result: DeleteResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  indictmentCountId: string,
  offenseId: string,
) => Promise<Then>

describe('IndictmentCountController - Delete offense', () => {
  let mockOffenseModel: typeof Offense
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { offenseModel, indictmentCountController } =
      await createTestingIndictmentCountModule()

    mockOffenseModel = offenseModel

    givenWhenThen = async (
      caseId: string,
      indictmentCountId: string,
      offenseId: string,
    ) => {
      const then = {} as Then

      try {
        then.result = await indictmentCountController.deleteOffense(
          caseId,
          indictmentCountId,
          offenseId,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('offense deleted', () => {
    const caseId = uuid()
    const indictmentCountId = uuid()
    const offenseId = uuid()
    let then: Then

    beforeEach(async () => {
      const mockDestroy = mockOffenseModel.destroy as jest.Mock
      mockDestroy.mockResolvedValueOnce(1)

      then = await givenWhenThen(caseId, indictmentCountId, offenseId)
    })

    it('should delete the offense', () => {
      expect(mockOffenseModel.destroy).toHaveBeenCalledWith({
        where: { id: offenseId, indictmentCountId },
      })
      expect(then.result).toEqual({ deleted: true })
    })
  })

  describe('offense deletion fails', () => {
    const caseId = uuid()
    const indictmentCountId = uuid()
    const offenseId = uuid()
    let then: Then

    beforeEach(async () => {
      const mockDestroy = mockOffenseModel.destroy as jest.Mock
      mockDestroy.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, indictmentCountId, offenseId)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
