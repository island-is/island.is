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
    postcode: z.string().nonempty(),
    city: z.string().nonempty(),
  }),
  user: z.object({
    name: z.string().nonempty(),
    phoneNumber: z.string().nonempty(),
    nationalId: z.string().nonempty(),
    email: z.string().nonempty(),
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
