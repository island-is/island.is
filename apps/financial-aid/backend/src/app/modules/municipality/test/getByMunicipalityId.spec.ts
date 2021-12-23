import { AidType } from '@island.is/financial-aid/shared/lib'
import { uuid } from 'uuidv4'
import { AidModel } from '../../aid/models/aid.model'

import { MunicipalityModel } from '../models/municipality.model'
import { createTestingMunicipalityModule } from './createTestingMunicipalityModule'

interface Then {
  result: MunicipalityModel
  error: Error
}

type GivenWhenThen = (municipalityId: string) => Promise<Then>
describe('MunicipalityController - Gets municipality by id', () => {
  let mockMunicipalityModel: typeof MunicipalityModel
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      municipalityModel,
      municipalityController,
    } = await createTestingMunicipalityModule()

    mockMunicipalityModel = municipalityModel

    givenWhenThen = async (municipalityId: string): Promise<Then> => {
      const then = {} as Then

      await municipalityController
        .getById(municipalityId)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('database query', () => {
    const municipalityId = uuid()
    let mockFindById: jest.Mock

    beforeEach(async () => {
      mockFindById = mockMunicipalityModel.findOne as jest.Mock

      await givenWhenThen(municipalityId)
    })

    it.only('should request municipality by id from the database', () => {
      expect(mockFindById).toHaveBeenCalledWith({
        where: {
          municipalityId,
        },
        include: [
          {
            model: AidModel,
            as: 'individualAid',
            where: {
              municipalityId,
              type: AidType.INDIVIDUAL,
            },
          },
          {
            model: AidModel,
            as: 'cohabitationAid',
            where: {
              municipalityId,
              type: AidType.COHABITATION,
            },
          },
        ],
      })
    })
  })
})
