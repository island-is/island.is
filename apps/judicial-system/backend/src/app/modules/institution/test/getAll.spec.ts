import { v4 as uuid } from 'uuid'

import { createTestingInstitutionModule } from './createTestingInstitutionModule'

import { Institution } from '../../repository'

interface Then {
  result: Institution[]
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InstitutionController - Get all', () => {
  let mockInstitutionModel: typeof Institution
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { institutionModel, institutionController } =
      await createTestingInstitutionModule()

    mockInstitutionModel = institutionModel

    givenWhenThen = async () => {
      const then = {} as Then

      await institutionController
        .getAll()
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('institutions returned', () => {
    const institutions = [{ id: uuid() }, { id: uuid() }]
    let then: Then

    beforeEach(async () => {
      const mockFindAll = mockInstitutionModel.findAll as jest.Mock
      mockFindAll.mockResolvedValueOnce(institutions)

      then = await givenWhenThen()
    })

    it('should return cases', () => {
      expect(mockInstitutionModel.findAll).toHaveBeenCalledWith({
        order: ['name'],
        where: { active: true },
      })
      expect(then.result).toBe(institutions)
    })
  })
})
