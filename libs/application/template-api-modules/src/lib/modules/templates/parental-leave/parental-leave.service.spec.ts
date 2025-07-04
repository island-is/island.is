import { Test } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import get from 'lodash/get'
import set from 'lodash/set'
import addDays from 'date-fns/addDays'

import {
  ApplicationWithAttachments as Application,
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  ParentalLeaveApi,
  ApplicationInformationApi,
  Period as VmstPeriod,
  ParentalLeaveGetPeriodLengthRequest,
  ParentalLeaveGetPeriodEndDateRequest,
  PeriodLengthResponse,
  PeriodEndDateResponse,
} from '@island.is/clients/vmst'
import {
  StartDateOptions,
  Period,
  calculatePeriodLength,
  PARENTAL_LEAVE,
  PARENTAL_GRANT,
  SINGLE,
} from '@island.is/application/templates/parental-leave'
import { EmailService } from '@island.is/email-service'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { ParentalLeaveService } from './parental-leave.service'
import { apiConstants } from './constants'
import { SmsService } from '@island.is/nova-sms'
import { ChildrenService } from './children/children.service'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { PaymentService } from '@island.is/application/api/payment'
import { sharedModuleConfig } from '../../shared/shared.config'
import { ApplicationService } from '@island.is/application/api/core'
import { S3Service } from '@island.is/nest/aws'
import { NO, YES } from '@island.is/application/core'

const nationalId = '1234564321'
let id = 0

const sendMail = () => ({
  messageId: 'some id',
})

const sendSms = () => ({
  message: 'some message',
})

class MockEmailService {
  getTransport() {
    return { sendMail }
  }

  sendEmail() {
    return sendMail()
  }
}

class MockSmsService {
  sendSms() {
    return sendSms()
  }
}

const createApplication = (): Application => ({
  answers: {
    applicant: {
      email: 'applicant@applicant.test',
      phoneNumber: '8888888',
    },
    employer: {
      email: 'employer@employer.test',
    },
    payments: {
      bank: '011126111111',
      pensionFund: 'x',
      union: 'y',
    },
    usePrivatePensionFund: 'no',
    periods: [
      {
        ratio: '100',
        useLength: 'no',
        endDate: '2022-01-01',
        startDate: '2021-05-17',
      },
    ],
    employerNationalRegistryId: '1111111119',
    requestRights: {
      requestDays: '45',
      isRequestingRights: 'yes',
    },
    selectedChild: '0',
  },
  applicant: nationalId,
  assignees: [],
  applicantActors: [],
  attachments: {},
  created: new Date(),
  modified: new Date(),
  externalData: {
    children: {
      data: {
        children: [
          {
            hasRights: true,
            remainingDays: 180,
            transferredDays: 45,
            parentalRelation: 'primary',
            expectedDateOfBirth: '2021-05-17',
          },
        ],
        existingApplications: [],
      },
      date: new Date('2021-06-10T11:31:02.641Z'),
      status: 'success',
    },
  },
  id: (id++).toString(),
  state: '',
  typeId: ApplicationTypes.PARENTAL_LEAVE,
  name: '',
  status: ApplicationStatus.IN_PROGRESS,
})

