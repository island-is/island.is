import { v4 as uuid } from 'uuid'

import { createTestingInstitutionModule } from './createTestingInstitutionModule'

import { Institution, InstitutionRepositoryService } from '../../repository'

interface Then {
  result: Institution[]
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InstitutionController - Get all', () => {
  let mockInstitutionRepositoryService: InstitutionRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { institutionRepositoryService, institutionController } =
      await createTestingInstitutionModule()

    mockInstitutionRepositoryService = institutionRepositoryService

    givenWhenThen = async () => {
      const then = {} as Then

      try {
        then.result = await institutionController.getAll()
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('institutions returned', () => {
    const institutions = [{ id: uuid() }, { id: uuid() }]
    let then: Then

    beforeEach(async () => {
      const mockFindAllActive =
        mockInstitutionRepositoryService.findAllActive as jest.Mock
      mockFindAllActive.mockResolvedValueOnce(institutions)

      then = await givenWhenThen()
    })

    it('should return the active institutions', () => {
      expect(
        mockInstitutionRepositoryService.findAllActive,
      ).toHaveBeenCalledWith(undefined)
      expect(then.result).toBe(institutions)
    })
  })
})
