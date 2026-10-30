import { Test } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import get from 'lodash/get'
import set from 'lodash/set'
import addDays from 'date-fns/addDays'

import {
  ApplicationWithAttachments as Application,
  ApplicationStatus,
  ApplicationTypes,
  NotificationType,
} from '@island.is/application/types'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  ParentalLeaveApi,
  ApplicationApi,
  ParentalLeaveGetPeriodLengthRequest,
  ParentalLeaveGetPeriodEndDateRequest,
  PeriodLengthResponse,
  PeriodEndDateResponse,
} from '@island.is/clients/vmst'
import {
  Period,
  calculatePeriodLength,
  errorMessages,
  getApplicationExternalData,
  PARENTAL_LEAVE,
  PARENTAL_GRANT,
  RejectedBy,
  SINGLE,
} from '@island.is/application/templates/parental-leave'
import { EmailService } from '@island.is/email-service'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { ParentalLeaveService } from './parental-leave.service'
import { SmsService } from '@island.is/nova-sms'
import { ChildrenService } from './children/children.service'
import { PaymentService } from '@island.is/application/api/payment'
import { sharedModuleConfig } from '../../shared/shared.config'
import { S3Service } from '@island.is/nest/aws'
import { ApplicationService } from '@island.is/application/api/core'
import { NO, YES } from '@island.is/application/core'
import { NationalRegistryV3Service } from '../../shared/api/national-registry-v3/national-registry-v3.service'
import { NotificationsService } from '../../../notification/notifications.service'

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

// A follow-up of a leave VMST lists for the applicant, as the children
// provider stores it.
const asVmstFollowUp = (
  application: Application,
  vmstApplicationId = 'root-application-id',
) => {
  set(application, 'answers.initialQuery', vmstApplicationId)
  set(application, 'externalData.children.data.childApplicationLinks', [
    { childKey: `vmst:${vmstApplicationId}`, vmstApplicationId },
  ])
  return application
}

