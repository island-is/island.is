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

const nationalIdRegex = /([0-9]){6}-?([0-9]){4}/ // TODO: make this use kennitala lib

type ReferenceTemplateEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }

enum Roles {
  APPLICANT = 'applicant',
  SIGNATUREE = 'signaturee',
}
const dataSchema = z.object({
  companyNationalId: z
    .string()
    .refine((x) => (x ? nationalIdRegex.test(x) : false)),
  partyLetter: z.string().length(1),
  partyName: z.string(),
  signatures: z.array(z.string()),
})

const PartyLetterApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<ReferenceTemplateEvent>,
  ReferenceTemplateEvent
> = {
  type: ApplicationTypes.PARTY_LETTER,
  name: 'Reference application',
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
                import('../forms/LetterApplicationForm').then((module) =>
                  Promise.resolve(module.LetterApplicationForm),
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
              id: Roles.SIGNATUREE,
              formLoader: () =>
                import('../forms/CollectSignatures').then((val) =>
                  Promise.resolve(val.ReviewApplication),
                ),
              actions: [
                { event: 'APPROVE', name: 'Samþykkja', type: 'primary' },
              ],
              read: 'all',
            },
            {
              id: Roles.APPLICANT,
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

export default PartyLetterApplicationTemplate
