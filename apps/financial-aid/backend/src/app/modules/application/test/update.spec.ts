import {
  ApplicationEventType,
  ApplicationState,
  RolesRule,
  User,
} from '@island.is/financial-aid/shared/lib'
import { uuid } from 'uuidv4'
import { AmountService } from '../../amount'
import { ApplicationEventService } from '../../applicationEvent/applicationEvent.service'
import { ApplicationEventModel } from '../../applicationEvent/models/applicationEvent.model'
import { FileService } from '../../file/file.service'
import { MunicipalityService } from '../../municipality'
import { StaffService } from '../../staff/staff.service'
import { UpdateApplicationDto } from '../dto'
import { ApplicationModel } from '../models/application.model'
import { createTestingApplicationModule } from './createTestingApplicationModule'

interface Then {
  result: ApplicationModel
  error: Error
}

type GivenWhenThen = (
  id: string,
  applicationToUpdate: UpdateApplicationDto,
  user: User,
) => Promise<Then>

describe.only('ApplicationController - Update', () => {
  let givenWhenThen: GivenWhenThen
  let mockApplicationModel: typeof ApplicationModel
  let mockStaffService: StaffService
  let mockFileService: FileService
  let mockAmountService: AmountService
  let mockApplicationEventService: ApplicationEventService
  let mockMunicipalityService: MunicipalityService

  beforeEach(async () => {
    const {
      applicationController,
      applicationModel,
      staffService,
      fileService,
      amountService,
      applicationEventService,
      municipalityService,
    } = await createTestingApplicationModule()

    mockApplicationModel = applicationModel
    mockStaffService = staffService
    mockFileService = fileService
    mockAmountService = amountService
    mockApplicationEventService = applicationEventService
    mockMunicipalityService = municipalityService

    givenWhenThen = async (
      id: string,
      applicationToUpdate: UpdateApplicationDto,
      user: User,
    ): Promise<Then> => {
      const then = {} as Then

      await applicationController
        .update(id, applicationToUpdate, user)
        .then((result) => (then.result = result))
        .catch((error) => {
          console.log(error), (then.error = error)
        })

      return then
    }
  })

  describe('database query', () => {
    let mockUpdate: jest.Mock

    const id = uuid()
    const applicationUpdate: UpdateApplicationDto = {
      state: ApplicationState.NEW,
      event: ApplicationEventType.NEW,
    }
    const user: User = {
      nationalId: '0000000000',
      name: 'The User',
      folder: uuid(),
      service: RolesRule.OSK,
    }

    beforeEach(async () => {
      mockUpdate = mockApplicationModel.update as jest.Mock
      const eventFindById = mockApplicationEventService.findById as jest.Mock
      eventFindById.mockReturnValueOnce(new Promise(() => []))
      const getApplicationFiles = mockFileService.getAllApplicationFiles as jest.Mock
      getApplicationFiles.mockReturnValueOnce(new Promise(() => []))

      await givenWhenThen(id, applicationUpdate, user)
    })

    it('should request staff by national id from the database', () => {
      expect(mockUpdate).toHaveBeenCalledWith(applicationUpdate, {
        where: { id },
        returning: true,
      })
    })
  })

  describe('applicant update', () => {
    let then: Then

    const id = uuid()
    const applicationUpdate: UpdateApplicationDto = {
      state: ApplicationState.NEW,
      event: ApplicationEventType.NEW,
    }
    const user: User = {
      nationalId: '0000000000',
      name: 'The User',
      folder: uuid(),
      service: RolesRule.OSK,
    }

    beforeEach(async () => {
      const mockUpdate = mockApplicationModel.update as jest.Mock
      mockUpdate.mockReturnValueOnce([
        1,
        [
          ({
            state: applicationUpdate.state,
            applicationEvents: [applicationUpdate.event],
          } as unknown) as ApplicationModel,
        ],
      ])
      const eventFindById = mockApplicationEventService.findById as jest.Mock
      eventFindById.mockReturnValueOnce(Promise.resolve([]))
      const getApplicationFiles = mockFileService.getAllApplicationFiles as jest.Mock
      getApplicationFiles.mockReturnValueOnce(Promise.resolve([]))

      then = await givenWhenThen(id, applicationUpdate, user)
    })

    it('should not call staffService', () => {
      expect(mockStaffService.findByNationalId).not.toHaveBeenCalled()
    })

    it('should not call amountService', () => {
      expect(mockAmountService.create).not.toHaveBeenCalled()
    })

    it('should call applicationEventService with correct values', () => {
      expect(mockApplicationEventService.create).toHaveBeenCalledWith({
        applicationId: id,
        eventType: ApplicationEventType.NEW,
        comment: undefined,
        staffName: undefined,
        staffNationalId: undefined,
      })
    })

    it.only('should have updated application staff as undefined', () => {
      expect(then.result.staff).toBeUndefined()
    })
  })

  describe('database query fails', () => {
    let then: Then

    const id = uuid()
    const applicationUpdate: UpdateApplicationDto = {
      state: ApplicationState.NEW,
      event: ApplicationEventType.NEW,
    }
    const user: User = {
      nationalId: '0000000000',
      name: 'The User',
      folder: uuid(),
      service: RolesRule.OSK,
    }

    beforeEach(async () => {
      const mockUpdate = mockApplicationModel.update as jest.Mock
      mockUpdate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(id, applicationUpdate, user)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
