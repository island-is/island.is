import { EmailService } from '@island.is/email-service'
import {
  ApplicationState,
  Employment,
  FamilyStatus,
  FileType,
  HomeCircumstances,
  Municipality,
  RolesRule,
  User,
} from '@island.is/financial-aid/shared/lib'
import { uuid } from 'uuidv4'
import { ApplicationEventService } from '../../applicationEvent'
import { FileService } from '../../file/file.service'
import { MunicipalityService } from '../../municipality/municipality.service'
import { CreateApplicationDto } from '../dto'
import { ApplicationModel } from '../models/application.model'
import { createTestingApplicationModule } from './createTestingApplicationModule'

interface Then {
  result: ApplicationModel
  error: Error
}

type GivenWhenThen = (
  user: User,
  application: CreateApplicationDto,
) => Promise<Then>

describe.only('ApplicationController - Create', () => {
  let givenWhenThen: GivenWhenThen
  let mockApplicationModel: typeof ApplicationModel
  let mockApplicationEventService: ApplicationEventService
  let mockFileService: FileService
  let mockEmailService: EmailService
  let mockMunicipalityService: MunicipalityService

  beforeEach(async () => {
    const {
      applicationController,
      applicationModel,
      applicationEventService,
      fileService,
      emailService,
      municipalityService,
    } = await createTestingApplicationModule()

    mockApplicationModel = applicationModel
    mockApplicationEventService = applicationEventService
    mockFileService = fileService
    mockEmailService = emailService
    mockMunicipalityService = municipalityService

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

    const application: CreateApplicationDto = {
      state: ApplicationState.NEW,
      nationalId: '0000000000',
      name: 'Tester',
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
      familyStatus: FamilyStatus.COHABITATION,
      city: '',
      postalCode: '',
      municipalityCode: '',
      streetName: '',
      homeCircumstancesCustom: '',
    }
    const user: User = {
      nationalId: '0000000000',
      name: 'The User',
      folder: uuid(),
      service: RolesRule.OSK,
    }

    beforeEach(async () => {
      mockCreate = mockApplicationModel.create as jest.Mock

      await givenWhenThen(user, application)
    })

    it('should request staff by national id from the database', () => {
      expect(mockCreate).toHaveBeenCalledWith(application)
    })
  })

  describe('application created without spouse and without files', () => {
    let then: Then

    const id = uuid()

    const application: CreateApplicationDto = {
      state: ApplicationState.NEW,
      nationalId: '0000000000',
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
      files: [],
      amount: 0,
      spouseName: '',
      spouseNationalId: undefined,
      spouseEmail: '',
      familyStatus: FamilyStatus.COHABITATION,
      city: '',
      postalCode: '',
      municipalityCode: '3',
      streetName: '',
      homeCircumstancesCustom: '',
      employmentCustom: '',
    }
    const user: User = {
      nationalId: '0000000000',
      name: 'The User',
      folder: uuid(),
      service: RolesRule.OSK,
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
      const findByMunicipalityId = mockMunicipalityService.findByMunicipalityId as jest.Mock
      findByMunicipalityId.mockReturnValueOnce(Promise.resolve(municipality))

      then = await givenWhenThen(user, application)
    })

    it('should call application event service with correct parameters', () => {
      expect(mockApplicationEventService.create).toHaveBeenCalledWith({
        applicationId: id,
        eventType: 'New',
      })
    })

    it('should not call file service', () => {
      expect(mockFileService.createFile).not.toHaveBeenCalled()
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

    it('should return application', () => {
      expect(then.result).toEqual(appModel)
    })
  })

  describe('application created with spouse', () => {
    let then: Then

    const id = uuid()

    const application: CreateApplicationDto = {
      state: ApplicationState.NEW,
      nationalId: '0000000000',
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
      files: [],
      amount: 0,
      spouseName: 'Spouse name',
      spouseNationalId: '9999999999',
      spouseEmail: 'spouse email',
      familyStatus: FamilyStatus.COHABITATION,
      city: '',
      postalCode: '',
      municipalityCode: '3',
      streetName: '',
      homeCircumstancesCustom: '',
      employmentCustom: '',
    }
    const user: User = {
      nationalId: '0000000000',
      name: 'The User',
      folder: uuid(),
      service: RolesRule.OSK,
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
      const findByMunicipalityId = mockMunicipalityService.findByMunicipalityId as jest.Mock
      findByMunicipalityId.mockReturnValueOnce(Promise.resolve(municipality))

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

    const application: CreateApplicationDto = {
      state: ApplicationState.NEW,
      nationalId: '0000000000',
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
      files: [
        { name: 'name', key: 'key', size: 10, type: FileType.INCOME },
        { name: 'name2', key: 'key2', size: 14, type: FileType.TAXRETURN },
      ],
      amount: 0,
      spouseName: undefined,
      spouseNationalId: undefined,
      spouseEmail: undefined,
      familyStatus: FamilyStatus.COHABITATION,
      city: '',
      postalCode: '',
      municipalityCode: '3',
      streetName: '',
      homeCircumstancesCustom: '',
      employmentCustom: '',
    }
    const user: User = {
      nationalId: '0000000000',
      name: 'The User',
      folder: uuid(),
      service: RolesRule.OSK,
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

  describe('database query fails', () => {
    let then: Then

    const application: CreateApplicationDto = {
      state: ApplicationState.NEW,
      nationalId: '0000000000',
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
      files: [],
      amount: 0,
      spouseName: '',
      spouseNationalId: '',
      spouseEmail: '',
      familyStatus: FamilyStatus.COHABITATION,
      city: '',
      postalCode: '',
      municipalityCode: '',
      streetName: '',
      homeCircumstancesCustom: '',
      employmentCustom: '',
    }
    const user: User = {
      nationalId: '0000000000',
      name: 'The User',
      folder: uuid(),
      service: RolesRule.OSK,
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
