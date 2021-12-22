import { uuid } from 'uuidv4'

import { MunicipalityModel } from '../models'
import { createTestingMunicipalityModule } from './createTestingMunicipalityModule'

import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { AidModel } from '../../aid/models/aid.model'
import { AidType } from '@island.is/financial-aid/shared/lib'

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
    const municipalityId = uuid()
    let mockFindById: jest.Mock

    beforeEach(async () => {
      mockFindById = mockMunicipalitModel.findOne as jest.Mock

      await givenWhenThen(municipalityId)
    })

    it('should request municipality by id from the database', () => {
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

  describe('municipality not found', () => {
    const municipalityId = uuid()
    let then: Then

    beforeEach(async () => {
      const mockFindById = mockMunicipalitModel.findOne as jest.Mock
      mockFindById.mockResolvedValueOnce(null)

      then = await givenWhenThen(municipalityId)
    })

    it('should throw not found exception', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
    })
  })

  describe('municipality found', () => {
    const municipalityId = uuid()
    const municipality = ({
      id: '0',
      name: 'municipality Tester',
      nationalId: '0000000000',
      municipalityId: municipalityId,
      active: true,
      cohabitationAidId: uuid(),
      individualAidId: uuid(),
    } as unknown) as MunicipalityModel
    let then: Then

    beforeEach(async () => {
      const mockFindById = mockMunicipalitModel.findOne as jest.Mock
      mockFindById.mockResolvedValueOnce(municipality)

      then = await givenWhenThen(municipalityId)
    })

    it('should return municipality', () => {
      expect(then.result).toEqual(municipality)
    })
  })

  describe('database query fails', () => {
    const municipalityId = uuid()
    let then: Then

    beforeEach(async () => {
      const mockFindById = mockMunicipalitModel.findOne as jest.Mock
      mockFindById.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(municipalityId)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
