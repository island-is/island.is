import { uuid } from 'uuidv4'

import { MunicipalityModel } from '../models'
import { createTestingMunicipalityModule } from './createTestingMunicipalityModule'

import { ForbiddenException } from '@nestjs/common'

interface Then {
  result: MunicipalityModel
  error: Error
}

type GivenWhenThen = (id: string) => Promise<Then>

describe('MunicipalityController - Gets municipality by id', () => {
  let mockMunicipalitModel: typeof MunicipalityModel
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      municipalitModel,
      municipalitController,
    } = await createTestingMunicipalityModule()

    mockMunicipalitModel = municipalitModel

    givenWhenThen = async (id: string): Promise<Then> => {
      const then = {} as Then

      await municipalitController
        .getById(id)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('database query', () => {
    const id = uuid()
    let mockFindById: jest.Mock

    beforeEach(async () => {
      mockFindById = mockMunicipalitModel.findOne as jest.Mock

      await givenWhenThen(id)
    })

    it('should request municipality by id from the database', () => {
      expect(mockFindById).toHaveBeenCalledWith({
        where: {
          id,
        },
      })
    })
  })
})
