import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import {
  ApplicationStatus,
  ApplicationTypes,
  ApplicationWithAttachments,
  NotificationType,
} from '@island.is/application/types'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { HomeApi } from '@island.is/clients/hms-rental-agreement'
import { HmsHousingBenefitsClientService } from '@island.is/clients/hms-housing-benefits'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { HousingBenefitsService } from './housing-benefits.service'
import {
  isLastAssigneeToComplete,
  mapApplicationToHousingBenefitsModel,
} from './utils'
import { NotificationsService } from '../../../../notification/notifications.service'
import { NationalRegistryV3Service } from '../../../shared/api/national-registry-v3/national-registry-v3.service'
import { AttachmentS3Service } from '../../../shared/services'

const APPLICANT_ID = '0101303019'
const ASSIGNEE_A = '0101304929'
const ASSIGNEE_B = '0101307789'

const createApplication = (
  overrides: Partial<ApplicationWithAttachments> = {},
): ApplicationWithAttachments => ({
  id: 'test-application-id',
  applicant: APPLICANT_ID,
  assignees: [ASSIGNEE_A, ASSIGNEE_B],
  applicantActors: [],
  attachments: {},
  answers: {
    rentalAgreement: { answer: '123' },
    householdMembersTableRepeater: [
      {
        nationalIdWithName: {
          nationalId: ASSIGNEE_A,
          name: 'Assignee A',
        },
      },
      {
        nationalIdWithName: {
          nationalId: ASSIGNEE_B,
          name: 'Assignee B',
        },
      },
    ],
    ...overrides.answers,
  },
  externalData: {
    nationalRegistry: {
      data: { fullName: 'Applicant Name' },
      status: 'success',
      date: new Date(),
    },
    getRentalAgreements: {
      data: [
        {
          contractId: 123,
          contractProperty: [
            {
              streetAndHouseNumber: 'Test Street 1',
              postalCode: '101',
              municipality: 'Reykjavík',
            },
          ],
        },
      ],
      status: 'success',
      date: new Date(),
    },
    ...overrides.externalData,
  },
  state: 'assigneeApproval',
  typeId: ApplicationTypes.HOUSING_BENEFITS,
  modified: new Date(),
  created: new Date(),
  status: ApplicationStatus.IN_PROGRESS,
  ...overrides,
})

