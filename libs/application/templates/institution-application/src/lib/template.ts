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
  project: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    goal: z.string().optional(),
    scope: z.string().optional(),
    stakeholders: z.string().optional(),
    responsibilities: z.string().optional(),
    financing: z.string().optional(),
  }),
})

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
          progress: 0.33,
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
            target: 'inReview',
          },
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

export default template
