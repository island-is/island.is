import * as z from 'zod'

import {
  Application,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
} from '@island.is/application/types'
import {
  DEPRECATED_DefaultStateLifeCycle,
  DefaultStateLifeCycle,
} from '@island.is/application/core'
import { NO, YES } from '../constants'

import { institutionApplicationMessages as m } from './messages'

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
    institution: z.object({
      nationalId: z.string().nonempty(),
      label: z.string().optional(),
      isat: z.string().optional(),
    }),
  }),
  contact: contactSchema,
  hasSecondaryContact: z.enum([YES, NO]),
  secondaryContact: contactSchema.deepPartial(),

  applicantInformation: z.object({
    constraints: z.object({
      hasMail: z.boolean().optional(),
      mail: z.boolean().optional(),

      hasLogin: z.boolean().optional(),
      login: z.boolean().optional(),

      hasStraumur: z.string().optional(),
      straumur: z.string().optional(),

      hasWebsite: z.boolean().optional(),
      website: z.boolean().optional(),

      hasApply: z.string().optional(),
      apply: z.string().optional(),

      hasMyPages: z.string().optional(),
      myPages: z.string().optional(),

      hasCert: z.string().optional(),
      cert: z.string().optional(),

      hasConsult: z.string().optional(),
      consult: z.string().optional(),
    }),
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
  name: m.application.applicationName,
  institution: m.application.institutionName,
  readyForProduction: true,
  dataSchema,
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
          lifecycle: DEPRECATED_DefaultStateLifeCycle,
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
