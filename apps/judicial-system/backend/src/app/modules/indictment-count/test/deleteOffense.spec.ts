import { v4 as uuid } from 'uuid'

import { createTestingIndictmentCountModule } from './createTestingIndictmentCountModule'

import { OffenseRepositoryService } from '../../repository'
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
  let mockOffenseRepositoryService: OffenseRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { offenseRepositoryService, indictmentCountController } =
      await createTestingIndictmentCountModule()

    mockOffenseRepositoryService = offenseRepositoryService

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
      const mockDeleteByIdAndIndictmentCount =
        mockOffenseRepositoryService.deleteByIdAndIndictmentCount as jest.Mock
      mockDeleteByIdAndIndictmentCount.mockResolvedValueOnce(1)

      then = await givenWhenThen(caseId, indictmentCountId, offenseId)
    })

    it('should delete the offense', () => {
      expect(
        mockOffenseRepositoryService.deleteByIdAndIndictmentCount,
      ).toHaveBeenCalledWith(offenseId, indictmentCountId)
      expect(then.result).toEqual({ deleted: true })
    })
  })

  describe('offense deletion fails', () => {
    const caseId = uuid()
    const indictmentCountId = uuid()
    const offenseId = uuid()
    let then: Then

    beforeEach(async () => {
      const mockDeleteByIdAndIndictmentCount =
        mockOffenseRepositoryService.deleteByIdAndIndictmentCount as jest.Mock
      mockDeleteByIdAndIndictmentCount.mockRejectedValueOnce(
        new Error('Some error'),
      )

      then = await givenWhenThen(caseId, indictmentCountId, offenseId)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
