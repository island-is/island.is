import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
} from '@island.is/application/core'
import * as z from 'zod'
import { m } from './messages'

type ReferenceTemplateEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }

enum Roles {
  APPLICANT = 'applicant',
  SIGNATUREE = 'signaturee',
}
const dataSchema = z.object({
  constituency: z
    .string()
    .refine((v) => v, m.validation.selectConstituency.defaultMessage as string),
  approveDisclaimer: z.boolean().refine((v) => v, {
    message: m.validation.approveTerms.defaultMessage as string,
  }),
})

const PartyApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<ReferenceTemplateEvent>,
  ReferenceTemplateEvent
> = {
  type: ApplicationTypes.PARTY_APPLICATION,
  name: 'Framboð',
  dataSchema,
  stateMachineConfig: {
    initial: 'draft',
    states: {
      draft: {
        meta: {
          name: 'draft',
          progress: 0.25,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ConstituencyForm').then((module) =>
                  Promise.resolve(module.ConstituencyForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Hefja söfnun', type: 'primary' },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          SUBMIT: {
            target: 'collectSignatures',
          },
        },
      },
      collectSignatures: {
        meta: {
          name: 'In Review',
          progress: 0.75,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ApplicationForm').then((val) =>
                  Promise.resolve(val.ApplicationForm),
                ),
              actions: [
                { event: 'APPROVE', name: 'Samþykkja', type: 'primary' },
              ],
              read: 'all',
            },
            {
              id: Roles.SIGNATUREE,
              formLoader: () =>
                import('../forms/CollectSignatures').then((val) =>
                  Promise.resolve(val.ReviewApplication),
                ),
              read: 'all',
            },
          ],
        },
        on: {
          APPROVE: {
            target: 'approved',
          },
        },
      },
      approved: {
        meta: {
          name: 'Approved',
          progress: 1,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Approved').then((val) =>
                  Promise.resolve(val.Approved),
                ),
              read: 'all',
            },
          ],
        },
        type: 'final' as const,
      },
    },
  },
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (application.state === 'inReview') {
      return Roles.SIGNATUREE
    }
    return Roles.APPLICANT
  },
}

export default PartyApplicationTemplate
