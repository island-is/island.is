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

const FileSchema = z
  .object({
    name: z.string(),
    key: z.string(),
    url: z.string(),
  })
  .optional()

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
  secondaryContact: contactSchema.deepPartial(),
  project: z.object({
    name: z.string().nonempty(),
    background: z.string().nonempty(),
    goals: z.string().nonempty(),
    scope: z.string().nonempty(),
    finance: z.string().nonempty(),
  }),
  stakeholders: z.string().nonempty(),
  role: z.string().nonempty(),
  attachments: z.array(FileSchema).optional(),
  constraints: z.object({
    hasTechnical: z.boolean().optional(),
    technical: z.string().optional(),
    hasFinancial: z.boolean().optional(),
    financial: z.string().optional(),
    hasTime: z.boolean().optional(),
    time: z.string().optional(),
    hasShopping: z.boolean().optional(),
    shopping: z.string().optional(),
    hasMoral: z.boolean().optional(),
    moral: z.string().optional(),
    hasOther: z.boolean().optional(),
    other: z.string().optional(),
  }),
})
enum TEMPLATE_API_ACTIONS {
  // Has to match name of action in template API module
  // (will be refactored when state machine is a part of API module)
  sendApplication = 'sendApplication',
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
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
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
