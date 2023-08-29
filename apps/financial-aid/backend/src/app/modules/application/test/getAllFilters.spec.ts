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
    const { applicationController, applicationModel } =
      await createTestingApplicationModule()

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
    const staff = { id: uuid(), municipalityIds: ['10'] } as Staff
    let mockGetAllFilters: jest.Mock

    beforeEach(async () => {
      mockGetAllFilters = mockApplicationModel.count as jest.Mock

      await givenWhenThen(staff)
    })

    it('should query db with application state new', () => {
      expect(mockGetAllFilters).toHaveBeenCalledWith({
        where: {
          state: ApplicationState.NEW,
          municipalityCode: { [Op.in]: staff.municipalityIds },
        },
      })
    })

    it('should query db with application state in progress', () => {
      expect(mockGetAllFilters).toHaveBeenCalledWith({
        where: {
          state: ApplicationState.INPROGRESS,
          municipalityCode: { [Op.in]: staff.municipalityIds },
        },
      })
    })

    it('should query db with application state data needed', () => {
      expect(mockGetAllFilters).toHaveBeenCalledWith({
        where: {
          state: ApplicationState.DATANEEDED,
          municipalityCode: { [Op.in]: staff.municipalityIds },
        },
      })
    })

    it('should query db with application state rejected', () => {
      expect(mockGetAllFilters).toHaveBeenCalledWith({
        where: {
          state: ApplicationState.REJECTED,
          municipalityCode: { [Op.in]: staff.municipalityIds },
        },
      })
    })

    it('should query db with application state approved', () => {
      expect(mockGetAllFilters).toHaveBeenCalledWith({
        where: {
          state: ApplicationState.APPROVED,
          municipalityCode: { [Op.in]: staff.municipalityIds },
        },
      })
    })

    it('should query db with current staff applications', () => {
      expect(mockGetAllFilters).toHaveBeenCalledWith({
        where: {
          staffId: staff.id,
          municipalityCode: { [Op.in]: staff.municipalityIds },
          state: {
            [Op.or]: [ApplicationState.INPROGRESS, ApplicationState.DATANEEDED],
          },
        },
      })
    })
  })

  describe('get filters', () => {
    let then: Then
    const expectedValue = 10
    const staff = { id: uuid(), municipalityIds: ['10'] } as Staff

    beforeEach(async () => {
      const mockFindById = mockApplicationModel.count as jest.Mock
      mockFindById.mockReturnValue(expectedValue)

      then = await givenWhenThen(staff)
    })

    it('should return New filters', () => {
      expect(then.result.New).toBe(expectedValue)
    })

    it('should return InProgress filters', () => {
      expect(then.result.InProgress).toBe(expectedValue)
    })

    it('should return DataNeeded filters', () => {
      expect(then.result.DataNeeded).toBe(expectedValue)
    })

    it('should return Rejected filters', () => {
      expect(then.result.Rejected).toBe(expectedValue)
    })

    it('should return Approved filters', () => {
      expect(then.result.Approved).toBe(expectedValue)
    })

    it('should return MyCases filters', () => {
      expect(then.result.MyCases).toBe(expectedValue)
    })

    it('should return expected filters', () => {
      expect(then.result).toEqual({
        New: expectedValue,
        InProgress: expectedValue,
        DataNeeded: expectedValue,
        Rejected: expectedValue,
        Approved: expectedValue,
        MyCases: expectedValue,
      } as ApplicationFilters)
    })
  })

  describe('database query fails', () => {
    let then: Then
    const staff = { id: uuid(), municipalityIds: ['10'] } as Staff

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
