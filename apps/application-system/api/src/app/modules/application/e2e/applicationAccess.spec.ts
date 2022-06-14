import * as z from 'zod'

import {
  Application,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationStatus,
  ApplicationTemplate,
  ApplicationTypes,
  buildForm,
  DefaultStateLifeCycle,
  ExternalData,
  FormValue,
} from '@island.is/application/core'
import { ApplicationAccessService } from '../tools/applicationAccess.service'
import { Test } from '@nestjs/testing'
import { EventObject } from 'xstate'
import { ApplicationService } from '@island.is/application/api/core'

const createMockApplication = (
  data: {
    answers?: FormValue
    externalData?: ExternalData
    state?: string
    typeId?: ApplicationTypes
  } = {},
): Application => ({
  id: '123',
  assignees: [],
  state: data.state || 'draft',
  applicant: '111111-3000',
  typeId: data.typeId || ApplicationTypes.EXAMPLE,
  modified: new Date(),
  created: new Date(),
  answers: data.answers || {},
  externalData: data.externalData || {},
  status: ApplicationStatus.IN_PROGRESS,
  applicantActors: [],
})

const createTestApplicationTemplate = (): ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<EventObject>,
  EventObject
> => ({
  mapUserToRole(nationalId: string): ApplicationRole | ApplicationRole[] {
    if (nationalId === '111111-3000') {
      return 'applicant'
    }
    if (nationalId === '111111-3002') {
      return ['applicant', 'reviewer']
    }
    return 'reviewer'
  },
  type: ApplicationTypes.EXAMPLE,
  name: 'Test application',
  dataSchema: z.object({
    person: z.object({
      age: z.number().min(18),
      pets: z.array(
        z.object({ name: z.string().nonempty(), kind: z.enum(['dog', 'cat']) }),
      ),
    }),
    externalReviewAccepted: z.boolean(),
    wantsInsurance: z.boolean(),
    wantsCake: z.boolean(),
  }),
  stateMachineConfig: {
    initial: 'draft',
    states: {
      draft: {
        meta: {
          name: 'draft',
          progress: 0.33,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              actions: [{ event: 'SUBMIT', name: 'Submit', type: 'primary' }],
              id: 'applicant',
              formLoader: () =>
                Promise.resolve(
                  buildForm({
                    id: 'ParentalLeave',
                    title: 'parentalLeave',
                    children: [],
                  }),
                ),
              write: {
                answers: ['person', 'wantsInsurance'],
                externalData: ['salary'],
              },
              delete: true,
              shouldBeListedForRole: true,
            },
          ],
        },
        on: {
          SUBMIT: { target: 'inReview' },
        },
      },
      inReview: {
        meta: {
          name: 'In Review',
          progress: 0.66,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: 'applicant',
            },
            {
              id: 'reviewer',
              read: 'all' as const,
              write: {
                answers: [],
                externalData: [],
              },
              shouldBeListedForRole: false,
            },
          ],
        },
        on: {
          APPROVE: { target: 'approved' },
          REJECT: { target: 'draft' },
        },
      },
      approved: {
        meta: {
          name: 'Approved',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
        },
        type: 'final' as const,
      },
      rejected: {
        meta: {
          name: 'Rejected',
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: 'applicant',
              write: 'all',
            },
          ],
        },
      },
    },
  },
})

const testApplicationTemplate = createTestApplicationTemplate()

describe('ApplicationAccesService', () => {
  let applicationAccessService: ApplicationAccessService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ApplicationAccessService,
        {
          provide: ApplicationService,
          useValue: {},
        },
      ],
    }).compile()

    applicationAccessService = moduleRef.get<ApplicationAccessService>(
      ApplicationAccessService,
    )
  })

  it('should return true when application is in draft and user is an applicant', async () => {
    const applicationInReview = createMockApplication({
      state: 'draft',
    })
    const results = await applicationAccessService.canDeleteApplication(
      applicationInReview,
      '111111-3000',
    )
    expect(results).toBe(true)
  })

  it('should return false when application is in inReview and user is an applicant', async () => {
    const applicationInReview = createMockApplication({
      state: 'inReview',
    })
    const results = await applicationAccessService.canDeleteApplication(
      applicationInReview,
      '111111-3000',
    )
    expect(results).toBe(false)
  })

  it('should return true when application is in draft and has both shouldBeListedForRole set as true and not set = undefined', async () => {
    const applicationInDraft = createMockApplication({
      state: 'draft',
    })

    const results = await applicationAccessService.shouldShowApplicationOnOverview(
      applicationInDraft,
      '111111-3000',
      testApplicationTemplate,
    )
    expect(results).toBe(true)

    const results2 = await applicationAccessService.shouldShowApplicationOnOverview(
      applicationInDraft,
      '111111-3001',
      testApplicationTemplate,
    )
    expect(results2).toBe(true)
  })

  it('should return false when application is in review and user is a reviewer and template dictactes it should be hidden in overview', async () => {
    const applicationInReview = createMockApplication({
      state: 'inReview',
    })
    const results = await applicationAccessService.shouldShowApplicationOnOverview(
      applicationInReview,
      '111111-3001',
      testApplicationTemplate,
    )
    expect(results).toBe(false)
  })

  it('should return true when application is in review and user is a reviewer and an applicant', async () => {
    const applicationInReview = createMockApplication({
      state: 'inReview',
    })
    const results = await applicationAccessService.shouldShowApplicationOnOverview(
      applicationInReview,
      '111111-3002',
      testApplicationTemplate,
    )
    expect(results).toBe(true)
  })

  it('should return true when application is in rejected and should be listed is not defined for the role', async () => {
    const applicationInReview = createMockApplication({
      state: 'rejected',
    })
    const results = await applicationAccessService.shouldShowApplicationOnOverview(
      applicationInReview,
      '111111-3000',
      testApplicationTemplate,
    )
    expect(results).toBe(true)
  })
})
