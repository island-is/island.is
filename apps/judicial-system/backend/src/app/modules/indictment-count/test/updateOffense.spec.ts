import { v4 as uuid } from 'uuid'

import { IndictmentCountOffense } from '@island.is/judicial-system/types'

import { createTestingIndictmentCountModule } from './createTestingIndictmentCountModule'

import { Offense, OffenseRepositoryService } from '../../repository'
import { UpdateOffenseDto } from '../dto/updateOffense.dto'

interface Then {
  result: Offense | null
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  indictmentCountId: string,
  offenseId: string,
  offenseToUpdate: UpdateOffenseDto,
) => Promise<Then>

describe('IndictmentCountController - Update offense', () => {
  const caseId = uuid()
  const indictmentCountId = uuid()
  const offenseId = uuid()
  const offenseToUpdate = {
    offense: IndictmentCountOffense.DRUNK_DRIVING,
    substances: { ALCOHOL: '0,10' },
  }

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
      offenseToUpdate: UpdateOffenseDto,
    ) => {
      const then = {} as Then

      try {
        then.result = await indictmentCountController.updateOffense(
          caseId,
          indictmentCountId,
          offenseId,
          offenseToUpdate,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('offense updated', () => {
    const updatedOffense = {
      id: offenseId,
      indictmentCountId,
    }
    let then: Then

    beforeEach(async () => {
      const mockUpdateByIdAndIndictmentCount =
        mockOffenseRepositoryService.updateByIdAndIndictmentCount as jest.Mock
      mockUpdateByIdAndIndictmentCount.mockResolvedValueOnce({
        numberOfAffectedRows: 1,
        offenses: [updatedOffense],
      })

      then = await givenWhenThen(
        caseId,
        indictmentCountId,
        offenseId,
        offenseToUpdate,
      )
    })

    it('should update the offense', () => {
      expect(
        mockOffenseRepositoryService.updateByIdAndIndictmentCount,
      ).toHaveBeenCalledWith(offenseId, indictmentCountId, offenseToUpdate)
      expect(then.result).toBe(updatedOffense)
    })
  })

  describe('offense update fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockUpdateByIdAndIndictmentCount =
        mockOffenseRepositoryService.updateByIdAndIndictmentCount as jest.Mock
      mockUpdateByIdAndIndictmentCount.mockRejectedValueOnce(
        new Error('Some error'),
      )

      then = await givenWhenThen(
        caseId,
        indictmentCountId,
        offenseId,
        offenseToUpdate,
      )
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
