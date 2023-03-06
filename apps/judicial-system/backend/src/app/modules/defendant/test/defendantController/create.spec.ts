import { uuid } from 'uuidv4'

import { Gender } from '@island.is/judicial-system/types'

import { CreateDefendantDto } from '../../dto/createDefendant.dto'
import { Defendant } from '../../models/defendant.model'
import { createTestingDefendantModule } from '../createTestingDefendantModule'

interface Then {
  result: Defendant
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  defendantToCreate: CreateDefendantDto,
) => Promise<Then>

describe('DefendantController - Create', () => {
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
      defendantToCreate: CreateDefendantDto,
    ) => {
      const then = {} as Then

      try {
        then.result = await defendantController.create(
          caseId,
          defendantToCreate,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('defendant created', () => {
    const caseId = uuid()
    const defendantToCreate = {
      nationalId: '0000000000',
      name: 'John Doe',
      gender: Gender.MALE,
      address: 'Somewhere',
    }

    beforeEach(async () => {
      await givenWhenThen(caseId, defendantToCreate)
    })

    it('should create a defendant', () => {
      expect(mockDefendantModel.create).toHaveBeenCalledWith({
        ...defendantToCreate,
        caseId,
      })
    })
  })

  describe('defendant returned', () => {
    const caseId = uuid()
    const defendantToCreate = {}
    const createdDefendant = {}
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockDefendantModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdDefendant)

      then = await givenWhenThen(caseId, defendantToCreate)
    })

    it('should return defendant', () => {
      expect(then.result).toBe(createdDefendant)
    })
  })

  describe('defendant creation fails', () => {
    const caseId = uuid()
    const defendantToCreate = {}
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockDefendantModel.create as jest.Mock
      mockCreate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, defendantToCreate)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
