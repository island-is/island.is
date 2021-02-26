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
    background: z.string().optional(),
    goals: z.string().optional(),
    scope: z.string().optional(),
    finance: z.string().optional(),
    stakeholders: z.string().optional(),
    role: z.string().optional(),
  }),
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
