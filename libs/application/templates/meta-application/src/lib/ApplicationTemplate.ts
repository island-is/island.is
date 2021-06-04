import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultStateLifeCycle,
} from '@island.is/application/core'
import * as z from 'zod'

type Events =
  | { type: 'APPROVE' }
  | { type: 'REJECT' }
  | { type: 'SUBMIT' }
  | { type: 'ABORT' }

const Schema = z.object({
  applicant: z.object({
    institution: z
      .union([
        z.string().optional(),
        z
          .object({
            id: z.string().optional(),
            title: z.string().optional(),
          })
          .optional(),
      ])
      .optional(),
    ministry: z
      .union([
        z.string().optional(),
        z
          .object({
            id: z.string().optional(),
            title: z.string().optional(),
          })
          .optional(),
      ])
      .optional(),
    contact: z.string().nonempty().max(256),
    email: z.string().email(),
    phoneNumber: z.string().min(7),
  }),
  service: z.object({
    name: z.string().nonempty().max(256),
    countPerYear: z.string().refine((x) => {
      const asNumber = parseInt(x)
      return !isNaN(asNumber) && asNumber >= 0
    }),
    users: z.enum(['companies', 'individuals', 'both']),
  }),
  serviceFields: z.object({
    digital: z.enum(['yes', 'no']),
    link: z.string().url().optional(),
  }),
  data: z.array(
    z.object({
      name: z.string(),
      publisher: z.string(),
      download: z.enum(['yes', 'no']),
    }),
  ),
  payment: z.object({
    acceptsPayment: z.enum(['yes', 'no']),
    tbr: z.string().optional(),
    amount: z.string().optional(),
    when: z.enum(['inAdvance', 'onApproval']).optional(),
  }),
  info: z.string().optional(),
})

const ReferenceApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.META_APPLICATION,
  name: 'Umsókn um aðild að umsóknarkerfi island.is',
  dataSchema: Schema,
  stateMachineConfig: {
    initial: 'draft',
    states: {
      draft: {
        meta: {
          name: 'Umsókn',
          progress: 0.33,
          lifecycle: DefaultStateLifeCycle,
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
          name: 'Í vinnslu',
          progress: 0.66,
          lifecycle: DefaultStateLifeCycle,
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
          name: 'Samþykkt',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
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
          name: 'Hafnað',
          lifecycle: DefaultStateLifeCycle,
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
        type: 'final' as const,
      },
    },
  },
  mapUserToRole(id: string, application: Application): ApplicationRole {
    if (application.state === 'inReview') {
      // TODO
      return 'reviewer'
    }
    return 'applicant'
  },
}

export default ReferenceApplicationTemplate
