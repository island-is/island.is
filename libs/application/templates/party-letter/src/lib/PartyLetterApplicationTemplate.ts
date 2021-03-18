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
import { isValid } from 'kennitala'
import { answerValidators } from './answerValidators'

type PartyLetterTemplateEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }

enum Roles {
  APPLICANT = 'applicant',
  SIGNATUREE = 'signaturee',
}

enum States {
  DRAFT = 'draft',
  COLLECT_SIGNATURES = 'collectSignatures',
  APPROVED = 'approved',
}

const dataSchema = z.object({
  selectKennitala: z.string().refine((x) => isValid(x)),
  partyLetter: z.string().length(1),
  partyName: z.string(),
  signatures: z.array(z.string()),
})

const PartyLetterApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<PartyLetterTemplateEvent>,
  PartyLetterTemplateEvent
> = {
  type: ApplicationTypes.PARTY_LETTER,
  name: 'Party letter',
  dataSchema,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Draft',
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
              id: Roles.SIGNATUREE,
              formLoader: () =>
                import('../forms/CollectSignatures').then((val) =>
                  Promise.resolve(val.ReviewApplication),
                ),
              write: 'all',
              read: 'all', // TODO: Scope access to data here so signaturee can't see other signaturee data
            },
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/CollectSignaturesOverview').then((val) =>
                  Promise.resolve(val.CollectSignaturesOverview),
                ),
              actions: [
                {
                  event: DefaultEvents.APPROVE,
                  name: 'Samþykkja',
                  type: 'primary',
                },
              ],
              read: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: {
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
  answerValidators,
}

export default PartyLetterApplicationTemplate
