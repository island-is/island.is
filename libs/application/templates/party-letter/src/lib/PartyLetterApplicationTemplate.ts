import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  DefaultStateLifeCycle,
} from '@island.is/application/core'
import * as z from 'zod'
import { answerValidators } from './answerValidators'
import { ACTIVE_PARTIES } from '../fields/PartyLetter'
import { m } from '../lib/messages'

type ReferenceTemplateEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }

enum Roles {
  APPLICANT = 'applicant',
  SIGNATUREE = 'signaturee',
}

const dataSchema = z.object({
  approveTermsAndConditions: z
    .boolean()
    .refine(
      (v) => v,
      m.validationMessages.approveTerms.defaultMessage as string,
    ),
  ssd: z.string().refine((p) => {
    return p.trim().length > 0
  }, m.validationMessages.ssd.defaultMessage as string),
  party: z.object({
    letter: z
      .string()
      .refine((p) => {
        return p.trim().length === 1
      }, m.validationMessages.partyLetterSingle.defaultMessage as string)
      .refine((p) => {
        return ACTIVE_PARTIES.filter((x) => p === x.letter).length === 0
      }, m.validationMessages.partyLetterOccupied.defaultMessage as string),
    name: z
      .string()
      .refine(
        (p) => p.trim().length > 0,
        m.validationMessages.partyName.defaultMessage as string,
      ),
  }),
  signatures: z.array(z.string()), // todo validate that signatures are >= 300
})

const PartyLetterApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<ReferenceTemplateEvent>,
  ReferenceTemplateEvent
> = {
  type: ApplicationTypes.PARTY_LETTER,
  name: 'Party letter',
  dataSchema,
  stateMachineConfig: {
    initial: 'draft',
    states: {
      draft: {
        meta: {
          name: 'draft',
          progress: 0.25,
          lifecycle: DefaultStateLifeCycle,
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
          lifecycle: DefaultStateLifeCycle,
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
          lifecycle: DefaultStateLifeCycle,
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
  answerValidators,
}

export default PartyLetterApplicationTemplate
