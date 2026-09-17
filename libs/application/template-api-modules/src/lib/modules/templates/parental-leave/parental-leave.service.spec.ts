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
  ParentalLeaveGetPeriodLengthRequest,
  ParentalLeaveGetPeriodEndDateRequest,
  PeriodLengthResponse,
  PeriodEndDateResponse,
} from '@island.is/clients/vmst'
import {
  ADOPTION,
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
import { SmsService } from '@island.is/nova-sms'
import { ChildrenService } from './children/children.service'
import { PaymentService } from '@island.is/application/api/payment'
import { sharedModuleConfig } from '../../shared/shared.config'
import { ApplicationService } from '@island.is/application/api/core'
import { S3Service } from '@island.is/nest/aws'
import { NO, YES } from '@island.is/application/core'
import { NationalRegistryV3Service } from '../../shared/api/national-registry-v3/national-registry-v3.service'

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
  let applicationGetApplicationInformation: jest.Mock
  let templateFindQuery: jest.Mock

  beforeEach(async () => {
    applicationGetApplicationInformation = jest.fn(() => Promise.reject())
    templateFindQuery = jest.fn(() => Promise.resolve([]))

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
          provide: ApplicationInformationApi,
          useClass: jest.fn(() => ({
            applicationGetApplicationInformation,
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
          useValue: {
            customTemplateFindQuery: () => templateFindQuery,
          },
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

  describe('setApplicationFundId', () => {
    it('should return applicationFundId from VMST application information', async () => {
      const application = createApplication()
      applicationGetApplicationInformation.mockResolvedValue({
        applicationFundId: '2025-03076',
      })

      const res = await parentalLeaveService.setApplicationFundId({
        application,
      } as TemplateApiModuleActionProps)

      expect(applicationGetApplicationInformation).toHaveBeenCalledWith({
        applicationId: application.id,
      })
      expect(res).toBe('2025-03076')
    })

    it('should return null when VMST application information has no applicationFundId', async () => {
      const application = createApplication()
      applicationGetApplicationInformation.mockResolvedValue({})

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

      expect(applicationGetApplicationInformation).not.toHaveBeenCalled()
      expect(res).toBe('2025-03076')
    })

    it('should ask VMST about the root application when this one is a change', async () => {
      // VMST keys `GET /applications/{applicationId}` on the island.is uuid, so a
      // change application has to identify itself by the id of the application it
      // descends from — otherwise VMST has no record of it.
      const application = createApplication()
      set(application, 'answers.vmstApplicationId', 'root-application-id')
      applicationGetApplicationInformation.mockResolvedValue({
        applicationFundId: '2025-03076',
      })

      await parentalLeaveService.setApplicationFundId({
        application,
      } as TemplateApiModuleActionProps)

      expect(applicationGetApplicationInformation).toHaveBeenCalledWith({
        applicationId: 'root-application-id',
      })
    })
  })

  describe('prerequisites onExit actions', () => {
    // A follow-up application runs all of these on exit from prerequisites, before
    // `prefillFromPreviousApplication` has seeded anything. None of them may throw:
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
        applicationGetApplicationInformation.mockResolvedValue({})

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

  describe('setVMSTPeriods for a follow-up application', () => {
    it("should mark the predecessor's periods approved so they cannot be deleted", async () => {
      // It runs on exit from prerequisites, before prefill copies the periods
      // over, so its own answers are still empty. Without the fallback the change
      // form gets periods with no `approved` key and `formatPeriods` lets the
      // applicant delete periods VMST has already accepted.
      const application = createApplication()
      application.answers = { mock: { useMockData: YES } }
      set(application, 'externalData.previousApplication', {
        data: {
          answers: {
            periods: [
              { startDate: '2027-04-01', endDate: '2027-06-01', ratio: '100' },
            ],
          },
        },
        date: new Date(),
        status: 'success',
      })

      const res = (await parentalLeaveService.setVMSTPeriods({
        application,
      } as TemplateApiModuleActionProps)) as {
        approved: boolean
        from: string
      }[]

      expect(res).toHaveLength(1)
      expect(res[0]).toMatchObject({ from: '2027-04-01', approved: true })
    })

    it("should prefer the application's own periods once it has them", async () => {
      const application = createApplication()
      set(application, 'answers.mock', { useMockData: YES })
      set(application, 'answers.periods', [
        { startDate: '2028-01-01', endDate: '2028-03-01', ratio: '100' },
      ])
      set(application, 'externalData.previousApplication', {
        data: {
          answers: {
            periods: [
              { startDate: '2027-04-01', endDate: '2027-06-01', ratio: '100' },
            ],
          },
        },
        date: new Date(),
        status: 'success',
      })

      const res = (await parentalLeaveService.setVMSTPeriods({
        application,
      } as TemplateApiModuleActionProps)) as { from: string }[]

      expect(res[0].from).toBe('2028-01-01')
    })

    it('should use synthesized mock application information periods when available', async () => {
      const application = createApplication()
      set(application, 'answers.mock', { useMockData: YES })
      set(application, 'externalData.previousApplication', {
        data: {
          mockApplicationInformation: {
            periods: [
              {
                from: '2027-04-01',
                to: '2027-06-01',
                ratio: 'D60',
                approved: true,
                paid: false,
                rightsCodePeriod: 'M-L-GR',
                firstPeriodStart: 'specificDate',
                days: '60',
              },
            ],
            applicationRights: [],
          },
        },
        date: new Date(),
        status: 'success',
      })

      const res = (await parentalLeaveService.setVMSTPeriods({
        application,
      } as TemplateApiModuleActionProps)) as {
        from: string
        days: string
        ratio: string
      }[]

      expect(res[0]).toMatchObject({
        from: '2027-04-01',
        days: '60',
        ratio: 'D60',
      })
    })
  })

  describe('setApplicationInformation for a mock follow-up application', () => {
    it('should return synthesized VMST-shaped information from the previous application provider', async () => {
      const application = createApplication()
      set(application, 'answers.mock', { useMockData: YES })
      set(application, 'externalData.previousApplication', {
        data: {
          mockApplicationInformation: {
            applicationFundId: 'mock-application-fund-id',
            periods: [],
            applicationRights: [
              {
                rightsUnit: 'ORLOF-FBF',
                rightsDescription: 'Multiple births',
                months: '3',
                days: '90',
                daysLeft: '90',
              },
            ],
          },
        },
        date: new Date(),
        status: 'success',
      })

      const res = (await parentalLeaveService.setApplicationInformation({
        application,
      } as TemplateApiModuleActionProps)) as {
        applicationFundId: string
        applicationRights: { rightsUnit: string }[]
      }

      expect(res.applicationFundId).toBe('mock-application-fund-id')
      expect(res.applicationRights[0].rightsUnit).toBe('ORLOF-FBF')
      expect(applicationGetApplicationInformation).not.toHaveBeenCalled()
    })
  })

  describe('mock mode for a follow-up application', () => {
    // Why the first submit worked but the change did not: validateApplication
    // returns early in mock mode, so the initial application never called VMST.
    // The change application did not carry the mock answer, so it called VMST for
    // real with a fund id that only exists in mock.
    const changeOfAMockApplication = (mockAnswer?: unknown) => {
      const application = createApplication()
      application.state = 'editOrAddEmployersAndPeriods'
      if (mockAnswer !== undefined) {
        set(application, 'answers.mock', mockAnswer)
      }
      set(application, 'externalData.previousApplication', {
        data: { applicationFundId: 'mock-application-fund-id' },
        date: new Date(),
        status: 'success',
      })
      return application
    }

    it('should skip VMST when the inherited fund id is the mock one', async () => {
      await expect(
        parentalLeaveService.validateApplication({
          application: changeOfAMockApplication(),
        } as TemplateApiModuleActionProps),
      ).resolves.toBeUndefined()
    })

    it('should skip VMST even when the application says mock is off', async () => {
      // The prerequisites screen can write `mock.useMockData: 'no'` on the new
      // application. The fund id is the authority, not that answer.
      await expect(
        parentalLeaveService.validateApplication({
          application: changeOfAMockApplication({ useMockData: 'no' }),
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

  describe('getPreviousApplication', () => {
    it('should return null for a first-time application', async () => {
      const application = createApplication()

      const res = await parentalLeaveService.getPreviousApplication({
        application,
      } as TemplateApiModuleActionProps)

      expect(res).toBeNull()
      expect(templateFindQuery).not.toHaveBeenCalled()
    })

    it("should scope the lookup to the applicant so another person's application can never be read", async () => {
      // The id arrives from the browser, so `applicant` has to be part of the
      // where clause rather than checked afterwards.
      const application = createApplication()
      set(application, 'answers.initialQuery', 'someone-elses-application')

      const res = await parentalLeaveService.getPreviousApplication({
        application,
      } as TemplateApiModuleActionProps)

      expect(templateFindQuery).toHaveBeenCalledWith({
        id: 'someone-elses-application',
        applicant: application.applicant,
      })
      expect(res).toBeNull()
    })

    it('should carry over only non-refillable context and the root VMST id', async () => {
      const application = createApplication()
      set(application, 'answers.initialQuery', 'previous-application-id')

      const previous = createApplication()
      set(previous, 'id', 'previous-application-id')
      set(previous, 'answers.applicationType.option', PARENTAL_LEAVE)
      set(previous, 'answers.noChildrenFound.typeOfApplication', ADOPTION)
      set(previous, 'answers.employers', [
        {
          email: 'employer@employer.test',
          ratio: '100',
          isApproved: true,
          reviewerNationalRegistryId: '1111111119',
        },
      ])
      set(previous, 'answers.payments.bank', '011126111111')
      set(previous, 'answers.actionName', 'period')
      set(previous, 'answers.addEmployer', YES)
      set(previous, 'externalData.navId', {
        data: '2025-03076',
        date: new Date(),
        status: 'success',
      })
      templateFindQuery.mockResolvedValue([previous])

      const res = (await parentalLeaveService.getPreviousApplication({
        application,
      } as TemplateApiModuleActionProps)) as {
        applicationId: string
        vmstApplicationId: string
        applicationFundId: string
        answers: Record<string, unknown>
      }

      expect(res.applicationId).toBe('previous-application-id')
      // No vmstApplicationId on the predecessor means it is itself the root.
      expect(res.vmstApplicationId).toBe('previous-application-id')
      expect(res.applicationFundId).toBe('2025-03076')

      expect(res.answers.applicationType).toBeUndefined()
      expect(res.answers.noChildrenFound).toEqual(
        previous.answers.noChildrenFound,
      )
      expect(res.answers.periods).toBeUndefined()
      expect(res.answers.payments).toBeUndefined()
      expect(res.answers.employers).toBeUndefined()

      // Per-action bookkeeping must not make the new application look like it has
      // already changed something.
      expect(res.answers.actionName).toBeUndefined()
      expect(res.answers.addEmployer).toBeUndefined()
    })

    it('should return the child itself, not the index that pointed at it', async () => {
      // `selectedChild` is an index into the children list, and the new
      // application builds its own list, so carrying the index over could point at
      // a different child.
      const application = createApplication()
      set(application, 'answers.initialQuery', 'previous-application-id')

      const previous = createApplication()
      set(previous, 'id', 'previous-application-id')
      set(previous, 'answers.selectedChild', '0')
      templateFindQuery.mockResolvedValue([previous])

      const res = (await parentalLeaveService.getPreviousApplication({
        application,
      } as TemplateApiModuleActionProps)) as {
        selectedChild: { expectedDateOfBirth: string } | null
        answers: Record<string, unknown>
      }

      expect(res.answers.selectedChild).toBeUndefined()
      expect(res.selectedChild?.expectedDateOfBirth).toBe(
        (
          previous.externalData.children.data as {
            children: { expectedDateOfBirth: string }[]
          }
        ).children[0].expectedDateOfBirth,
      )
    })

    it('should keep pointing at the original root when changing a change', async () => {
      const application = createApplication()
      set(application, 'answers.initialQuery', 'previous-change-id')

      const previous = createApplication()
      set(previous, 'id', 'previous-change-id')
      set(previous, 'answers.vmstApplicationId', 'root-application-id')
      templateFindQuery.mockResolvedValue([previous])

      const res = (await parentalLeaveService.getPreviousApplication({
        application,
      } as TemplateApiModuleActionProps)) as { vmstApplicationId: string }

      expect(res.vmstApplicationId).toBe('root-application-id')
    })

    it('should synthesize VMST application information for mock follow-ups', async () => {
      const application = createApplication()
      set(application, 'answers.initialQuery', 'previous-application-id')

      const previous = createApplication()
      set(previous, 'id', 'previous-application-id')
      set(previous, 'answers.mock.useMockData', YES)
      set(previous, 'answers.employment.isSelfEmployed', YES)
      set(previous, 'answers.periods', [
        {
          startDate: '2027-04-01',
          endDate: '2027-06-01',
          ratio: '100',
          firstPeriodStart: 'specificDate',
        },
      ])
      set(previous, 'answers.multipleBirths.hasMultipleBirths', YES)
      set(previous, 'answers.multipleBirths.multipleBirths', 2)
      set(previous, 'answers.multipleBirthsRequestDays', 90)
      set(previous, 'answers.otherParentObj.otherParentId', '2910932999')
      set(previous, 'answers.otherParentObj.otherParentName', 'Sigurþór')
      set(previous, 'externalData.navId', {
        data: 'mock-application-fund-id',
        date: new Date(),
        status: 'success',
      })
      templateFindQuery.mockResolvedValue([previous])

      const res = (await parentalLeaveService.getPreviousApplication({
        application,
      } as TemplateApiModuleActionProps)) as {
        mockApplicationInformation: {
          applicationFundId: string
          otherParentId: string
          otherParentName: string
          periods: { from: string; firstPeriodStart: string; ratio: string }[]
          applicationRights: { rightsUnit: string; days: string }[]
        }
      }

      expect(res.mockApplicationInformation.applicationFundId).toBe(
        'mock-application-fund-id',
      )
      expect(res.mockApplicationInformation.otherParentId).toBe('2910932999')
      expect(res.mockApplicationInformation.otherParentName).toBe('Sigurþór')
      expect(res.mockApplicationInformation.periods[0]).toMatchObject({
        from: '2027-04-01',
        firstPeriodStart: 'specificDate',
        ratio: '100',
      })
      expect(res.mockApplicationInformation.applicationRights).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ rightsUnit: 'M-S-GR', days: '180' }),
          expect.objectContaining({ rightsUnit: 'ORLOF-FBF', days: '90' }),
        ]),
      )
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