describe('HousingBenefitsService notifications', () => {
  let service: HousingBenefitsService
  let sendNotification: jest.Mock
  let createHousingBenefitsApplication: jest.Mock

  beforeEach(async () => {
    sendNotification = jest.fn().mockResolvedValue({ id: 'notification-id' })
    createHousingBenefitsApplication = jest
      .fn()
      .mockResolvedValue({ applicationNumber: 4242, success: true })

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HousingBenefitsService,
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
        {
          provide: HomeApi,
          useValue: {},
        },
        {
          provide: NotificationsService,
          useValue: {
            sendNotification,
          },
        },
        {
          provide: NationalRegistryV3Service,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://localhost:4242'),
          },
        },
        {
          provide: HmsHousingBenefitsClientService,
          useValue: {
            createHousingBenefitsApplication,
            hasTaxReturnForYear: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: AttachmentS3Service,
          useValue: {
            getAttachmentUrl: jest
              .fn()
              .mockResolvedValue('https://example.com/presigned-url'),
          },
        },
      ],
    }).compile()

    service = module.get(HousingBenefitsService)
  })

  describe('notifyAssignees', () => {
    it('sends notifications to all assignees on first enter', async () => {
      const application = createApplication()
      const auth = createCurrentUser({ nationalId: APPLICANT_ID })

      const result = await service.notifyAssignees({
        application,
        auth,
        currentUserLocale: 'is',
      })

      expect(sendNotification).toHaveBeenCalledTimes(2)
      expect(sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NotificationType.HmsHousingBenefitsNotifyAssignee,
          messageParties: expect.objectContaining({
            recipient: ASSIGNEE_A,
            sender: APPLICANT_ID,
          }),
        }),
      )
      expect(result.notifiedNationalIds).toEqual(
        expect.arrayContaining([ASSIGNEE_A, ASSIGNEE_B]),
      )
    })

    it('only notifies assignees that have not been notified before', async () => {
      const application = createApplication({
        externalData: {
          notifyAssignees: {
            data: { notifiedNationalIds: [ASSIGNEE_A] },
            status: 'success',
            date: new Date(),
          },
          nationalRegistry: {
            data: { fullName: 'Applicant Name' },
            status: 'success',
            date: new Date(),
          },
          getRentalAgreements: {
            data: [
              {
                contractId: 123,
                contractProperty: [
                  {
                    streetAndHouseNumber: 'Test Street 1',
                    postalCode: '101',
                    municipality: 'Reykjavík',
                  },
                ],
              },
            ],
            status: 'success',
            date: new Date(),
          },
        },
        answers: {
          rentalAgreement: { answer: '123' },
          householdMembersTableRepeater: [
            {
              nationalIdWithName: {
                nationalId: ASSIGNEE_A,
                name: 'Assignee A',
              },
            },
            {
              nationalIdWithName: {
                nationalId: ASSIGNEE_B,
                name: 'Assignee B',
              },
            },
            {
              nationalIdWithName: {
                nationalId: '0101302209',
                name: 'Assignee C',
              },
            },
          ],
        },
        assignees: [ASSIGNEE_A, ASSIGNEE_B, '0101302209'],
      })
      const auth = createCurrentUser({ nationalId: APPLICANT_ID })

      const result = await service.notifyAssignees({
        application,
        auth,
        currentUserLocale: 'is',
      })

      expect(sendNotification).toHaveBeenCalledTimes(2)
      expect(sendNotification).not.toHaveBeenCalledWith(
        expect.objectContaining({
          messageParties: expect.objectContaining({ recipient: ASSIGNEE_A }),
        }),
      )
      expect(result.notifiedNationalIds).toEqual(
        expect.arrayContaining([ASSIGNEE_A, ASSIGNEE_B, '0101302209']),
      )
    })

    it('no-ops when there are no assignees to notify', async () => {
      const application = createApplication({
        assignees: [],
        answers: {
          rentalAgreement: { answer: '123' },
        },
      })
      const auth = createCurrentUser({ nationalId: APPLICANT_ID })

      const result = await service.notifyAssignees({
        application,
        auth,
        currentUserLocale: 'is',
      })

      expect(sendNotification).not.toHaveBeenCalled()
      expect(result.notifiedNationalIds).toEqual([])
    })
  })

  describe('notifyApplicantOnAssigneeSubmit', () => {
    it('notifies applicant when assignee approves and others remain', async () => {
      const application = createApplication({
        answers: {
          rentalAgreement: { answer: '123' },
          signedAssignees: [],
          householdMembersTableRepeater: [
            {
              nationalIdWithName: {
                nationalId: ASSIGNEE_A,
                name: 'Assignee A',
              },
            },
            {
              nationalIdWithName: {
                nationalId: ASSIGNEE_B,
                name: 'Assignee B',
              },
            },
          ],
        },
      })
      const auth = createCurrentUser({ nationalId: ASSIGNEE_A })

      await service.notifyApplicantOnAssigneeSubmit({
        application,
        auth,
        currentUserLocale: 'is',
      })

      expect(sendNotification).toHaveBeenCalledTimes(1)
      expect(sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NotificationType.HmsHousingBenefitsAssigneeApproved,
          messageParties: expect.objectContaining({
            recipient: APPLICANT_ID,
            sender: ASSIGNEE_A,
          }),
          args: expect.objectContaining({
            assigneeName: 'Assignee A',
          }),
        }),
      )
    })

    it('sends ready notification when last assignee approves', async () => {
      const application = createApplication({
        answers: {
          rentalAgreement: { answer: '123' },
          signedAssignees: [ASSIGNEE_A],
          householdMembersTableRepeater: [
            {
              nationalIdWithName: {
                nationalId: ASSIGNEE_A,
                name: 'Assignee A',
              },
            },
            {
              nationalIdWithName: {
                nationalId: ASSIGNEE_B,
                name: 'Assignee B',
              },
            },
          ],
        },
      })
      const auth = createCurrentUser({ nationalId: ASSIGNEE_B })

      await service.notifyApplicantOnAssigneeSubmit({
        application,
        auth,
        currentUserLocale: 'is',
      })

      expect(sendNotification).toHaveBeenCalledTimes(1)
      expect(sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NotificationType.HmsHousingBenefitsReadyForApplicantSubmit,
          messageParties: expect.objectContaining({
            recipient: APPLICANT_ID,
          }),
        }),
      )
    })

    it('no-ops when applicant triggers the action', async () => {
      const application = createApplication()
      const auth = createCurrentUser({ nationalId: APPLICANT_ID })

      await service.notifyApplicantOnAssigneeSubmit({
        application,
        auth,
        currentUserLocale: 'is',
      })

      expect(sendNotification).not.toHaveBeenCalled()
    })
  })

  describe('notifyApplicantOnAssigneeReject', () => {
    it('notifies applicant when assignee rejects and others remain', async () => {
      const application = createApplication({
        answers: {
          rentalAgreement: { answer: '123' },
          rejectedAssignees: [],
          householdMembersTableRepeater: [
            {
              nationalIdWithName: {
                nationalId: ASSIGNEE_A,
                name: 'Assignee A',
              },
            },
            {
              nationalIdWithName: {
                nationalId: ASSIGNEE_B,
                name: 'Assignee B',
              },
            },
          ],
        },
      })
      const auth = createCurrentUser({ nationalId: ASSIGNEE_A })

      await service.notifyApplicantOnAssigneeReject({
        application,
        auth,
        currentUserLocale: 'is',
      })

      expect(sendNotification).toHaveBeenCalledTimes(1)
      expect(sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NotificationType.HmsHousingBenefitsAssigneeRejected,
          messageParties: expect.objectContaining({
            recipient: APPLICANT_ID,
            sender: ASSIGNEE_A,
          }),
          args: expect.objectContaining({
            assigneeName: 'Assignee A',
            address: 'Test Street 1, 101 Reykjavík',
          }),
        }),
      )
    })

    it('sends ready notification when last assignee rejects', async () => {
      const application = createApplication({
        answers: {
          rentalAgreement: { answer: '123' },
          rejectedAssignees: [ASSIGNEE_A],
          householdMembersTableRepeater: [
            {
              nationalIdWithName: {
                nationalId: ASSIGNEE_A,
                name: 'Assignee A',
              },
            },
            {
              nationalIdWithName: {
                nationalId: ASSIGNEE_B,
                name: 'Assignee B',
              },
            },
          ],
        },
      })
      const auth = createCurrentUser({ nationalId: ASSIGNEE_B })

      await service.notifyApplicantOnAssigneeReject({
        application,
        auth,
        currentUserLocale: 'is',
      })

      expect(sendNotification).toHaveBeenCalledTimes(1)
      expect(sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NotificationType.HmsHousingBenefitsReadyForApplicantSubmit,
        }),
      )
    })
  })

  describe('institution decision notifications', () => {
    const application = createApplication()

    it('sends extra data requested notification to applicant', async () => {
      const applicationWithRequestedFiles = createApplication({
        answers: {
          rentalAgreement: { answer: '123' },
          institutionRequestedDocuments: [
            'exemptionReason',
            'custodyAgreement',
          ],
        },
      })

      await service.notifyApplicantOnExtraDataRequested({
        application: applicationWithRequestedFiles,
        auth: createCurrentUser({ nationalId: APPLICANT_ID }),
        currentUserLocale: 'is',
      })

      expect(sendNotification).toHaveBeenCalledTimes(1)
      expect(sendNotification).toHaveBeenCalledWith({
        type: NotificationType.HmsHousingBenefitsExtraDataRequested,
        messageParties: {
          recipient: APPLICANT_ID,
        },
        applicationId: applicationWithRequestedFiles.id,
        args: {
          applicationLink: `http://localhost:4242/husnaedisbaetur/${applicationWithRequestedFiles.id}`,
          address: 'Test Street 1, 101 Reykjavík',
          files: 'exemptionReason,custodyAgreement',
        },
      })
    })

    it('sends approved notification to applicant', async () => {
      await service.notifyApplicantOnApprovedByInstitution({
        application,
        auth: createCurrentUser({ nationalId: APPLICANT_ID }),
        currentUserLocale: 'is',
      })

      expect(sendNotification).toHaveBeenCalledTimes(1)
      expect(sendNotification).toHaveBeenCalledWith({
        type: NotificationType.HmsHousingBenefitsApprovedByInstitution,
        messageParties: {
          recipient: APPLICANT_ID,
        },
        applicationId: application.id,
        args: {
          address: 'Test Street 1, 101 Reykjavík',
        },
      })
    })

    it('sends rejected notification to applicant', async () => {
      const rejectedApplication = createApplication({
        answers: {
          rentalAgreement: { answer: '123' },
          approveOrRejectReason: 'Does not meet eligibility criteria',
        },
      })

      await service.notifyApplicantOnRejectedByInstitution({
        application: rejectedApplication,
        auth: createCurrentUser({ nationalId: APPLICANT_ID }),
        currentUserLocale: 'is',
      })

      expect(sendNotification).toHaveBeenCalledTimes(1)
      expect(sendNotification).toHaveBeenCalledWith({
        type: NotificationType.HmsHousingBenefitsRejectedByInstitution,
        messageParties: {
          recipient: APPLICANT_ID,
        },
        applicationId: rejectedApplication.id,
        args: {
          address: 'Test Street 1, 101 Reykjavík',
          rejectReason: 'Does not meet eligibility criteria',
        },
      })
    })
  })

  describe('submitApplication', () => {
    it('maps the application and submits it to HMS', async () => {
      const application = createApplication()
      const auth = createCurrentUser({ nationalId: APPLICANT_ID })

      const result = await service.submitApplication({
        application,
        auth,
        currentUserLocale: 'is',
      })

      expect(createHousingBenefitsApplication).toHaveBeenCalledTimes(1)
      expect(createHousingBenefitsApplication).toHaveBeenCalledWith(
        auth,
        expect.objectContaining({
          kennitala: APPLICANT_ID,
          leaseContractNumber: 123,
        }),
      )
      expect(result).toEqual({ applicationNumber: 4242, success: true })
    })

    it('does not resubmit when an application number already exists', async () => {
      const application = createApplication({
        externalData: {
          submitApplication: {
            data: { applicationNumber: 9999 },
            status: 'success',
            date: new Date(),
          },
        },
      })
      const auth = createCurrentUser({ nationalId: APPLICANT_ID })

      const result = await service.submitApplication({
        application,
        auth,
        currentUserLocale: 'is',
      })

      expect(createHousingBenefitsApplication).not.toHaveBeenCalled()
      expect(result).toEqual({ applicationNumber: 9999, success: true })
    })

    it('throws when HMS reports the submission was not successful', async () => {
      createHousingBenefitsApplication.mockResolvedValueOnce({
        applicationNumber: undefined,
        success: false,
      })
      const application = createApplication()
      const auth = createCurrentUser({ nationalId: APPLICANT_ID })

      await expect(
        service.submitApplication({
          application,
          auth,
          currentUserLocale: 'is',
        }),
      ).rejects.toThrow()
    })
  })

  describe('isLastAssigneeToComplete', () => {
    it('returns false when other assignees remain', () => {
      const application = createApplication({
        answers: {
          rentalAgreement: { answer: '123' },
          signedAssignees: [],
          householdMembersTableRepeater: [
            {
              nationalIdWithName: {
                nationalId: ASSIGNEE_A,
                name: 'Assignee A',
              },
            },
            {
              nationalIdWithName: {
                nationalId: ASSIGNEE_B,
                name: 'Assignee B',
              },
            },
          ],
        },
      })

      expect(isLastAssigneeToComplete(application, ASSIGNEE_A)).toBe(false)
    })

    it('returns true when current assignee completes the last pending action', () => {
      const application = createApplication({
        answers: {
          rentalAgreement: { answer: '123' },
          signedAssignees: [ASSIGNEE_A],
          householdMembersTableRepeater: [
            {
              nationalIdWithName: {
                nationalId: ASSIGNEE_A,
                name: 'Assignee A',
              },
            },
            {
              nationalIdWithName: {
                nationalId: ASSIGNEE_B,
                name: 'Assignee B',
              },
            },
          ],
        },
      })

      expect(isLastAssigneeToComplete(application, ASSIGNEE_B)).toBe(true)
    })
  })
})

describe('HousingBenefitsService', () => {
  let service: HousingBenefitsService

  it('excludes rejected assignees from householdMembers in submission model', () => {
    const model = mapApplicationToHousingBenefitsModel(
      createApplication({
        answers: {
          rejectedAssignees: [ASSIGNEE_A],
          signedAssignees: [ASSIGNEE_B],
          householdMembersTableRepeater: [
            {
              nationalIdWithName: { nationalId: ASSIGNEE_A, name: 'Rejected' },
            },
            { nationalIdWithName: { nationalId: ASSIGNEE_B, name: 'Signed' } },
          ],
          [ASSIGNEE_B]: {
            approveExternalData: true,
            assigneeInfo: { email: 'b@test.is' },
          },
        },
      }),
    )
    expect(model.householdMembers?.map((m) => m.kennitala)).not.toContain(
      ASSIGNEE_A,
    )
    expect(
      model.householdMembers?.find((m) => m.kennitala === ASSIGNEE_B),
    ).toMatchObject({
      acceptedPrivacyPolicy: true,
      acceptedDataFetch: true,
      email: 'b@test.is',
    })
  })
})
