import { uuid } from 'uuidv4'

import { createTestingIndictmentCountModule } from './createTestingIndictmentCountModule'

import { DeleteIndictmentCountResponse } from '../models/delete.response'
import { IndictmentCount } from '../models/indictmentCount.model'

interface Then {
  result: DeleteIndictmentCountResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  indictmentCountId: string,
) => Promise<Then>

describe('IndictmentCountController - Delete', () => {
  let mockIndictmentCountModel: typeof IndictmentCount
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { indictmentCountModel, indictmentCountController } =
      await createTestingIndictmentCountModule()

    mockIndictmentCountModel = indictmentCountModel

    givenWhenThen = async (caseId: string, indictmentCountId: string) => {
      const then = {} as Then

      try {
        then.result = await indictmentCountController.delete(
          caseId,
          indictmentCountId,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('indictment count deleted', () => {
    const caseId = uuid()
    const indictmentCountId = uuid()
    let then: Then

    beforeEach(async () => {
      const mockDestroy = mockIndictmentCountModel.destroy as jest.Mock
      mockDestroy.mockResolvedValueOnce(1)

      then = await givenWhenThen(caseId, indictmentCountId)
    })

    it('should delete the indictment count', () => {
      expect(mockIndictmentCountModel.destroy).toHaveBeenCalledWith({
        where: { id: indictmentCountId, caseId },
      })
      expect(then.result).toEqual({ deleted: true })
    })
  })

  describe('indictment count deletion fails', () => {
    const caseId = uuid()
    const indictmentCountId = uuid()
    let then: Then

    beforeEach(async () => {
      const mockDestroy = mockIndictmentCountModel.destroy as jest.Mock
      mockDestroy.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, indictmentCountId)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
