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

const dataSchema = z.object({
  applicant: z.object({
    name: z.string().nonempty(),
    email: z.string().nonempty(),
    phoneNumber: z.string().nonempty(),
    address: z.string().nonempty(),
    zipCode: z.string().nonempty(),
  }),
})

const DocumentProvicerOnboardingTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  name: 'Umsókn um að gerast skjalaveitandi',
  dataProviders: [],
  dataSchema,
  stateMachineConfig: {
    initial: 'draft',
    states: {
      draft: {
        meta: {
          name: 'Tengiliðir',
          progress: 0.33,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/ContactInfo').then((val) =>
                  Promise.resolve(val.ContactInfo),
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

export default DocumentProvicerOnboardingTemplate
