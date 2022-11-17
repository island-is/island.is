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
  Period as VmstPeriod,
  ParentalLeaveGetPeriodLengthRequest,
  ParentalLeaveGetPeriodEndDateRequest,
  PeriodLengthResponse,
  PeriodEndDateResponse,
} from '@island.is/clients/vmst'
import {
  StartDateOptions,
  YES,
  NO,
  Period,
  calculatePeriodLength,
  PARENTAL_LEAVE,
  PARENTAL_GRANT,
  SINGLE,
} from '@island.is/application/templates/parental-leave'
import { EmailService } from '@island.is/email-service'

import { SharedTemplateApiService } from '../../shared'
import {
  BaseTemplateApiApplicationService,
  TemplateApiModuleActionProps,
} from '../../../types'
import {
  APPLICATION_ATTACHMENT_BUCKET,
  ParentalLeaveService,
} from './parental-leave.service'
import { apiConstants } from './constants'
import { SmsService } from '@island.is/nova-sms'

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
          provide: LOGGER_PROVIDER,
          useValue: logger,
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
          provide: BaseTemplateApiApplicationService,
          useValue: {},
        },
        SharedTemplateApiService,
        {
          provide: APPLICATION_ATTACHMENT_BUCKET,
          useValue: 'attachmentBucket',
        },
      ],
    }).compile()

    parentalLeaveService = module.get(ParentalLeaveService)
    sharedService = module.get(SharedTemplateApiService)
  })

  describe('createPeriodsDTO', () => {
    it('should return 2 periods, one standard and one using the right period code', async () => {
      const application = createApplication()
      const res = await parentalLeaveService.createPeriodsDTO(
        application,
        nationalId,
      )

      expect(res).toEqual([
        {
          from: '2021-05-17',
          to: '2021-11-16',
          ratio: '100',
          approved: false,
          paid: false,
          rightsCodePeriod: 'M-L-GR',
        },
        {
          from: '2021-11-17',
          to: '2022-01-01',
          ratio: '100',
          approved: false,
          paid: false,
          rightsCodePeriod: apiConstants.rights.receivingRightsId,
        },
      ])
    })

    it('should return 2 periods, one standard and one using single parent right code', async () => {
      const application = createApplication()

      set(application, 'answers.otherParent', SINGLE)

      const res = await parentalLeaveService.createPeriodsDTO(
        application,
        nationalId,
      )

      expect(res).toEqual([
        {
          from: '2021-05-17',
          to: '2021-11-16',
          ratio: '100',
          approved: false,
          paid: false,
          rightsCodePeriod: 'M-L-GR',
        },
        {
          from: '2021-11-17',
          to: '2022-01-01',
          ratio: '100',
          approved: false,
          paid: false,
          rightsCodePeriod: apiConstants.rights.artificialInseminationRightsId,
        },
      ])
    })

    it('should return 2 periods, one standard and mark it as ActualDateOfBirth and one using the right period code', async () => {
      const application = createApplication()

      const firstPeriod = get(application.answers, 'periods[0]') as object
      set(
        firstPeriod,
        'firstPeriodStart',
        StartDateOptions.ACTUAL_DATE_OF_BIRTH,
      )

      const res = await parentalLeaveService.createPeriodsDTO(
        application,
        nationalId,
      )

      expect(res).toEqual([
        {
          from: 'date_of_birth',
          to: '2021-11-16',
          ratio: '100',
          approved: false,
          paid: false,
          rightsCodePeriod: 'M-L-GR',
        },
        {
          from: '2021-11-17',
          to: '2022-01-01',
          ratio: '100',
          approved: false,
          paid: false,
          rightsCodePeriod: apiConstants.rights.receivingRightsId,
        },
      ])
    })

    it('should change period ratio to D<number_of_days> when using .daysToUse', async () => {
      const application = createApplication()

      const startDate = new Date(2022, 9, 10)
      const endDate = new Date(2023, 0, 9)
      const ratio = 0.59

      const originalPeriods: Period[] = [
        {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          ratio: `${ratio * 100}`,
          firstPeriodStart: StartDateOptions.ESTIMATED_DATE_OF_BIRTH,
          daysToUse: calculatePeriodLength(
            startDate,
            endDate,
            ratio,
          ).toString(),
        },
      ]

      set(application.answers, 'periods', originalPeriods)

      const expectedPeriods: VmstPeriod[] = [
        {
          approved: false,
          from: originalPeriods[0].startDate,
          to: originalPeriods[0].endDate,
          paid: false,
          ratio: `D${originalPeriods[0].daysToUse}`,
          rightsCodePeriod: 'M-L-GR',
        },
      ]
      const res = await parentalLeaveService.createPeriodsDTO(
        application,
        nationalId,
      )

      expect(res).toEqual(expectedPeriods)
    })
  })

  describe('sendApplication', () => {
    it('should send an email if applicant is employed by an employer and is not reciving benefits', async () => {
      const application = createApplication()
      set(application.answers, 'employer.isSelfEmployed', NO)
      set(application.answers, 'applicationType.option', PARENTAL_LEAVE)
      set(application.answers, 'isRecivingUnemploymentBenefits', NO)
      const mockedSendEmail = jest.fn()

      jest.spyOn(sharedService, 'sendEmail').mockImplementation(mockedSendEmail)

      const auth: TemplateApiModuleActionProps['auth'] = {
        authorization: '',
        client: '',
        nationalId,
        scope: [''],
      }

      await parentalLeaveService.sendApplication({ application, auth })

      // One email to the applicant and one to the employer
      expect(mockedSendEmail.mock.calls.length).toBe(2)
    })

    it('should not send an email if applicant is reciving benefits', async () => {
      const application = createApplication()
      set(application.answers, 'employer.isSelfEmployed', NO)
      set(application.answers, 'applicationType.option', PARENTAL_LEAVE)
      set(application.answers, 'isRecivingUnemploymentBenefits', YES)
      const mockedSendEmail = jest.fn()

      jest.spyOn(sharedService, 'sendEmail').mockImplementation(mockedSendEmail)

      const auth: TemplateApiModuleActionProps['auth'] = {
        authorization: '',
        client: '',
        nationalId,
        scope: [''],
      }

      await parentalLeaveService.sendApplication({ application, auth })

      // One email to the applicant and one to the employer
      expect(mockedSendEmail.mock.calls.length).toBe(0)
    })

    it('should not send an email if applicant is self employed', async () => {
      const application = createApplication()
      set(application.answers, 'employer.isSelfEmployed', YES)

      const mockedSendEmail = jest.fn()

      jest.spyOn(sharedService, 'sendEmail').mockImplementation(mockedSendEmail)

      // Also need to mock the pdf here
      jest
        .spyOn(parentalLeaveService, 'getSelfEmployedPdf')
        .mockImplementation(jest.fn())

      const auth: TemplateApiModuleActionProps['auth'] = {
        authorization: '',
        client: '',
        nationalId,
        scope: [''],
      }

      await parentalLeaveService.sendApplication({ application, auth })

      // No email should be sent since applicant is aware of their own approval
      expect(mockedSendEmail.mock.calls.length).toBe(0)
    })

    it('should not send an email if application is grant', async () => {
      const application = createApplication()
      set(application.answers, 'applicationType.option', PARENTAL_GRANT)

      const mockedSendEmail = jest.fn()

      jest.spyOn(sharedService, 'sendEmail').mockImplementation(mockedSendEmail)

      // Also need to mock the pdf here
      jest
        .spyOn(parentalLeaveService, 'getSelfEmployedPdf')
        .mockImplementation(jest.fn())

      const auth: TemplateApiModuleActionProps['auth'] = {
        authorization: '',
        client: '',
        nationalId,
        scope: [''],
      }

      await parentalLeaveService.sendApplication({ application, auth })

      // No email should be sent since applicant is aware of their own approval
      expect(mockedSendEmail.mock.calls.length).toBe(0)
    })
  })
})
