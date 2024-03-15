import { uuid } from 'uuidv4'

import { createTestingIndictmentCountModule } from './createTestingIndictmentCountModule'

import { UpdateIndictmentCountDto } from '../dto/updateIndictmentCount.dto'
import { IndictmentCount } from '../models/indictmentCount.model'

interface Then {
  result: IndictmentCount | null
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  indictmentCountId: string,
  indictmentCountToUpdate: UpdateIndictmentCountDto,
) => Promise<Then>

describe('IndictmentCountController - Update', () => {
  const caseId = uuid()
  const indictmentCountId = uuid()
  const policeCaseNumber = uuid()
  const indictmentCountToUpdate = { policeCaseNumber }

  let mockIndictmentCountModel: typeof IndictmentCount
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { indictmentCountModel, indictmentCountController } =
      await createTestingIndictmentCountModule()

    mockIndictmentCountModel = indictmentCountModel

    givenWhenThen = async (
      caseId: string,
      indictmentCountId: string,
      indictmentCountToUpdate: UpdateIndictmentCountDto,
    ) => {
      const then = {} as Then

      try {
        then.result = await indictmentCountController.update(
          caseId,
          indictmentCountId,
          indictmentCountToUpdate,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('indictment count updated', () => {
    const updatedIndictmentCount = {
      id: indictmentCountId,
      caseId,
      policeCaseNumber,
    }
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockIndictmentCountModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1, [updatedIndictmentCount]])

      then = await givenWhenThen(
        caseId,
        indictmentCountId,
        indictmentCountToUpdate,
      )
    })

    it('should update the indictment count', () => {
      expect(mockIndictmentCountModel.update).toHaveBeenCalledWith(
        indictmentCountToUpdate,
        {
          where: { id: indictmentCountId, caseId },
          returning: true,
        },
      )
      expect(then.result).toBe(updatedIndictmentCount)
    })
  })

  describe('indictment count update fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockIndictmentCountModel.update as jest.Mock
      mockUpdate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(
        caseId,
        indictmentCountId,
        indictmentCountToUpdate,
      )
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
