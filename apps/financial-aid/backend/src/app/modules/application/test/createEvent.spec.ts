import type { User } from '@island.is/auth-nest-tools'
import { MunicipalitiesFinancialAidScope } from '@island.is/auth/scopes'
import {
  Application,
  ApplicationEventType,
  ApplicationState,
  Employment,
  FamilyStatus,
  HomeCircumstances,
} from '@island.is/financial-aid/shared/lib'
import { NotFoundException } from '@nestjs/common'
import { uuid } from 'uuidv4'
import { ApplicationEventService } from '../../applicationEvent'
import { CreateApplicationEventDto } from '../dto'
import { ApplicationModel } from '../models/application.model'
import { createTestingApplicationModule } from './createTestingApplicationModule'

interface Then {
  result: ApplicationModel
  error: Error
}

type GivenWhenThen = (
  applicationEvent: CreateApplicationEventDto,
  user: User,
) => Promise<Then>

describe('ApplicationController - Create event', () => {
  let givenWhenThen: GivenWhenThen
  let mockApplicationEventService: ApplicationEventService
  let mockApplicationModel: typeof ApplicationModel

  beforeEach(async () => {
    const { applicationModel, applicationEventService, applicationController } =
      await createTestingApplicationModule()

    mockApplicationEventService = applicationEventService
    mockApplicationModel = applicationModel

    givenWhenThen = async (
      applicationEvent: CreateApplicationEventDto,
      user: User,
    ): Promise<Then> => {
      const then = {} as Then

      await applicationController
        .createEvent(applicationEvent, user)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('application found', () => {
    const id = uuid()
    const user = { scope: [MunicipalitiesFinancialAidScope.applicant] } as User
    const application: Application = {
      id: id,
      created: '',
      modified: '',
      nationalId: '',
      name: '',
      email: '',
      homeCircumstances: HomeCircumstances.UNKNOWN,
      student: false,
      employment: Employment.WORKING,
      hasIncome: false,
      usePersonalTaxCredit: false,
      state: ApplicationState.NEW,
      familyStatus: FamilyStatus.COHABITATION,
      directTaxPayments: [],
      hasFetchedDirectTaxPayment: null,
      spouseHasFetchedDirectTaxPayment: null,
      municipalityCode: '',
    }
    const applicationEvent: CreateApplicationEventDto = {
      applicationId: id,
      eventType: ApplicationEventType.NEW,
    }
    let then: Then

    beforeEach(async () => {
      const createApplicationEvent =
        mockApplicationEventService.create as jest.Mock
      createApplicationEvent.mockReturnValueOnce(Promise.resolve())
      const findApplicationById = mockApplicationModel.findOne as jest.Mock
      findApplicationById.mockReturnValueOnce(application)

      then = await givenWhenThen(applicationEvent, user)
    })

    it('should return application', () => {
      expect(then.result).toEqual(application)
    })

    it('should call application event service', () => {
      expect(mockApplicationEventService.create).toHaveBeenCalledWith(
        applicationEvent,
      )
    })
  })

  describe('application not found', () => {
    const id = uuid()
    const user = { scope: [MunicipalitiesFinancialAidScope.applicant] } as User
    const application = undefined
    const applicationEvent: CreateApplicationEventDto = {
      applicationId: id,
      eventType: ApplicationEventType.NEW,
    }
    let then: Then

    beforeEach(async () => {
      const createApplicationEvent =
        mockApplicationEventService.create as jest.Mock
      createApplicationEvent.mockReturnValueOnce(Promise.resolve())
      const findApplicationById = mockApplicationModel.findOne as jest.Mock
      findApplicationById.mockReturnValueOnce(application)

      then = await givenWhenThen(applicationEvent, user)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
    })

    it('should have correct error message', () => {
      expect(then.error.message).toEqual(
        `application ${applicationEvent.applicationId} not found`,
      )
    })

    it('should call application event service', () => {
      expect(mockApplicationEventService.create).toHaveBeenCalledWith(
        applicationEvent,
      )
    })
  })
})
