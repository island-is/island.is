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

const HealthInsuranceSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: z.object({
    name: z.string().nonempty(),
    nationalId: z.string().refine((x) => (x ? nationalIdRegex.test(x) : false)),
    address: z.string().nonempty(),
    postalCode: z.string().min(3).max(3),
    city: z.string().nonempty(),
    nationality: z.string().nonempty(),
    email: z.string().email(),
    phoneNumber: z.string().optional(),
    country: z.string().nonempty(),
    previousIdNr: z.string().nonempty(),
    insuranceName: z.string().nonempty(),
  }),
  status: z.string().nonempty(),
  additionalInformation: z.string().optional(),
  children: z.string().nonempty(),
  formerCountryofInsuranceRegistration: z.string().nonempty(),
  formerCountryInsuranceEntitlement: z.string().nonempty(),
  summaryInput: z.string(),
})

const HealthInsuranceTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.HEALTH_INSURANCE,
  name: 'Application for health insurance',
  dataSchema: HealthInsuranceSchema,
  stateMachineConfig: {
    initial: 'draft',
    states: {
      draft: {
        meta: {
          name: 'draft',
          progress: 0.25,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/HealthInsuranceForm').then((module) =>
                  Promise.resolve(module.HealthInsuranceForm),
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

export default HealthInsuranceTemplate
