import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  DefaultEvents,
  Application,
  DefaultStateLifeCycle,
} from '@island.is/application/core'
import * as z from 'zod'
import { YES, NO } from '../constants'

type Events = { type: DefaultEvents.SUBMIT } | { type: DefaultEvents.ABORT }

enum States {
  DRAFT = 'draft',
  APPROVED = 'approved',
}

enum Roles {
  APPLICANT = 'applicant',
}

const contactSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email().nonempty(),
  phoneNumber: z.string().nonempty(),
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
  otherRoles: z.string().nonempty(),
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
  type: ApplicationTypes.INSTITUTION_COLLABORATION,
  name: 'Application Application',
  dataSchema,
  readyForProduction: true,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Umsókn um Umsokn',
          progress: 0.43,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/application').then((val) =>
                  Promise.resolve(val.application),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.APPROVED,
          },
        },
      },
      [States.APPROVED]: {
        meta: {
          name: 'Approved',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              read: 'all',
              formLoader: () =>
                import('../forms/approved').then((val) =>
                  Promise.resolve(val.approved),
                ),
            },
          ],
          onEntry: {
            apiModuleAction: TEMPLATE_API_ACTIONS.sendApplication,
          },
        },
        type: 'final' as const,
      },
    },
  },
  mapUserToRole(
    nationalRegistryIdOfAuthenticatedUser: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (nationalRegistryIdOfAuthenticatedUser === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default template
