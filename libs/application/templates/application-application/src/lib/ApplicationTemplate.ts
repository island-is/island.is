import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
} from '@island.is/application/core'
import * as z from 'zod'

const nationalIdRegex = /([0-9]){6}-?([0-9]){4}/

type Events =
  | { type: 'APPROVE' }
  | { type: 'REJECT' }
  | { type: 'SUBMIT' }
  | { type: 'ABORT' }

const Schema = z.object({
  applicant: z.object({
    institution: z.string().nonempty().max(256),
    ministry: z.string().nonempty().max(256),
    contact: z.string().nonempty().max(256),
    email: z.string().email(),
    phoneNumber: z.string().min(7),
  }),
  service: z.object({
    name: z.string().nonempty().max(256),
    countPerYear: z.string().refine((x) => {
      const asNumber = parseInt(x)
    }),
    users: z.string().nonempty().max(256),
    digital: z.enum(['yes', 'no']),
    link: z.string().optional(),
  }),
  data: z.array(
    z.object({
      name: z.string(),
      publisher: z.string(),
      download: z.string(),
      upload: z.string(),
    }),
  ),
  payment: z.object({
    acceptsPayment: z.enum(['yes', 'no']),
    tbr: z.string().optional(),
    amount: z.string().optional(),
    when: z.enum(['in advance', 'on approval']).optional(),
  }),
  info: z.string().optional(),
})

const ReferenceApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.APPLICATION_APPLICATION,
  name: 'Application application',
  dataProviders: [],
  dataSchema: Schema,
  stateMachineConfig: {
    initial: 'draft',
    states: {
      draft: {
        meta: {
          name: 'Umsókn um ökunám',
          progress: 0.33,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/ApplicationForm').then((module) =>
                  Promise.resolve(module.ApplicationForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          SUBMIT: {
            target: 'inReview',
          },
        },
      },
      inReview: {
        meta: {
          name: 'In Review',
          progress: 0.66,
          roles: [
            {
              id: 'reviewer',
              formLoader: () =>
                import('../forms/Review').then((val) =>
                  Promise.resolve(val.Review),
                ),
              actions: [
                { event: 'APPROVE', name: 'Samþykkja', type: 'primary' },
                { event: 'REJECT', name: 'Hafna', type: 'reject' },
              ],
              read: 'all',
            },
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/PendingReview').then((val) =>
                  Promise.resolve(val.PendingReview),
                ),
              read: 'all',
            },
          ],
        },
        on: {
          APPROVE: { target: 'approved' },
          REJECT: { target: 'rejected' },
        },
      },
      approved: {
        meta: {
          name: 'Approved',
          progress: 1,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/Approved').then((val) =>
                  Promise.resolve(val.Approved),
                ),
            },
          ],
        },
        type: 'final' as const,
      },
      rejected: {
        meta: {
          name: 'Rejected',
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/Rejected').then((val) =>
                  Promise.resolve(val.Rejected),
                ),
            },
          ],
        },
      },
    },
  },
  mapUserToRole(id: string, state: string): ApplicationRole {
    if (state === 'inReview') {
      // TODO
      return 'reviewer'
    }
    return 'applicant'
  },
}

export default ReferenceApplicationTemplate
