import { EmailService } from '@island.is/email-service'
import each from 'jest-each'
import {
  ApplicationEventType,
  ApplicationState,
  Employment,
  FamilyStatus,
  HomeCircumstances,
  Municipality,
} from '@island.is/financial-aid/shared/lib'
import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { uuid } from 'uuidv4'
import { AmountService } from '../../amount'
import { ApplicationEventService } from '../../applicationEvent/applicationEvent.service'
import { FileService } from '../../file/file.service'
import { MunicipalityService } from '../../municipality'
import { StaffService } from '../../staff/staff.service'
import { UpdateApplicationDto } from '../dto'
import { ApplicationModel } from '../models/application.model'
import { createTestingApplicationModule } from './createTestingApplicationModule'
import type { User } from '@island.is/auth-nest-tools'
import { MunicipalitiesFinancialAidScope } from '@island.is/auth/scopes'
import { DirectTaxPaymentService } from '../../directTaxPayment'

interface Then {
  result: ApplicationModel
  error: Error
}

//TODO TEST HERE

type GivenWhenThen = (
  id: string,
  applicationToUpdate: UpdateApplicationDto,
  user: User,
) => Promise<Then>

describe('ApplicationController - Update', () => {
  let givenWhenThen: GivenWhenThen
  let mockApplicationModel: typeof ApplicationModel
  let mockStaffService: StaffService
  let mockFileService: FileService
  let mockAmountService: AmountService
  let mockApplicationEventService: ApplicationEventService
  let mockMunicipalityService: MunicipalityService
  let mockEmailService: EmailService
  let mockDirectTaxPaymentService: DirectTaxPaymentService

  beforeEach(async () => {
    const {
      applicationController,
      applicationModel,
      staffService,
      fileService,
      amountService,
      applicationEventService,
      municipalityService,
      emailService,
      directTaxPaymentService,
    } = await createTestingApplicationModule()

    mockApplicationModel = applicationModel
    mockStaffService = staffService
    mockFileService = fileService
    mockAmountService = amountService
    mockApplicationEventService = applicationEventService
    mockMunicipalityService = municipalityService
    mockEmailService = emailService
    mockDirectTaxPaymentService = directTaxPaymentService

    givenWhenThen = async (
      id: string,
      applicationToUpdate: UpdateApplicationDto,
      user: User,
    ): Promise<Then> => {
      const then = {} as Then

      await applicationController
        .update(id, applicationToUpdate, user)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('database query', () => {
    let mockUpdate: jest.Mock

    const id = uuid()
    const applicationUpdate: UpdateApplicationDto = {
      state: ApplicationState.NEW,
      event: ApplicationEventType.FILEUPLOAD,
    }
    const user = {
      nationalId: '0000000000',
      scope: [MunicipalitiesFinancialAidScope.applicant],
    } as User

    beforeEach(async () => {
      mockUpdate = mockApplicationModel.update as jest.Mock
      const eventFindById = mockApplicationEventService.findById as jest.Mock
      eventFindById.mockReturnValueOnce(new Promise(() => []))
      const getApplicationFiles =
        mockFileService.getAllApplicationFiles as jest.Mock
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
      state: ApplicationState.INPROGRESS,
      event: ApplicationEventType.FILEUPLOAD,
    }

    const user: User = {
      nationalId: '0000000000',
      scope: [MunicipalitiesFinancialAidScope.applicant],
    } as User

    const application = {
      id,
      nationalId: user.nationalId,
      name: 'Name',
      homeCircumstances: HomeCircumstances.UNKNOWN,
      employment: Employment.WORKING,
      student: false,
      usePersonalTaxCredit: false,
      hasIncome: false,
      state: applicationUpdate.state,
      files: [],
      familyStatus: FamilyStatus.COHABITATION,
      municipalityCode: '1',
      setDataValue: jest.fn,
    }

    beforeEach(async () => {
      const mockUpdate = mockApplicationModel.update as jest.Mock
      mockUpdate.mockReturnValueOnce([1, [application]])
      const eventFindById = mockApplicationEventService.findById as jest.Mock
      eventFindById.mockReturnValueOnce(Promise.resolve([]))
      const getApplicationFiles =
        mockFileService.getAllApplicationFiles as jest.Mock
      getApplicationFiles.mockReturnValueOnce(Promise.resolve([]))
      const getDirectTaxPayment =
        mockDirectTaxPaymentService.getByApplicationId as jest.Mock
      getDirectTaxPayment.mockReturnValueOnce(Promise.resolve([]))

      then = await givenWhenThen(id, applicationUpdate, user)
    })

    it('should not call staffService', () => {
      expect(mockStaffService.findByNationalId).not.toHaveBeenCalled()
    })

    it('should not call amountService', () => {
      expect(mockAmountService.create).not.toHaveBeenCalled()
    })

    it('should call directTaxPaymentService', () => {
      expect(
        mockDirectTaxPaymentService.getByApplicationId,
      ).toHaveBeenCalledWith(application.id)
    })

    it('should call applicationEventService with correct values', () => {
      expect(mockApplicationEventService.create).toHaveBeenCalledWith({
        applicationId: id,
        eventType: applicationUpdate.event,
        comment: undefined,
        staffName: undefined,
        staffNationalId: undefined,
        emailSent: null,
      })
    })

    it('should have updated application staff as undefined', () => {
      expect(then.result.staff).toBeUndefined()
    })

    it('should return updated application', () => {
      expect(then.result).toEqual(application)
    })

    it('should call file service with id', () => {
      expect(mockFileService.getAllApplicationFiles).toHaveBeenCalledWith(id)
    })

    it('should not call municipality service because application event type is NEW', () => {
      expect(
        mockMunicipalityService.findByMunicipalityId,
      ).not.toHaveBeenCalled()
    })

    it('should not call email service because application event type is NEW', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
    })
  })

  describe('No row updated', () => {
    let then: Then
    const id = uuid()
    const applicationUpdate: UpdateApplicationDto = {
      state: ApplicationState.NEW,
      event: ApplicationEventType.USERCOMMENT,
    }
    const user = {
      nationalId: '0000000000',
      scope: [MunicipalitiesFinancialAidScope.applicant],
    } as User

    beforeEach(async () => {
      const mockUpdate = mockApplicationModel.update as jest.Mock
      mockUpdate.mockReturnValueOnce([0, [undefined as ApplicationModel]])

      then = await givenWhenThen(id, applicationUpdate, user)
    })

    it('should throw NotFoundException', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
    })

    it('should have correct error message', () => {
      expect(then.error.message).toEqual(`Application ${id} does not exist`)
    })
  })

  describe('Applicant sending events', () => {
    const id = uuid()

    const user = {
      nationalId: '0000000000',
      scope: [MunicipalitiesFinancialAidScope.applicant],
    } as User

    const application = {
      id,
      nationalId: user.nationalId,
      name: 'name',
      homeCircumstances: HomeCircumstances.UNKNOWN,
      employment: Employment.WORKING,
      student: false,
      usePersonalTaxCredit: false,
      hasIncome: false,
      state: ApplicationState.INPROGRESS,
      files: [],
      familyStatus: FamilyStatus.COHABITATION,
      municipalityCode: '1',
      setDataValue: jest.fn,
    }

    beforeEach(async () => {
      const mockUpdate = mockApplicationModel.update as jest.Mock
      mockUpdate.mockReturnValueOnce([1, [application]])
      const eventFindById = mockApplicationEventService.findById as jest.Mock
      eventFindById.mockReturnValueOnce(Promise.resolve([]))
      const getApplicationFiles =
        mockFileService.getAllApplicationFiles as jest.Mock
      getApplicationFiles.mockReturnValueOnce(Promise.resolve([]))
      const getDirectTaxPayment =
        mockDirectTaxPaymentService.getByApplicationId as jest.Mock
      getDirectTaxPayment.mockReturnValueOnce(Promise.resolve([]))
    })

    describe('Allowed events', () => {
      let then: Then
      each`
        event
        ${ApplicationEventType.SPOUSEFILEUPLOAD}
        ${ApplicationEventType.FILEUPLOAD}
        ${ApplicationEventType.USERCOMMENT}
      `.describe('$event', ({ event }) => {
        beforeEach(async () => {
          then = await givenWhenThen(
            id,
            { state: ApplicationState.INPROGRESS, event: event },
            user,
          )
        })

        it('should not throw exception', () => {
          expect(then.error).toBeUndefined()
        })

        it('should return updated application', () => {
          expect(then.result).toEqual(application)
        })
      })

      describe('Forbidden events', () => {
        let then: Then
        each`
        event
        ${ApplicationEventType.REJECTED}
        ${ApplicationEventType.APPROVED}
        ${ApplicationEventType.STAFFCOMMENT}
        ${ApplicationEventType.ASSIGNCASE}
        ${ApplicationEventType.NEW}
        ${ApplicationEventType.INPROGRESS}
      `.describe('$event', ({ event }) => {
          beforeEach(async () => {
            then = await givenWhenThen(
              id,
              { state: ApplicationState.INPROGRESS, event: event },
              user,
            )
          })
          it('should throw forbidden exception', () => {
            expect(then.error).toBeInstanceOf(ForbiddenException)
          })
        })
      })
    })
  })

  describe('Staff sending events', () => {
    const id = uuid()

    const staff: User = {
      nationalId: '0000000000',
      scope: [MunicipalitiesFinancialAidScope.employee],
    } as User

    const application = {
      id,
      nationalId: '0000000001',
      name: 'The user',
      created: new Date(),
      email: 'some email',
      homeCircumstances: HomeCircumstances.UNKNOWN,
      employment: Employment.WORKING,
      student: false,
      usePersonalTaxCredit: false,
      hasIncome: false,
      state: ApplicationState.NEW,
      files: [],
      familyStatus: FamilyStatus.COHABITATION,
      municipalityCode: '1',
      setDataValue: jest.fn,
    }
    const municipality: Municipality = {
      id: '',
      name: 'Sveitarfélag',
      homepage: 'homepage',
      rulesHomepage: 'rulesHomepage',
      active: false,
      municipalityId: '',
      individualAid: undefined,
      cohabitationAid: undefined,
      usingNav: false,
    }

    beforeEach(async () => {
      const mockUpdate = mockApplicationModel.update as jest.Mock
      mockUpdate.mockReturnValueOnce([1, [application]])
      const eventFindById = mockApplicationEventService.findById as jest.Mock
      eventFindById.mockReturnValueOnce(Promise.resolve([]))
      const getApplicationFiles =
        mockFileService.getAllApplicationFiles as jest.Mock
      getApplicationFiles.mockReturnValueOnce(Promise.resolve([]))
      const findStaffByNationalId =
        mockStaffService.findByNationalId as jest.Mock
      findStaffByNationalId.mockReturnValueOnce(Promise.resolve(staff))
      const findByMunicipalityId =
        mockMunicipalityService.findByMunicipalityId as jest.Mock
      findByMunicipalityId.mockReturnValueOnce(Promise.resolve(municipality))
      const sendEmail = mockEmailService.sendEmail as jest.Mock
      sendEmail.mockReturnValueOnce(Promise.resolve())
      const getDirectTaxPayment =
        mockDirectTaxPaymentService.getByApplicationId as jest.Mock
      getDirectTaxPayment.mockReturnValueOnce(Promise.resolve([]))
    })

    describe('Forbidden events', () => {
      let then: Then
      each`
        event
        ${ApplicationEventType.SPOUSEFILEUPLOAD}
        ${ApplicationEventType.FILEUPLOAD}
        ${ApplicationEventType.USERCOMMENT}
      `.describe('$event', ({ event }) => {
        beforeEach(async () => {
          then = await givenWhenThen(
            id,
            { state: ApplicationState.INPROGRESS, event: event },
            staff,
          )
        })

        it('should throw forbidden exception', () => {
          expect(then.error).toBeInstanceOf(ForbiddenException)
        })
      })

      describe('Allowed events', () => {
        let then: Then
        each`
        event
        ${ApplicationEventType.REJECTED}
        ${ApplicationEventType.APPROVED}
        ${ApplicationEventType.STAFFCOMMENT}
        ${ApplicationEventType.ASSIGNCASE}
        ${ApplicationEventType.NEW}
        ${ApplicationEventType.INPROGRESS}
      `.describe('$event', ({ event }) => {
          beforeEach(async () => {
            then = await givenWhenThen(
              id,
              { state: ApplicationState.INPROGRESS, event: event },
              staff,
            )
          })

          it('should not throw exception', () => {
            expect(then.error).toBeUndefined()
          })

          it('should return updated application', () => {
            expect(then.result).toEqual(application)
          })
        })
      })
    })
  })

  describe('staff update', () => {
    let then: Then

    const id = uuid()
    const applicationUpdate: UpdateApplicationDto = {
      state: ApplicationState.DATANEEDED,
      event: ApplicationEventType.DATANEEDED,
      comment: 'comment',
    }
    const staff: User = {
      nationalId: '0000000000',
      scope: [MunicipalitiesFinancialAidScope.employee],
    } as User

    const application = {
      id,
      nationalId: '0000000001',
      name: 'The user',
      created: new Date(),
      email: 'some email',
      homeCircumstances: HomeCircumstances.UNKNOWN,
      employment: Employment.WORKING,
      student: false,
      usePersonalTaxCredit: false,
      hasIncome: false,
      state: applicationUpdate.state,
      files: [],
      familyStatus: FamilyStatus.COHABITATION,
      municipalityCode: '1',
      setDataValue: jest.fn,
    }
    const municipality: Municipality = {
      id: '',
      name: 'Sveitarfélag',
      homepage: 'homepage',
      rulesHomepage: 'rulesHomepage',
      active: false,
      municipalityId: '',
      individualAid: undefined,
      cohabitationAid: undefined,
      usingNav: false,
    }

    beforeEach(async () => {
      const mockUpdate = mockApplicationModel.update as jest.Mock
      mockUpdate.mockReturnValueOnce([1, [application]])
      const eventFindById = mockApplicationEventService.findById as jest.Mock
      eventFindById.mockReturnValueOnce(Promise.resolve([]))
      const getApplicationFiles =
        mockFileService.getAllApplicationFiles as jest.Mock
      getApplicationFiles.mockReturnValueOnce(Promise.resolve([]))
      const findStaffByNationalId =
        mockStaffService.findByNationalId as jest.Mock
      findStaffByNationalId.mockReturnValueOnce(Promise.resolve(staff))
      const findByMunicipalityId =
        mockMunicipalityService.findByMunicipalityId as jest.Mock
      findByMunicipalityId.mockReturnValueOnce(Promise.resolve(municipality))
      const sendEmail = mockEmailService.sendEmail as jest.Mock
      sendEmail.mockReturnValueOnce(Promise.resolve())
      const getDirectTaxPayment =
        mockDirectTaxPaymentService.getByApplicationId as jest.Mock
      getDirectTaxPayment.mockReturnValueOnce(Promise.resolve([]))

      then = await givenWhenThen(id, applicationUpdate, staff)
    })

    it('should call staffService with correct values', () => {
      expect(mockStaffService.findByNationalId).toHaveBeenCalledWith(
        staff.nationalId,
      )
    })

    // it('should call applicationEventService with correct values', () => {
    //   expect(mockApplicationEventService.create).toHaveBeenCalledWith({
    //     applicationId: id,
    //     eventType: applicationUpdate.event,
    //     comment: applicationUpdate.comment,
    //     staffNationalId: '0000000000',
    //   })
    // })

    it('should call file service with id', () => {
      expect(mockFileService.getAllApplicationFiles).toHaveBeenCalledWith(id)
    })

    it('should not call amountService', () => {
      expect(mockAmountService.create).not.toHaveBeenCalled()
    })

    it('should call directTaxPaymentService', () => {
      expect(
        mockDirectTaxPaymentService.getByApplicationId,
      ).toHaveBeenCalledWith(application.id)
    })

    it('should call municipality service with correct value', () => {
      expect(mockMunicipalityService.findByMunicipalityId).toHaveBeenCalledWith(
        application.municipalityCode,
      )
    })

    it('should call email service with correct value', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith({
        from: {
          name: 'Samband íslenskra sveitarfélaga',
          address: undefined,
        },
        replyTo: {
          name: 'Samband íslenskra sveitarfélaga',
          address: undefined,
        },
        to: { name: application.name, address: application.email },
        subject: expect.any(String),
        html: expect.any(String),
      })
    })

    it('should return updated application', () => {
      expect(then.result).toEqual(application)
    })
  })

  describe('staff not found', () => {
    let then: Then

    const id = uuid()
    const applicationUpdate: UpdateApplicationDto = {
      state: ApplicationState.DATANEEDED,
      event: ApplicationEventType.DATANEEDED,
    }
    const staff: User = {
      nationalId: '0000000000',
      scope: [MunicipalitiesFinancialAidScope.employee],
    } as User

    beforeEach(async () => {
      const findStaffByNationalId =
        mockStaffService.findByNationalId as jest.Mock
      findStaffByNationalId.mockReturnValueOnce(Promise.resolve(undefined))

      then = await givenWhenThen(id, applicationUpdate, staff)
    })

    it('should throw forbidden exception', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
    })
  })

  describe('database query fails', () => {
    let then: Then

    const id = uuid()
    const applicationUpdate: UpdateApplicationDto = {
      state: ApplicationState.NEW,
      event: ApplicationEventType.FILEUPLOAD,
    }
    const user: User = {
      nationalId: '0000000000',
      scope: [MunicipalitiesFinancialAidScope.applicant],
    } as User

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
