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

enum States {
  DRAFT = 'draft',
  COLLECT_SIGNATURES = 'collectSignatures',
  APPROVED = 'approved',
}

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
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
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
            target: States.COLLECT_SIGNATURES,
          },
        },
      },
      [States.COLLECT_SIGNATURES]: {
        meta: {
          name: 'In Review',
          progress: 0.75,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/CollectEndorsementsForm').then((val) =>
                  Promise.resolve(val.CollectEndorsementsForm),
                ),
              actions: [
                { event: 'APPROVE', name: 'Samþykkja', type: 'primary' },
              ],
              write: 'all',
            },
            {
              id: Roles.SIGNATUREE,
              formLoader: () =>
                import('../forms/EndorsementForm').then((val) =>
                  Promise.resolve(val.EndorsementApplication),
                ),
              read: 'all',
            },
          ],
        },
        on: {
          APPROVE: {
            target: States.APPROVED,
          },
        },
      },
      [States.APPROVED]: {
        meta: {
          name: 'Approved',
          progress: 1,
          roles: [
            {
              id: Roles.SIGNATUREE,
              formLoader: () =>
                import('../forms/EndorsementApproved').then((val) =>
                  Promise.resolve(val.EndorsementApproved),
                ),
              read: 'all',
            },
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
    }, // urlið úr browsernum
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    // TODO: Applicant can recommend his own list
    if (application.applicant === nationalId) {
      return Roles.APPLICANT
    } else if (application.state === States.COLLECT_SIGNATURES) {
      // TODO: Maybe display collection as closed in final state for signaturee
      // everyone can be signaturee if they are not the applicant
      return Roles.SIGNATUREE
    } else {
      return undefined
    }
  },
}

export default PartyApplicationTemplate
