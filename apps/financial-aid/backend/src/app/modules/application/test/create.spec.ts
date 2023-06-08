import { EmailService } from '@island.is/email-service'
import {
  ApplicationState,
  Employment,
  FamilyStatus,
  FileType,
  HomeCircumstances,
  Municipality,
  User,
  UserType,
} from '@island.is/financial-aid/shared/lib'
import { ForbiddenException } from '@nestjs/common'
import { firstDateOfMonth } from '@island.is/financial-aid/shared/lib'
import { Op } from 'sequelize'
import { uuid } from 'uuidv4'
import { ApplicationEventService } from '../../applicationEvent'
import { FileService } from '../../file/file.service'
import { MunicipalityService } from '../../municipality/municipality.service'
import { CreateApplicationDto } from '../dto'
import { ApplicationModel } from '../models/application.model'
import { createTestingApplicationModule } from './createTestingApplicationModule'
import { DirectTaxPaymentService } from '../../directTaxPayment'

interface Then {
  result: ApplicationModel
  error: Error
}

type GivenWhenThen = (
  user: User,
  application: CreateApplicationDto,
) => Promise<Then>

describe('ApplicationController - Create', () => {
  let givenWhenThen: GivenWhenThen
  let mockApplicationModel: typeof ApplicationModel
  let mockApplicationEventService: ApplicationEventService
  let mockFileService: FileService
  let mockEmailService: EmailService
  let mockMunicipalityService: MunicipalityService
  let mockDirectTaxPaymentService: DirectTaxPaymentService

  beforeEach(async () => {
    const {
      applicationController,
      applicationModel,
      applicationEventService,
      fileService,
      emailService,
      municipalityService,
      directTaxPaymentService,
    } = await createTestingApplicationModule()

    mockApplicationModel = applicationModel
    mockApplicationEventService = applicationEventService
    mockFileService = fileService
    mockEmailService = emailService
    mockMunicipalityService = municipalityService
    mockDirectTaxPaymentService = directTaxPaymentService

    givenWhenThen = async (
      user: User,
      application: CreateApplicationDto,
    ): Promise<Then> => {
      const then = {} as Then

      await applicationController
        .create(user, application)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('database query', () => {
    let mockCreate: jest.Mock
    let mockFindOne: jest.Mock

    const user: User = {
      nationalId: '0000000000',
      name: 'The User',
    }

    const application: CreateApplicationDto = {
      state: ApplicationState.NEW,
      name: user.name,
      phoneNumber: '',
      email: 'Some mail',
      homeCircumstances: HomeCircumstances.UNKNOWN,
      employment: Employment.WORKING,
      employmentCustom: '',
      student: false,
      studentCustom: '',
      usePersonalTaxCredit: false,
      bankNumber: '',
      ledger: '',
      accountNumber: '',
      interview: false,
      hasIncome: false,
      formComment: '',
      files: [],
      amount: 0,
      spouseName: '',
      spouseNationalId: '',
      spouseEmail: '',
      spousePhoneNumber: '',
      spouseFormComment: '',
      familyStatus: FamilyStatus.COHABITATION,
      city: '',
      postalCode: '',
      municipalityCode: '',
      streetName: '',
      homeCircumstancesCustom: '',
      directTaxPayments: [],
      hasFetchedDirectTaxPayment: false,
      applicationSystemId: '',
      nationalId: user.nationalId,
      spouseHasFetchedDirectTaxPayment: false,
    }

    beforeEach(async () => {
      mockCreate = mockApplicationModel.create as jest.Mock
      mockFindOne = mockApplicationModel.findOne as jest.Mock
      const mockFindApplication = mockApplicationModel.findOne as jest.Mock
      mockFindApplication.mockReturnValueOnce(null)

      await givenWhenThen(user, application)
    })

    it('should call create on model with application', () => {
      expect(mockCreate).toHaveBeenCalledWith({
        nationalId: user.nationalId,
        ...application,
      })
    })

    it('should call find one on model with applicant national id', () => {
      expect(mockFindOne).toHaveBeenCalledWith({
        where: {
          [Op.or]: [
            {
              nationalId: user.nationalId,
            },
            {
              spouseNationalId: user.nationalId,
            },
          ],
          created: { [Op.gte]: firstDateOfMonth() },
        },
      })
    })
  })

  describe('application created without spouse, without direct tax payments and without files', () => {
    let then: Then

    const id = uuid()

    const user: User = {
      nationalId: '0000000000',
      name: 'The User',
    }

    const application: CreateApplicationDto = {
      state: ApplicationState.NEW,
      name: user.name,
      phoneNumber: '',
      email: 'Some mail',
      homeCircumstances: HomeCircumstances.UNKNOWN,
      employment: Employment.WORKING,
      student: false,
      studentCustom: '',
      usePersonalTaxCredit: false,
      bankNumber: '',
      ledger: '',
      accountNumber: '',
      interview: false,
      hasIncome: false,
      formComment: '',
      files: [],
      amount: 0,
      spouseName: '',
      spouseNationalId: undefined,
      spouseEmail: '',
      spousePhoneNumber: '',
      spouseFormComment: '',
      familyStatus: FamilyStatus.COHABITATION,
      city: '',
      postalCode: '',
      municipalityCode: '3',
      streetName: '',
      homeCircumstancesCustom: '',
      employmentCustom: '',
      directTaxPayments: [],
      hasFetchedDirectTaxPayment: false,
      applicationSystemId: '',
      nationalId: user.nationalId,
      spouseHasFetchedDirectTaxPayment: false,
    }

    const municipality: Municipality = {
      id: application.municipalityCode,
      name: 'Sveitarfélag',
      homepage: 'homepage',
      rulesHomepage: 'rulesHomepage',
      active: false,
      municipalityId: '',
      individualAid: undefined,
      cohabitationAid: undefined,
      usingNav: false,
    }

    const appModel = {
      id,
      state: application.state,
      created: new Date(),
      email: application.email,
    }

    beforeEach(async () => {
      const mockCreate = mockApplicationModel.create as jest.Mock
      mockCreate.mockReturnValueOnce(appModel)
      const findByMunicipalityId =
        mockMunicipalityService.findByMunicipalityId as jest.Mock
      findByMunicipalityId.mockReturnValueOnce(Promise.resolve(municipality))
      const mockFindApplication = mockApplicationModel.findOne as jest.Mock
      mockFindApplication.mockReturnValueOnce(null)

      then = await givenWhenThen(user, application)
    })

    it('should call application event service with correct parameters', () => {
      expect(mockApplicationEventService.create).toHaveBeenCalledWith({
        applicationId: id,
        eventType: 'New',
        emailSent: true,
      })
    })

    it('should not call file service', () => {
      expect(mockFileService.createFile).not.toHaveBeenCalled()
    })

    it('should not call direct tax payment service', () => {
      expect(mockDirectTaxPaymentService.create).not.toHaveBeenCalled()
    })

    it('should call municipality service with municipality code', () => {
      expect(mockMunicipalityService.findByMunicipalityId).toHaveBeenCalledWith(
        application.municipalityCode,
      )
    })

    it('should call email service with correct params', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith({
        from: { name: 'Samband íslenskra sveitarfélaga', address: undefined },
        replyTo: {
          name: 'Samband íslenskra sveitarfélaga',
          address: undefined,
        },
        to: { name: user.name, address: application.email },
        subject: expect.any(String),
        html: expect.any(String),
      })
    })

    it('should call email service once since there is no spouse', () => {
      expect(mockEmailService.sendEmail).toBeCalledTimes(1)
    })

    it('should not return application, since we have to wait for spouse', () => {
      expect(then.result).toEqual(undefined)
    })
  })

  describe('application created with spouse', () => {
    let then: Then

    const id = uuid()

    const user: User = {
      nationalId: '0000000000',
      name: 'The User',
    }

    const application: CreateApplicationDto = {
      state: ApplicationState.NEW,
      name: user.name,
      phoneNumber: '',
      email: 'Some mail',
      homeCircumstances: HomeCircumstances.UNKNOWN,
      employment: Employment.WORKING,
      student: false,
      studentCustom: '',
      usePersonalTaxCredit: false,
      bankNumber: '',
      ledger: '',
      accountNumber: '',
      interview: false,
      hasIncome: false,
      formComment: '',
      files: [],
      amount: 0,
      spouseName: 'Spouse name',
      spouseNationalId: '9999999999',
      spouseEmail: 'spouse email',
      spousePhoneNumber: '5555555',
      spouseFormComment: 'Spouse comment',
      familyStatus: FamilyStatus.COHABITATION,
      city: '',
      postalCode: '',
      municipalityCode: '3',
      streetName: '',
      homeCircumstancesCustom: '',
      employmentCustom: '',
      directTaxPayments: [],
      hasFetchedDirectTaxPayment: false,
      applicationSystemId: null,
      nationalId: user.nationalId,
      spouseHasFetchedDirectTaxPayment: false,
    }

    const municipality: Municipality = {
      id: application.municipalityCode,
      name: 'Sveitarfélag',
      homepage: 'homepage',
      rulesHomepage: 'rulesHomepage',
      active: false,
      municipalityId: '',
      individualAid: undefined,
      cohabitationAid: undefined,
      usingNav: false,
    }

    const appModel = {
      id,
      state: application.state,
      created: new Date(),
      email: application.email,
      spouseEmail: application.spouseEmail,
      spouseName: application.spouseName,
    }

    beforeEach(async () => {
      const mockCreate = mockApplicationModel.create as jest.Mock
      mockCreate.mockReturnValueOnce(appModel)
      const findByMunicipalityId =
        mockMunicipalityService.findByMunicipalityId as jest.Mock
      findByMunicipalityId.mockReturnValueOnce(Promise.resolve(municipality))
      const mockFindApplication = mockApplicationModel.findOne as jest.Mock
      mockFindApplication.mockReturnValueOnce(null)

      then = await givenWhenThen(user, application)
    })

    it('should call email service with applicant params', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith({
        from: { name: 'Samband íslenskra sveitarfélaga', address: undefined },
        replyTo: {
          name: 'Samband íslenskra sveitarfélaga',
          address: undefined,
        },
        to: { name: user.name, address: application.email },
        subject: expect.any(String),
        html: expect.any(String),
      })
    })

    it('should call email service with spouse params', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith({
        from: { name: 'Samband íslenskra sveitarfélaga', address: undefined },
        replyTo: {
          name: 'Samband íslenskra sveitarfélaga',
          address: undefined,
        },
        to: { name: application.spouseName, address: application.spouseEmail },
        subject: expect.any(String),
        html: expect.any(String),
      })
    })

    it('should call email service twice', () => {
      expect(mockEmailService.sendEmail).toBeCalledTimes(2)
    })
  })

  describe('application created with files', () => {
    let then: Then

    const id = uuid()

    const user: User = {
      nationalId: '0000000000',
      name: 'The User',
    }

    const application: CreateApplicationDto = {
      state: ApplicationState.NEW,
      name: user.name,
      phoneNumber: '',
      email: 'Some mail',
      homeCircumstances: HomeCircumstances.UNKNOWN,
      employment: Employment.WORKING,
      student: false,
      studentCustom: '',
      usePersonalTaxCredit: false,
      bankNumber: '',
      ledger: '',
      accountNumber: '',
      interview: false,
      hasIncome: false,
      formComment: '',
      files: [
        { name: 'name', key: 'key', size: 10, type: FileType.INCOME },
        { name: 'name2', key: 'key2', size: 14, type: FileType.TAXRETURN },
      ],
      amount: 0,
      spouseName: undefined,
      spouseNationalId: undefined,
      spouseEmail: undefined,
      spousePhoneNumber: undefined,
      spouseFormComment: undefined,
      familyStatus: FamilyStatus.COHABITATION,
      city: '',
      postalCode: '',
      municipalityCode: '3',
      streetName: '',
      homeCircumstancesCustom: '',
      employmentCustom: '',
      directTaxPayments: [],
      hasFetchedDirectTaxPayment: false,
      applicationSystemId: '',
      nationalId: user.nationalId,
      spouseHasFetchedDirectTaxPayment: false,
    }

    const appModel = {
      id,
      state: application.state,
      created: new Date(),
      email: application.email,
    }

    beforeEach(async () => {
      const mockCreate = mockApplicationModel.create as jest.Mock
      mockCreate.mockReturnValueOnce(appModel)

      const mockFindApplication = mockApplicationModel.findOne as jest.Mock
      mockFindApplication.mockReturnValueOnce(null)

      then = await givenWhenThen(user, application)
    })

    it('should call file service with files', () => {
      application.files.map((f) => {
        expect(mockFileService.createFile).toHaveBeenCalledWith({
          applicationId: id,
          name: f.name,
          key: f.key,
          size: f.size,
          type: f.type,
        })
      })
    })

    it('should call file service twice', () => {
      expect(mockFileService.createFile).toBeCalledTimes(2)
    })
  })

  describe('application created with direct tax payments', () => {
    let then: Then

    const id = uuid()

    const application: CreateApplicationDto = {
      state: ApplicationState.NEW,
      name: 'Tester',
      phoneNumber: '',
      email: 'Some mail',
      homeCircumstances: HomeCircumstances.UNKNOWN,
      employment: Employment.WORKING,
      student: false,
      studentCustom: '',
      usePersonalTaxCredit: false,
      bankNumber: '',
      ledger: '',
      accountNumber: '',
      interview: false,
      hasIncome: false,
      formComment: '',
      files: undefined,
      amount: 0,
      spouseName: undefined,
      spouseNationalId: undefined,
      spouseEmail: undefined,
      spousePhoneNumber: undefined,
      spouseFormComment: undefined,
      familyStatus: FamilyStatus.COHABITATION,
      city: '',
      postalCode: '',
      municipalityCode: '3',
      streetName: '',
      homeCircumstancesCustom: '',
      employmentCustom: '',
      hasFetchedDirectTaxPayment: true,
      directTaxPayments: [
        {
          totalSalary: 1,
          payerNationalId: 'payer-national-id',
          personalAllowance: 2,
          withheldAtSource: 3,
          month: 4,
          year: 2022,
          userType: UserType.APPLICANT,
        },
        {
          totalSalary: 5,
          payerNationalId: 'spouse-payer-national-id',
          personalAllowance: 6,
          withheldAtSource: 7,
          month: 8,
          year: 2022,
          userType: UserType.SPOUSE,
        },
      ],
      applicationSystemId: '',
      nationalId: '',
      spouseHasFetchedDirectTaxPayment: false,
    }
    const user: User = {
      nationalId: '0000000000',
      name: 'The User',
    }

    const appModel = {
      id,
      state: application.state,
      created: new Date(),
      email: application.email,
    }

    beforeEach(async () => {
      const mockCreate = mockApplicationModel.create as jest.Mock
      mockCreate.mockReturnValueOnce(appModel)

      const mockFindApplication = mockApplicationModel.findOne as jest.Mock
      mockFindApplication.mockReturnValueOnce(null)

      then = await givenWhenThen(user, application)
    })

    it('should call direct tax payment service with payments', () => {
      application.directTaxPayments.map((d) => {
        expect(mockDirectTaxPaymentService.create).toHaveBeenCalledWith({
          applicationId: id,
          totalSalary: d.totalSalary,
          payerNationalId: d.payerNationalId,
          personalAllowance: d.personalAllowance,
          withheldAtSource: d.withheldAtSource,
          month: d.month,
          year: d.year,
          userType: d.userType,
        })
      })
    })

    it('should call direct tax payment service twice', () => {
      expect(mockDirectTaxPaymentService.create).toBeCalledTimes(2)
    })
  })

  describe('applicant has applied for period', () => {
    let then: Then

    const id = uuid()

    const user: User = {
      nationalId: '0000000000',
      name: 'The User',
    }

    const application: CreateApplicationDto = {
      state: ApplicationState.NEW,
      name: user.name,
      phoneNumber: '',
      email: 'Some mail',
      homeCircumstances: HomeCircumstances.UNKNOWN,
      employment: Employment.WORKING,
      student: false,
      studentCustom: '',
      usePersonalTaxCredit: false,
      bankNumber: '',
      ledger: '',
      accountNumber: '',
      interview: false,
      hasIncome: false,
      formComment: '',
      files: [
        { name: 'name', key: 'key', size: 10, type: FileType.INCOME },
        { name: 'name2', key: 'key2', size: 14, type: FileType.TAXRETURN },
      ],
      amount: 0,
      spouseName: undefined,
      spouseNationalId: undefined,
      spouseEmail: undefined,
      spousePhoneNumber: undefined,
      spouseFormComment: undefined,
      familyStatus: FamilyStatus.COHABITATION,
      city: '',
      postalCode: '',
      municipalityCode: '3',
      streetName: '',
      homeCircumstancesCustom: '',
      employmentCustom: '',
      directTaxPayments: [],
      hasFetchedDirectTaxPayment: false,
      applicationSystemId: '',
      nationalId: user.nationalId,
      spouseHasFetchedDirectTaxPayment: false,
    }

    const appModel = {
      id,
      state: application.state,
      created: new Date(),
      email: application.email,
    }

    beforeEach(async () => {
      const mockFindApplication = mockApplicationModel.findOne as jest.Mock
      mockFindApplication.mockReturnValueOnce({ id: '10' } as ApplicationModel)

      then = await givenWhenThen(user, application)
    })

    it('should throw forbidden exception', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
    })
  })

  describe('database query fails', () => {
    let then: Then

    const user: User = {
      nationalId: '0000000000',
      name: 'The User',
    }

    const application: CreateApplicationDto = {
      state: ApplicationState.NEW,
      name: user.name,
      phoneNumber: '',
      email: 'Some mail',
      homeCircumstances: HomeCircumstances.UNKNOWN,
      employment: Employment.WORKING,
      student: false,
      studentCustom: '',
      usePersonalTaxCredit: false,
      bankNumber: '',
      ledger: '',
      accountNumber: '',
      interview: false,
      hasIncome: false,
      formComment: '',
      files: [],
      amount: 0,
      spouseName: '',
      spouseNationalId: '',
      spouseEmail: '',
      spousePhoneNumber: '',
      spouseFormComment: '',
      familyStatus: FamilyStatus.COHABITATION,
      city: '',
      postalCode: '',
      municipalityCode: '',
      streetName: '',
      homeCircumstancesCustom: '',
      employmentCustom: '',
      directTaxPayments: [],
      hasFetchedDirectTaxPayment: false,
      applicationSystemId: '',
      nationalId: user.nationalId,
      spouseHasFetchedDirectTaxPayment: false,
    }

    beforeEach(async () => {
      const mockCreate = mockApplicationModel.create as jest.Mock
      mockCreate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(user, application)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