describe('ParentalLeaveService', () => {
  let parentalLeaveService: ParentalLeaveService
  let sharedService: SharedTemplateApiService
  let applicationGetApplication: jest.Mock
  let parentalLeaveGetParentalLeaves: jest.Mock
  let sendNotification: jest.Mock

  beforeEach(async () => {
    sendNotification = jest.fn(() => Promise.resolve({ id: 'notification' }))
    applicationGetApplication = jest.fn(() => Promise.reject())
    parentalLeaveGetParentalLeaves = jest.fn(() =>
      Promise.resolve({ parentalLeaves: [] }),
    )

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
          provide: NationalRegistryV3Service,
          useValue: {},
        },
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
        {
          provide: ApplicationApi,
          useClass: jest.fn(() => ({
            applicationGetApplication,
          })),
        },
        {
          provide: ParentalLeaveApi,
          useClass: jest.fn(() => ({
            parentalLeaveGetParentalLeaves,
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
          useValue: {
            get: (key: string) =>
              key === 'SharedModuleConfig.clientLocationOrigin'
                ? 'https://island.is/umsoknir'
                : undefined,
          },
        },
        {
          provide: NotificationsService,
          useValue: { sendNotification },
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
          // Needed by SharedTemplateApiService
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

  describe('notifyApplicantOfRejection', () => {
    it.each([
      [RejectedBy.OTHER_PARENT, 'Hitt foreldrið'],
      [RejectedBy.EMPLOYER, 'Vinnuveitandi'],
      [RejectedBy.VMST, 'Vinnumálastofnun'],
    ])(
      'should send the applicant a Hnipp when rejected by %s',
      async (rejectedBy, rejectedByName) => {
        const application = createApplication()
        set(application.answers, 'rejectedBy', rejectedBy)

        await parentalLeaveService.notifyApplicantOfRejection({
          application,
        } as TemplateApiModuleActionProps)

        expect(sendNotification).toHaveBeenCalledWith({
          type: NotificationType.ParentalLeaveRejected,
          messageParties: { recipient: application.applicant },
          applicationId: application.id,
          args: {
            rejectedBy: rejectedByName,
            applicationLink: `https://island.is/umsoknir/faedingarorlof/${application.id}`,
          },
        })
      },
    )

    it('should not notify when the application has not been rejected', async () => {
      await parentalLeaveService.notifyApplicantOfRejection({
        application: createApplication(),
      } as TemplateApiModuleActionProps)

      expect(sendNotification).not.toHaveBeenCalled()
    })

    it('should not notify for a mock application', async () => {
      const application = createApplication()
      set(application.answers, 'rejectedBy', RejectedBy.EMPLOYER)
      set(application.answers, 'mock.useMockData', YES)

      await parentalLeaveService.notifyApplicantOfRejection({
        application,
      } as TemplateApiModuleActionProps)

      expect(sendNotification).not.toHaveBeenCalled()
    })
  })

  describe('setApplicationFundId', () => {
    it('should return applicationFundId from VMST application information', async () => {
      const application = asVmstFollowUp(createApplication())
      applicationGetApplication.mockResolvedValue({
        application: { applicationFundId: '2025-03076' },
      })

      const res = await parentalLeaveService.setApplicationFundId({
        application,
      } as TemplateApiModuleActionProps)

      expect(applicationGetApplication).toHaveBeenCalledWith({
        applicationId: 'root-application-id',
      })
      expect(res).toBe('2025-03076')
    })

    it('should not ask VMST about a leave it does not list for the applicant', async () => {
      // `initialQuery` comes from the browser and VMST's application lookup does
      // not check ownership.
      const application = createApplication()
      set(application, 'answers.initialQuery', 'someone-elses-application-id')

      const res = await parentalLeaveService.setApplicationFundId({
        application,
      } as TemplateApiModuleActionProps)

      expect(applicationGetApplication).not.toHaveBeenCalled()
      expect(res).toBeNull()
    })

    it('should return null when VMST application information has no applicationFundId', async () => {
      const application = asVmstFollowUp(createApplication())
      applicationGetApplication.mockResolvedValue({ application: {} })

      const res = await parentalLeaveService.setApplicationFundId({
        application,
      } as TemplateApiModuleActionProps)

      expect(res).toBeNull()
    })

    it('should keep existing applicationFundId without calling VMST application information', async () => {
      const application = createApplication()
      application.externalData.navId = {
        data: '2025-03076',
        date: new Date(),
        status: 'success',
      }

      const res = await parentalLeaveService.setApplicationFundId({
        application,
      } as TemplateApiModuleActionProps)

      expect(applicationGetApplication).not.toHaveBeenCalled()
      expect(res).toBe('2025-03076')
    })

    it('should ask VMST about the root application when this one is a change', async () => {
      // VMST keys `GET /applications/{applicationId}` on the island.is uuid, so a
      // change application has to identify itself by the id of the application it
      // descends from — otherwise VMST has no record of it.
      const application = asVmstFollowUp(createApplication())
      set(application, 'answers.vmstApplicationId', 'root-application-id')
      applicationGetApplication.mockResolvedValue({
        application: { applicationFundId: '2025-03076' },
      })

      await parentalLeaveService.setApplicationFundId({
        application,
      } as TemplateApiModuleActionProps)

      expect(applicationGetApplication).toHaveBeenCalledWith({
        applicationId: 'root-application-id',
      })
    })
  })

  describe('prerequisites onExit actions', () => {
    // A follow-up application runs all of these on exit from prerequisites, before
    // `prefillFromVMST` has seeded anything. None of them may throw:
    // `setChildrenInformation` has throwOnError, and the others surface as a
    // generic 500 if they throw something without a structured reason.
    const followUpApplication = () => {
      const application = createApplication()
      // Nothing is seeded yet at this point in the transition.
      application.answers = {
        applicationAction: 'change',
        initialQuery: 'previous-application-id',
      }
      return application
    }

    it.each([
      'setChildrenInformation',
      'setApplicationFundId',
      'setVMSTPeriods',
      'setApplicationRights',
      'setOtherParent',
      'setBirthDate',
    ] as const)(
      '%s should not throw for a follow-up application',
      async (action) => {
        applicationGetApplication.mockResolvedValue({})

        await expect(
          (
            parentalLeaveService[action] as (
              props: TemplateApiModuleActionProps,
            ) => Promise<unknown>
          )({
            application: followUpApplication(),
          } as TemplateApiModuleActionProps),
        ).resolves.not.toThrow()
      },
    )
  })

  describe('setVMSTPeriods in mock mode', () => {
    it("should use the application's own periods", async () => {
      const application = createApplication()
      set(application, 'answers.mock', { useMockData: YES })
      set(application, 'answers.periods', [
        { startDate: '2028-01-01', endDate: '2028-03-01', ratio: '100' },
      ])

      const res = (await parentalLeaveService.setVMSTPeriods({
        application,
      } as TemplateApiModuleActionProps)) as { from: string }[]

      expect(res[0].from).toBe('2028-01-01')
    })
  })

  describe('validateApplication in mock mode', () => {
    it('should skip VMST for a mock application that holds the mock fund id', async () => {
      // The fund id is the authority, not the mock answer, which can change.
      const application = createApplication()
      application.state = 'editOrAddEmployersAndPeriods'
      set(application, 'answers.mock', { useMockData: NO })
      set(application, 'externalData.navId', {
        data: 'mock-application-fund-id',
        date: new Date(),
        status: 'success',
      })

      await expect(
        parentalLeaveService.validateApplication({
          application,
        } as TemplateApiModuleActionProps),
      ).resolves.toBeUndefined()
    })

    it('should still reach VMST for a real fund id', async () => {
      const application = createApplication()
      application.state = 'editOrAddEmployersAndPeriods'
      set(application, 'externalData.navId', {
        data: '2025-03076',
        date: new Date(),
        status: 'success',
      })

      // Gets past the mock short-circuit and the fund-id assertion, so it
      // proceeds into the real VMST call path.
      await expect(
        parentalLeaveService.validateApplication({
          application,
        } as TemplateApiModuleActionProps),
      ).resolves.toBeUndefined()
    })
  })

  describe('validateApplication from the change form', () => {
    it('should reject a change application that has no fund id anywhere', async () => {
      // This is the plain Error behind the generic 500 that was reported. It is
      // correct to reject here; the fix was making sure a change application
      // inherits its predecessor's fund id so it never gets this far. See
      // getApplicationExternalData in parentalLeaveUtils.
      const application = createApplication()
      application.state = 'editOrAddEmployersAndPeriods'

      // The reason has to reach the client, not just the server log — otherwise
      // this surfaces as a bare "Villa kom upp" with no way to tell what failed.
      await expect(
        parentalLeaveService.validateApplication({
          application,
        } as TemplateApiModuleActionProps),
      ).rejects.toMatchObject({
        problem: {
          errorReason: expect.objectContaining({
            summary: expect.stringContaining('Missing applicationFundId'),
          }),
        },
      })
    })
  })

  describe('verifyFollowUpLeave', () => {
    it('should pass a first-time application', async () => {
      await expect(
        parentalLeaveService.verifyFollowUpLeave({
          application: createApplication(),
        } as TemplateApiModuleActionProps),
      ).resolves.toBeUndefined()
    })

    it('should pass a follow-up of a leave VMST lists for the applicant', async () => {
      await expect(
        parentalLeaveService.verifyFollowUpLeave({
          application: asVmstFollowUp(createApplication()),
        } as TemplateApiModuleActionProps),
      ).resolves.toBeUndefined()
    })

    // `initialQuery` comes from the browser and VMST's application lookup does
    // not check ownership. This also refuses a follow-up of a mock application,
    // which VMST never received.
    it('should refuse a follow-up whose leave VMST does not list for the applicant', async () => {
      const application = createApplication()
      set(application, 'answers.initialQuery', 'someone-elses-application-id')

      await expect(
        parentalLeaveService.verifyFollowUpLeave({
          application,
        } as TemplateApiModuleActionProps),
      ).rejects.toMatchObject({
        problem: {
          errorReason: {
            title: errorMessages.followUpLeaveNotFoundTitle,
            summary: errorMessages.followUpLeaveNotFoundSummary,
          },
        },
      })
    })
  })

  describe('setApplicationInformation for a follow-up of a VMST leave', () => {
    it('should add what only the parental-leaves list returns', async () => {
      const application = asVmstFollowUp(createApplication())
      applicationGetApplication.mockResolvedValue({
        application: { applicationId: 'root-application-id', periods: [] },
      })
      parentalLeaveGetParentalLeaves.mockResolvedValue({
        parentalLeaves: [
          {
            applicationId: 'another-leave',
            language: 'IS',
          },
          {
            applicationId: 'root-application-id',
            language: 'EN',
            otherParentBlocked: true,
            noOfChildren: '2',
            adoptionDate: '2027-03-04',
          },
        ],
      })

      const res = await parentalLeaveService.setApplicationInformation({
        application,
      } as TemplateApiModuleActionProps)

      expect(parentalLeaveGetParentalLeaves).toHaveBeenCalledWith({
        nationalRegistryId: application.applicant,
      })
      expect(res).toMatchObject({
        applicationId: 'root-application-id',
        language: 'EN',
        otherParentBlocked: true,
        noOfChildren: '2',
        adoptionDate: '2027-03-04',
      })
    })

    it('should keep the application information when the list lookup fails', async () => {
      const application = asVmstFollowUp(createApplication())
      applicationGetApplication.mockResolvedValue({
        application: { applicationId: 'root-application-id', periods: [] },
      })
      parentalLeaveGetParentalLeaves.mockRejectedValue(new Error('down'))

      const res = await parentalLeaveService.setApplicationInformation({
        application,
      } as TemplateApiModuleActionProps)

      expect(res).toMatchObject({ applicationId: 'root-application-id' })
    })
  })

  describe('setChildrenInformation', () => {
    it("should keep VMST's child links when it replaces the children data", async () => {
      // They are how a follow-up proves which leave it continues; losing them
      // would cut every later VMST lookup off.
      const application = asVmstFollowUp(createApplication())

      const res = await parentalLeaveService.setChildrenInformation({
        application,
      } as TemplateApiModuleActionProps)

      expect(res).toMatchObject({
        childApplicationLinks: [{ vmstApplicationId: 'root-application-id' }],
      })
    })

    it('should build the child from the no-children-found answers after "Ný umsókn"', async () => {
      const application = createApplication()
      set(application, 'answers.selectedChild', 'new')
      set(
        application,
        'answers.noChildrenFound.typeOfApplication',
        'primary_adoption',
      )
      set(application, 'answers.fosterCareOrAdoption', {
        birthDate: '2026-09-01',
        adoptionDate: '2026-11-15',
      })

      const res = await parentalLeaveService.setChildrenInformation({
        application,
      } as TemplateApiModuleActionProps)

      expect(res).toMatchObject({
        children: [{ expectedDateOfBirth: '', adoptionDate: '2026-11-15' }],
      })
    })

    it('should keep the registry children when one was picked after answering them', async () => {
      const application = createApplication()
      const { children } = getApplicationExternalData(application.externalData)
      set(application, 'answers.selectedChild', '0')
      set(
        application,
        'answers.noChildrenFound.typeOfApplication',
        'primary_adoption',
      )

      const res = await parentalLeaveService.setChildrenInformation({
        application,
      } as TemplateApiModuleActionProps)

      expect(res).toMatchObject({ children })
    })
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
