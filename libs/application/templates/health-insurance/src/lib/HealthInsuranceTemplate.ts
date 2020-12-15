import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
} from '@island.is/application/core'
import * as z from 'zod'

const nationalIdRegex = /([0-9]){6}-?([0-9]){4}/

type Events =
  | { type: 'APPROVE' }
  | { type: 'REJECT' }
  | { type: 'SUBMIT' }
  | { type: 'ABORT' }
  | { type: 'MISSING_INFO' }

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
  }),
  status: z.string().nonempty(),
  confirmationOfStudies: z.string().optional(),
  children: z.string().nonempty(),
  formerInsuranceRegistration: z.string().nonempty(),
  formerInsuranceCountry: z.string().nonempty(),
  formerPersonalId: z.string().nonempty(),
  formerInsuranceInstitution: z.string().nonempty(),
  formerInsuranceEntitlement: z.string().nonempty(),
  additionalInfo: z.string().nonempty(),
  additionalRemarks: z.string().optional(),
  additionalFiles: z.string().optional(),
  confirmCorrectInfo: z.boolean().refine((v) => v),
  agentComments: z.string().nonempty(),
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
          name: 'Application for health insurance',
          progress: 0.25,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/HealthInsuranceForm').then((module) =>
                  Promise.resolve(module.HealthInsuranceForm),
                ),
              actions: [{ event: 'SUBMIT', name: 'Submit', type: 'primary' }],
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
          progress: 0.5,
          roles: [
            {
              id: 'reviewer',
              formLoader: () =>
                import('../forms/ReviewApplication').then((val) =>
                  Promise.resolve(val.ReviewApplication),
                ),
              actions: [
                {
                  event: 'MISSING_INFO',
                  name: 'Missing information',
                  type: 'primary',
                },
              ],
              write: { answers: ['agentComments'] },
              read: 'all',
            },
          ],
        },
        on: {
          MISSING_INFO: {
            target: 'missingInfo',
          },
        },
      },
      missingInfo: {
        meta: {
          name: 'Missing information',
          progress: 0.75,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/MissingInfoForm').then((val) =>
                  Promise.resolve(val.MissingInfoForm),
                ),
              actions: [{ event: 'SUBMIT', name: 'Submit', type: 'primary' }],
              write: { answers: ['missingInfoRemarks', 'missingInfoFiles'] },
              read: 'all',
            },
          ],
        },
        on: {
          REJECT: {
            target: 'inReview',
          },
          SUBMIT: {
            target: 'approved',
          },
        },
      },
      approved: {
        meta: {
          name: 'Rejected',
          roles: [
            {
              id: 'applicant',
            },
          ],
        },
      },
    },
  },
  mapUserToRole(id: string, application: Application): ApplicationRole {
    if (application.state === 'inReview') {
      return 'reviewer'
    }
    return 'applicant'
  },
}

export default HealthInsuranceTemplate
