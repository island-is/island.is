import type { User } from '@island.is/auth-nest-tools'
import { ForbiddenException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { LoggingModule } from '@island.is/logging'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import { ApplicationValidationService } from './applicationTemplateValidation.service'

const applicantNationalId = '1111111111'
const reviewerNationalId = '2222222222'

const mockTemplate = {
  type: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
  mapUserToRole: (nationalId: string, application: Application) => {
    if (nationalId === application.applicant) return 'applicant'
    if (application.assignees.includes(nationalId)) return 'reviewer'
    return undefined
  },
  stateMachineConfig: {
    initial: 'inReview',
    states: {
      inReview: {
        meta: {
          name: 'In review',
          roles: [
            { id: 'applicant', read: 'all' },
            {
              id: 'reviewer',
              read: 'all',
              actions: [
                { event: 'APPROVE', name: 'Approve', type: 'primary' },
                { event: { type: 'REJECT' }, name: 'Reject', type: 'reject' },
              ],
            },
          ],
        },
        on: {
          APPROVE: { target: 'approved' },
          REJECT: { target: 'rejected' },
        },
      },
      approved: { meta: { name: 'Approved' } },
      rejected: { meta: { name: 'Rejected' } },
    },
  },
}

jest.mock('@island.is/application/template-loader', () => ({
  getApplicationTemplateByTypeId: jest.fn(async () => mockTemplate),
}))

const createApplication = (): Application => ({
  id: '123',
  typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
  state: 'inReview',
  applicant: applicantNationalId,
  assignees: [reviewerNationalId],
  applicantActors: [],
  answers: {},
  externalData: {},
  status: ApplicationStatus.IN_PROGRESS,
  created: new Date(),
  modified: new Date(),
})

const createUser = (nationalId: string): User => ({
  nationalId,
  scope: [],
  authorization: 'token',
  client: 'client',
})

describe('ApplicationValidationService.validateIncomingEvent', () => {
  let service: ApplicationValidationService
  let isEventPermissionCheckDisabled = false

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [LoggingModule],
      providers: [
        ApplicationValidationService,
        {
          provide: FeatureFlagService,
          useValue: {
            getValue: async (feature: Features, defaultValue: boolean) =>
              feature === Features.applicationSystemDisableEventPermissionCheck
                ? isEventPermissionCheckDisabled
                : defaultValue,
          },
        },
      ],
    }).compile()

    service = moduleRef.get(ApplicationValidationService)
  })

  afterEach(() => {
    isEventPermissionCheckDisabled = false
  })

  it('should allow an event in the actions of the user role', async () => {
    await expect(
      service.validateIncomingEvent(
        createApplication(),
        'APPROVE',
        createUser(reviewerNationalId),
      ),
    ).resolves.toBeUndefined()
  })

  it('should allow an event declared as an event object', async () => {
    await expect(
      service.validateIncomingEvent(
        createApplication(),
        'REJECT',
        createUser(reviewerNationalId),
      ),
    ).resolves.toBeUndefined()
  })

  it('should reject an event the state accepts but the user role does not have in its actions', async () => {
    await expect(
      service.validateIncomingEvent(
        createApplication(),
        'APPROVE',
        createUser(applicantNationalId),
      ),
    ).rejects.toThrow(ForbiddenException)
  })

  it('should reject any event from a user with no role in the application', async () => {
    await expect(
      service.validateIncomingEvent(
        createApplication(),
        'APPROVE',
        createUser('3333333333'),
      ),
    ).rejects.toThrow(ForbiddenException)
  })

  it('should allow a non-permitted event when the check is disabled by the feature flag', async () => {
    isEventPermissionCheckDisabled = true

    await expect(
      service.validateIncomingEvent(
        createApplication(),
        'APPROVE',
        createUser(applicantNationalId),
      ),
    ).resolves.toBeUndefined()
  })
})
