import { uuid } from 'uuidv4'

import { UpdateDefendantDto } from '../dto/updateDefendant.dto'
import { Defendant } from '../models/defendant.model'
import { createTestingDefendantModule } from './createTestingDefendantModule'

interface Then {
  result: Defendant | null
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  defendantId: string,
  defendantToUpdate: UpdateDefendantDto,
) => Promise<Then>

describe('DefendantController - Update', () => {
  let mockDefendantModel: typeof Defendant
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      defendantModel,
      defendantController,
    } = await createTestingDefendantModule()

    mockDefendantModel = defendantModel

    givenWhenThen = async (
      caseId: string,
      defendantId: string,
      defendantToUpdate: UpdateDefendantDto,
    ) => {
      const then = {} as Then

      try {
        then.result = await defendantController.update(
          caseId,
          defendantId,
          defendantToUpdate,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('defendant updated', () => {
    const caseId = uuid()
    const defendantId = uuid()
    const defendantToUpdate = {}

    beforeEach(async () => {
      await givenWhenThen(caseId, defendantId, defendantToUpdate)
    })

    it('should update the defendant', () => {
      expect(mockDefendantModel.update).toHaveBeenCalledWith(
        defendantToUpdate,
        {
          where: { id: defendantId, caseId },
          returning: true,
        },
      )
    })
  })

  describe('defendant returned', () => {
    const caseId = uuid()
    const defendantId = uuid()
    const defendantToUpdate = {}
    const updatedDefendant = {}
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockDefendantModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1, [updatedDefendant]])

      then = await givenWhenThen(caseId, defendantId, defendantToUpdate)
    })

    it('should return defendant', () => {
      expect(then.result).toBe(updatedDefendant)
    })
  })

  describe('defendant update fails', () => {
    const caseId = uuid()
    const defendantId = uuid()
    const defendantToUpdate = {}
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockDefendantModel.update as jest.Mock
      mockUpdate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, defendantId, defendantToUpdate)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
