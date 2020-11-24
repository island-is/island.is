import * as kennitala from 'kennitala'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
} from '@island.is/application/core'
import * as z from 'zod'

type Events =
  | { type: 'APPROVE' }
  | { type: 'REJECT' }
  | { type: 'SUBMIT' }
  | { type: 'ABORT' }

const dataSchema = z.object({
  address: z.object({
    home: z.string().nonempty(),
    postcode: z.string(),
    city: z.string().nonempty(),
  }),
  user: z.object({
    name: z.string().nonempty(),
    phoneNumber: z.string().min(7),
    nationalId: z.string().refine((x) => kennitala.isPerson(x)),
    email: z.string().email().nonempty(),
    country: z.string().nonempty(),
  }),
  teacher: z.string().nonempty(),
  type: z.string().nonempty(),
  category: z.string().nonempty(),
  isBusiness: z.boolean(),
})

const drivingLicenseTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.DRIVING_LICENSE,
  name: 'Umsókn um ökuskilríki',
  dataSchema,
  stateMachineConfig: {
    initial: 'draft',
    states: {
      draft: {
        meta: {
          name: 'Umsókn um ökuskilríki',
          progress: 0.33,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/drivingLicenseApplication').then((val) =>
                  Promise.resolve(val.drivingLicenseApplication),
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
                import('../forms/reviewDrivingLicenseApplication').then((val) =>
                  Promise.resolve(val.reviewDrivingLicenseApplication),
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
                import(
                  '../forms/drivingLicenseApplicationPendingReview'
                ).then((val) =>
                  Promise.resolve(val.drivingLicenseApplicationPendingReview),
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
                import(
                  '../forms/approvedDrivingLicenseApplication'
                ).then((val) =>
                  Promise.resolve(val.approvedDrivingLicenseApplication),
                ),
              read: 'all',
            },
          ],
        },
        type: 'final' as const,
      },
      rejected: {
        meta: {
          name: 'Rejected',
          progress: 1,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import(
                  '../forms/rejectedDrivingLicenseApplication'
                ).then((val) =>
                  Promise.resolve(val.rejectedDrivingLicenseApplication),
                ),
            },
          ],
        },
        type: 'final' as const,
      },
    },
  },
  mapUserToRole(id: string, state: string): ApplicationRole {
    if (state === 'inReview') {
      return 'reviewer'
    }
    return 'applicant'
  },
}

export default drivingLicenseTemplate
