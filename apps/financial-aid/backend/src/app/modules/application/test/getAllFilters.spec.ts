import {
  ApplicationFilters,
  ApplicationState,
  Staff,
} from '@island.is/financial-aid/shared/lib'
import { Op } from 'sequelize'
import { uuid } from 'uuidv4'
import { ApplicationModel } from '../models/application.model'
import { createTestingApplicationModule } from './createTestingApplicationModule'

interface Then {
  result: ApplicationFilters
  error: Error
}

type GivenWhenThen = (staff: Staff) => Promise<Then>

describe('ApplicationController - Get all filters', () => {
  let givenWhenThen: GivenWhenThen
  let mockApplicationModel: typeof ApplicationModel

  beforeEach(async () => {
    const {
      applicationController,
      applicationModel,
    } = await createTestingApplicationModule()

    mockApplicationModel = applicationModel

    givenWhenThen = async (staff: Staff): Promise<Then> => {
      const then = {} as Then

      await applicationController
        .getAllFilters(staff)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('database query', () => {
    const staff = { id: uuid(), municipalityId: '10' } as Staff
    let mockGetAllFilters: jest.Mock

    beforeEach(async () => {
      mockGetAllFilters = mockApplicationModel.count as jest.Mock

      await givenWhenThen(staff)
    })

    it('should query db with application state new', () => {
      expect(mockGetAllFilters).toHaveBeenCalledWith({
        where: {
          state: ApplicationState.NEW,
          municipalityCode: staff.municipalityId,
        },
      })
    })

    it('should query db with application state in progress', () => {
      expect(mockGetAllFilters).toHaveBeenCalledWith({
        where: {
          state: ApplicationState.INPROGRESS,
          municipalityCode: staff.municipalityId,
        },
      })
    })

    it('should query db with application state data needed', () => {
      expect(mockGetAllFilters).toHaveBeenCalledWith({
        where: {
          state: ApplicationState.DATANEEDED,
          municipalityCode: staff.municipalityId,
        },
      })
    })

    it('should query db with application state rejected', () => {
      expect(mockGetAllFilters).toHaveBeenCalledWith({
        where: {
          state: ApplicationState.REJECTED,
          municipalityCode: staff.municipalityId,
        },
      })
    })

    it('should query db with application state approved', () => {
      expect(mockGetAllFilters).toHaveBeenCalledWith({
        where: {
          state: ApplicationState.APPROVED,
          municipalityCode: staff.municipalityId,
        },
      })
    })

    it('should query db with current staff applications', () => {
      expect(mockGetAllFilters).toHaveBeenCalledWith({
        where: {
          staffId: staff.id,
          municipalityCode: staff.municipalityId,
          state: {
            [Op.or]: [ApplicationState.INPROGRESS, ApplicationState.DATANEEDED],
          },
        },
      })
    })
  })

  describe('get filters', () => {
    let then: Then
    const staff = { id: uuid(), municipalityId: '10' } as Staff

    beforeEach(async () => {
      const mockFindById = mockApplicationModel.count as jest.Mock
      mockFindById.mockReturnValue(10)

      then = await givenWhenThen(staff)
    })

    it('should return New filters', () => {
      expect(then.result.New).toBe(10)
    })

    it('should return InProgress filters', () => {
      expect(then.result.InProgress).toBe(10)
    })

    it('should return DataNeeded filters', () => {
      expect(then.result.DataNeeded).toBe(10)
    })

    it('should return Rejected filters', () => {
      expect(then.result.Rejected).toBe(10)
    })

    it('should return Approved filters', () => {
      expect(then.result.Approved).toBe(10)
    })

    it('should return MyCases filters', () => {
      expect(then.result.MyCases).toBe(10)
    })

    it('should return expected filters', () => {
      expect(then.result).toEqual({
        New: 10,
        InProgress: 10,
        DataNeeded: 10,
        Rejected: 10,
        Approved: 10,
        MyCases: 10,
      } as ApplicationFilters)
    })
  })

  describe('database query fails', () => {
    let then: Then
    const staff = { id: uuid(), municipalityId: '10' } as Staff

    beforeEach(async () => {
      const mockGetAllFilters = mockApplicationModel.count as jest.Mock
      mockGetAllFilters.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(staff)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
