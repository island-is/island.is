import * as faker from 'faker'
import { DefaultStateLifeCycle, buildForm } from '@island.is/application/core'
import { EventObject } from 'xstate'
import { z } from 'zod'
import {
  ApplicationWithAttachments,
  ApplicationTypes,
  ApplicationStatus,
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationRole,
  ApplicationTemplate,
} from '@island.is/application/types'

export const createApplication = (
  overrides?: Partial<ApplicationWithAttachments>,
): ApplicationWithAttachments => ({
  applicant: faker.helpers.replaceSymbolWithNumber('##########'),
  answers: {},
  assignees: [],
  applicantActors: [],
  attachments: {},
  created: new Date(),
  modified: new Date(),
  externalData: {},
  id: faker.random.word(),
  state: 'DRAFT',
  typeId: ApplicationTypes.EXAMPLE,
  name: '',
  status: ApplicationStatus.IN_PROGRESS,
  ...overrides,
})

export const createApplicationTemplate = (
  overrides?: Partial<
    ApplicationTemplate<
      ApplicationContext,
      ApplicationStateSchema<EventObject>,
      EventObject
    >
  >,
): ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<EventObject>,
  EventObject
> => ({
  mapUserToRole(nationalId: string): ApplicationRole {
    if (nationalId === '111111-3000') {
      return 'applicant'
    }
    return 'reviewer'
  },
  type: ApplicationTypes.EXAMPLE,
  name: 'Test application',
  institution: 'Test institution',
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
  ...overrides,
})
