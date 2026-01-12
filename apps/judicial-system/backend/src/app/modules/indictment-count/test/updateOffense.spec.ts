import { v4 as uuid } from 'uuid'

import { IndictmentCountOffense } from '@island.is/judicial-system/types'

import { createTestingIndictmentCountModule } from './createTestingIndictmentCountModule'

import { Offense } from '../../repository'
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
      const mockUpdate = mockOffenseModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1, [updatedOffense]])

      then = await givenWhenThen(
        caseId,
        indictmentCountId,
        offenseId,
        offenseToUpdate,
      )
    })

    it('should update the offense', () => {
      expect(mockOffenseModel.update).toHaveBeenCalledWith(offenseToUpdate, {
        where: { id: offenseId, indictmentCountId },
        returning: true,
      })
      expect(then.result).toBe(updatedOffense)
    })
  })

  describe('offense update fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockOffenseModel.update as jest.Mock
      mockUpdate.mockRejectedValueOnce(new Error('Some error'))

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
