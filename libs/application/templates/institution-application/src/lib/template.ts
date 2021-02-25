import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
} from '@island.is/application/core'
import * as z from 'zod'
import { YES, NO } from '../constants'

type Events =
  | { type: 'APPROVE' }
  | { type: 'REJECT' }
  | { type: 'SUBMIT' }
  | { type: 'ABORT' }

const contactSchema = z.object({
  name: z.string().nonempty(),
  email: z
    .string()
    .email()
    .nonempty(),
  phoneNumber: z.string().optional(),
})

const dataSchema = z.object({
  applicant: z.object({
    institution: z.string().nonempty(),
  }),
  contact: contactSchema,
  hasSecondaryContact: z.enum([YES, NO]),
  secondaryContact: z.object({
    name: z.string().optional(),
    email: z
      .string()
      // .email()
      .optional(),
    phoneNumber: z.string().optional(),
  }),
  project: z
    .object({
      name: z.string().optional(),
      background: z.string().optional(),
      goals: z.string().optional(),
      scope: z.string().optional(),
      finance: z.string().optional(),
    })
    .optional(),
})
enum TEMPLATE_API_ACTIONS {
  // Has to match name of action in template API module
  // (will be refactored when state machine is a part of API module)
  sendApplication = 'sendApplication'
}
const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.INSTITUTION_APPLICATION,
  name: 'Application Application',
  dataSchema,
  stateMachineConfig: {
    initial: 'draft',
    states: {
      draft: {
        meta: {
          name: 'Umsókn um Umsokn',
          progress: 0.43,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/application').then((val) =>
                  Promise.resolve(val.application),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary', },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          SUBMIT: {
            target: 'approved',
          },
        },
      },
      approved: {
        meta: {
          name: 'Approved',
          progress: 1,
          onEntry: {
            apiModuleAction: TEMPLATE_API_ACTIONS.sendApplication,
          },
        },
        type: 'final' as const,
      },
    },
  },
  mapUserToRole(id: string, application: Application): ApplicationRole {
    return 'applicant'
  },
}

export default template
