import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  DefaultStateLifeCycle,
} from '@island.is/application/core'
import * as z from 'zod'
import { NO, YES } from '../constants'
import { API_MODULE } from '../shared'
import { answerValidators } from './answerValidators'
import { m } from '../forms/messages'

const nationalIdRegex = /([0-9]){6}-?([0-9]){4}/

type Events = { type: DefaultEvents.SUBMIT }

enum ApplicationStates {
  DRAFT = 'draft',
  IN_REVIEW = 'inReview',
}

const HealthInsuranceSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: z.object({
    name: z.string().nonempty(),
    nationalId: z.string().refine((x) => (x ? nationalIdRegex.test(x) : false)),
    address: z.string().nonempty(),
    postalCode: z.string().min(3).max(3),
    city: z.string().nonempty(),
    email: z.string().email(),
    phoneNumber: z.string().optional(),
    citizenship: z.string().optional(),
  }),
  children: z.string().nonempty(),
  hasAdditionalInfo: z.enum([YES, NO]),
  additionalRemarks: z.string().optional(),
  confirmCorrectInfo: z.boolean().refine((v) => v),
})

const applicationName = m.formTitle.defaultMessage

const HealthInsuranceTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.HEALTH_INSURANCE,
  name: applicationName,
  readyForProduction: true,
  dataSchema: HealthInsuranceSchema,
  stateMachineConfig: {
    initial: ApplicationStates.DRAFT,
    states: {
      [ApplicationStates.DRAFT]: {
        meta: {
          name: applicationName,
          progress: 0.25,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/HealthInsuranceForm').then((module) =>
                  Promise.resolve(module.HealthInsuranceForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          SUBMIT: {
            target: ApplicationStates.IN_REVIEW,
          },
        },
      },
      [ApplicationStates.IN_REVIEW]: {
        meta: {
          name: applicationName,
          onEntry: {
            apiModuleAction: API_MODULE.sendApplyHealthInsuranceApplication,
          },
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/ConfirmationScreen').then((val) =>
                  Promise.resolve(val.HealthInsuranceConfirmation),
                ),
              read: 'all',
            },
          ],
        },
      },
    },
  },
  mapUserToRole(id: string, application: Application): ApplicationRole {
    return 'applicant'
  },
  answerValidators,
}

export default HealthInsuranceTemplate