describe('ParentalLeaveService', () => {
  let parentalLeaveService: ParentalLeaveService
  let sharedService: SharedTemplateApiService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ParentalLeaveService,
        {
          provide: PaymentService,
          useValue: {}, //not used
        },
        {
          provide: ChildrenService,
          useValue: {},
        },
        {
          provide: NationalRegistryClientService,
          useValue: {},
        },
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
        {
          provide: ApplicationInformationApi,
          useClass: jest.fn(() => ({
            applicationGetApplicationInformation: () => Promise.reject(),
          })),
        },
        {
          provide: ParentalLeaveApi,
          useClass: jest.fn(() => ({
            parentalLeaveSetParentalLeave: () =>
              Promise.resolve({
                id: '1337',
              }),
            parentalLeaveGetPeriodLength: ({
              startDate,
              endDate,
              percentage,
            }: ParentalLeaveGetPeriodLengthRequest): Promise<PeriodLengthResponse> =>
              Promise.resolve({
                periodLength:
                  startDate && endDate
                    ? calculatePeriodLength(
                        startDate,
                        endDate,
                        Number(percentage) / 100,
                      )
                    : 0,
              }),
            parentalLeaveGetPeriodEndDate: ({
              startDate,
              percentage,
              length,
            }: ParentalLeaveGetPeriodEndDateRequest): Promise<PeriodEndDateResponse> => {
              if (!startDate) {
                throw new Error(
                  'parentalLeaveGetPeriodEndDate: missing start date',
                )
              }

              const ratio = Number(percentage) / 100
              const goalLength = Number(length)
              let calculatedLength = 0
              let currentDate = startDate

              while (calculatedLength <= goalLength) {
                const nextDate = addDays(currentDate, 1)
                calculatedLength = calculatePeriodLength(
                  startDate,
                  nextDate,
                  ratio,
                )

                if (calculatedLength <= goalLength) {
                  currentDate = nextDate
                }
              }

              return Promise.resolve({
                periodEndDate: currentDate,
              })
            },
          })),
        },
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: EmailService,
          useClass: MockEmailService,
        },
        {
          provide: SmsService,
          useClass: MockSmsService,
        },
        {
          provide: sharedModuleConfig.KEY,
          useValue: {},
        },
        {
          provide: ApplicationService,
          useValue: {},
        },
        {
          provide: S3Service,
          useValue: {},
        },
        SharedTemplateApiService,
      ],
    }).compile()

    parentalLeaveService = module.get(ParentalLeaveService)
    sharedService = module.get(SharedTemplateApiService)
  })

  describe('createPeriodsDTO', () => {
    it('should return 2 periods with "M-S-GR,ORLOF-FBF" rightsCodePeriod and ratio in days', async () => {
      const application = createApplication()

      set(application, 'answers.periods[1]', {
        ratio: '80',
        useLength: 'no',
        startDate: '2025-03-12',
        endDate: '2025-09-11',
      })
      const periods = get(application.answers, 'periods') as object as Period[]
      const rights = 'M-S-GR,ORLOF-FBF'

      const res = parentalLeaveService.createPeriodsDTO(periods, false, rights)

      expect(res).toEqual([
        {
          from: '2021-05-17',
          to: '2022-01-01',
          ratio: 'D225',
          approved: false,
          paid: false,
          rightsCodePeriod: rights,
        },
        {
          from: '2025-03-12',
          to: '2025-09-11',
          ratio: 'D144',
          approved: false,
          paid: false,
          rightsCodePeriod: rights,
        },
      ])
    })
    it('Should return date_of_birth_months if actualDateOfBirth, useLength is NO and endDateAdjustLength includes YES', async () => {
      const application = createApplication()

      set(application, 'answers.periods', [
        {
          ratio: '100',
          endDate: '2025-07-16',
          startDate: '2025-07-02',
          useLength: 'no',
          firstPeriodStart: 'actualDateOfBirth',
          endDateAdjustLength: ['yes'],
        },
        {
          ratio: '100',
          endDate: '2025-07-31',
          startDate: '2025-07-17',
          useLength: 'no',
          firstPeriodStart: 'specificDate',
        },
      ])
      const periods = get(application.answers, 'periods') as object as Period[]
      const rights = 'M-S-GR,ORLOF-FBF'

      const res = parentalLeaveService.createPeriodsDTO(periods, true, rights)

      expect(res).toEqual([
        {
          from: 'date_of_birth_months',
          to: '2025-07-16',
          ratio: 'D15',
          approved: false,
          paid: false,
          rightsCodePeriod: rights,
        },
        {
          from: '2025-07-17',
          to: '2025-07-31',
          ratio: 'D14',
          approved: false,
          paid: false,
          rightsCodePeriod: rights,
        },
      ])
    })

    it('Should return date_of_birth if actualDateOfBirth, useLength is NO and endDateAdjustLength does not include YES', async () => {
      const application = createApplication()

      set(application, 'answers.periods', [
        {
          ratio: '100',
          endDate: '2025-07-16',
          startDate: '2025-07-02',
          useLength: 'no',
          firstPeriodStart: 'actualDateOfBirth',
          endDateAdjustLength: [],
        },
        {
          ratio: '100',
          endDate: '2025-07-31',
          startDate: '2025-07-17',
          useLength: 'no',
          firstPeriodStart: 'specificDate',
        },
      ])
      const periods = get(application.answers, 'periods') as object as Period[]
      const rights = 'M-S-GR,ORLOF-FBF'

      const res = parentalLeaveService.createPeriodsDTO(periods, true, rights)

      expect(res).toEqual([
        {
          from: 'date_of_birth',
          to: '2025-07-16',
          ratio: 'D15',
          approved: false,
          paid: false,
          rightsCodePeriod: rights,
        },
        {
          from: '2025-07-17',
          to: '2025-07-31',
          ratio: 'D14',
          approved: false,
          paid: false,
          rightsCodePeriod: rights,
        },
      ])
    })
  })

  describe('createRightsDTO', () => {
    it('should return 2 applicationRights, basic rights, single parent rights, and multiple Birth', async () => {
      const application = createApplication()

      set(application, 'answers.periods[1]', {
        ratio: '100',
        useLength: 'no',
        startDate: '2025-03-12',
        endDate: '2025-09-14',
      })
      set(application, 'answers.multipleBirths.hasMultipleBirths', YES)
      set(application, 'answers.multipleBirthsRequestDays', 79)
      set(application, 'answers.multipleBirths.multipleBirths', 2)
      set(application, 'answers.otherParentObj.chooseOtherParent', SINGLE)

      const res = await parentalLeaveService.createRightsDTO(application)

      expect(res).toEqual([
        {
          days: '180',
          daysLeft: '0',
          months: '6.0',
          rightsDescription: 'Grunnréttur móður',
          rightsUnit: 'M-L-GR',
        },
        {
          days: '180',
          daysLeft: '0',
          months: '6.0',
          rightsDescription: 'Eitt foreldri',
          rightsUnit: 'EITTFOR',
        },
        {
          days: '180',
          daysLeft: '132',
          months: '6.0',
          rightsDescription: 'Fjölburafæðing (orlof)',
          rightsUnit: 'ORLOF-FBF',
        },
      ])
    })

    it('should return 1 applicationRights, basic rights', async () => {
      const application = createApplication()

      set(application, 'answers.requestRights', {})

      const res = await parentalLeaveService.createRightsDTO(application)

      expect(res).toEqual([
        {
          days: '180',
          daysLeft: '0',
          months: '6.0',
          rightsDescription: 'Grunnréttur móður',
          rightsUnit: 'M-L-GR',
        },
      ])
    })

    it('should return 2 applicationRights, basic rights, multiple Birth', async () => {
      const application = createApplication()

      set(application, 'answers.multipleBirths.hasMultipleBirths', YES)
      set(application, 'answers.multipleBirthsRequestDays', 79)
      set(application, 'answers.multipleBirths.multipleBirths', 2)

      const res = await parentalLeaveService.createRightsDTO(application)

      expect(res).toEqual([
        {
          days: '180',
          daysLeft: '0',
          months: '6.0',
          rightsDescription: 'Grunnréttur móður',
          rightsUnit: 'M-L-GR',
        },
        {
          days: '79',
          daysLeft: '34',
          months: '2.6',
          rightsDescription: 'Fjölburafæðing (orlof)',
          rightsUnit: 'ORLOF-FBF',
        },
      ])
    })

    it('should return 2 applicationRights, one basic rights and one for rights transfer', async () => {
      const application = createApplication()

      set(application, 'answers.periods[0]', {
        ratio: '100',
        useLength: 'no',
        startDate: '2025-03-12',
        endDate: '2025-09-14',
      })

      const res = await parentalLeaveService.createRightsDTO(application)

      expect(res).toEqual([
        {
          days: '180',
          daysLeft: '0',
          months: '6.0',
          rightsDescription: 'Grunnréttur móður',
          rightsUnit: 'M-L-GR',
        },
        {
          days: '45',
          daysLeft: '42',
          months: '1.5',
          rightsDescription: 'Framsal grunnréttur',
          rightsUnit: 'FSAL-GR',
        },
      ])
    })
  })

  describe('sendApplication', () => {
    it('should send an email if applicant is employed by an employer and is not reciving benefits', async () => {
      const application = createApplication()
      set(application.answers, 'employment.isSelfEmployed', NO)
      set(application.answers, 'applicationType.option', PARENTAL_LEAVE)
      set(application.answers, 'employment.isReceivingUnemploymentBenefits', NO)
      const mockedSendEmail = jest.fn()

      jest.spyOn(sharedService, 'sendEmail').mockImplementation(mockedSendEmail)

      const auth: TemplateApiModuleActionProps['auth'] = {
        authorization: '',
        client: '',
        nationalId,
        scope: [''],
      }

      await parentalLeaveService.sendApplication({
        application,
        auth,
        currentUserLocale: 'is',
      })

      // One email to the applicant and one to the employer
      expect(mockedSendEmail.mock.calls.length).toBe(2)
    })

    it('should not send an email if applicant is reciving benefits', async () => {
      const application = createApplication()
      set(application.answers, 'employment.isSelfEmployed', NO)
      set(application.answers, 'applicationType.option', PARENTAL_LEAVE)
      set(
        application.answers,
        'employment.isReceivingUnemploymentBenefits',
        YES,
      )
      const mockedSendEmail = jest.fn()

      jest.spyOn(sharedService, 'sendEmail').mockImplementation(mockedSendEmail)

      const auth: TemplateApiModuleActionProps['auth'] = {
        authorization: '',
        client: '',
        nationalId,
        scope: [''],
      }

      await parentalLeaveService.sendApplication({
        application,
        auth,
        currentUserLocale: 'is',
      })

      // One email to the applicant and one to the employer
      expect(mockedSendEmail.mock.calls.length).toBe(0)
    })

    it('should not send an email if applicant is self employed', async () => {
      const application = createApplication()
      set(application.answers, 'employment.isSelfEmployed', YES)

      const mockedSendEmail = jest.fn()

      jest.spyOn(sharedService, 'sendEmail').mockImplementation(mockedSendEmail)

      // Also need to mock the pdf here
      jest.spyOn(parentalLeaveService, 'getPdf').mockImplementation(jest.fn())

      const auth: TemplateApiModuleActionProps['auth'] = {
        authorization: '',
        client: '',
        nationalId,
        scope: [''],
      }

      await parentalLeaveService.sendApplication({
        application,
        auth,
        currentUserLocale: 'is',
      })

      // No email should be sent since applicant is aware of their own approval
      expect(mockedSendEmail.mock.calls.length).toBe(0)
    })

    it('should not send an email if application is grant', async () => {
      const application = createApplication()
      set(application.answers, 'applicationType.option', PARENTAL_GRANT)

      const mockedSendEmail = jest.fn()

      jest.spyOn(sharedService, 'sendEmail').mockImplementation(mockedSendEmail)

      // Also need to mock the pdf here
      jest.spyOn(parentalLeaveService, 'getPdf').mockImplementation(jest.fn())

      const auth: TemplateApiModuleActionProps['auth'] = {
        authorization: '',
        client: '',
        nationalId,
        scope: [''],
      }

      await parentalLeaveService.sendApplication({
        application,
        auth,
        currentUserLocale: 'is',
      })

      // No email should be sent since applicant is aware of their own approval
      expect(mockedSendEmail.mock.calls.length).toBe(0)
    })
  })
})
