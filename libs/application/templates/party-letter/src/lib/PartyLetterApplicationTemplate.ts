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
import { API_MODULE_ACTIONS, States, Roles } from '../constants'
import { PartyLetterSchema } from './dataSchema'
import { assign } from 'xstate'

type PartyLetterApplicationTemplateEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.REJECT }


const PartyLetterApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<PartyLetterApplicationTemplateEvent>,
  PartyLetterApplicationTemplateEvent
> = {
  type: ApplicationTypes.PARTY_LETTER,
  name: 'Listabókstafur',
  dataSchema: PartyLetterSchema,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
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
            target: States.COLLECT_ENDORSEMENTS,
          },
        },
      },
      [States.COLLECT_ENDORSEMENTS]: {
        meta: {
          name: 'In Review',
          progress: 0.75,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: API_MODULE_ACTIONS.CreateEndorsementList,
          },
          roles: [
            {
              id: Roles.SIGNATUREE,
              formLoader: () =>
                import('../forms/EndorsementForm').then((val) =>
                  Promise.resolve(val.EndorsementForm),
                ),
              read: 'all',
            },
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/CollectEndorsements').then((val) =>
                  Promise.resolve(val.CollectEndorsements),
                ),
              actions: [
                { event: 'APPROVE', name: 'Samþykkja', type: 'primary' },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          APPROVE: {
            target: States.APPROVED,
          },
        },
      },
      [States.REJECTED]: {
        meta: {
          name: 'In Review',
          progress: 0.75,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: API_MODULE_ACTIONS.ApplicationApproved,
          },
          roles: [
            {
              id: Roles.SIGNATUREE,
              formLoader: () =>
                import('../forms/EndorsementForm').then((val) =>
                  Promise.resolve(val.EndorsementForm),
                ),
              read: 'all',
            },
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/CollectEndorsements').then((val) =>
                  Promise.resolve(val.CollectEndorsements),
                ),
              actions: [
                { event: 'APPROVE', name: 'Samþykkja', type: 'primary' },
              ],
              write: 'all',
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
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: API_MODULE_ACTIONS.ApplicationApproved,
          },
          roles: [
            {
              id: Roles.SIGNATUREE,
              formLoader: () =>
                import('../forms/EndorsementApproved').then((val) =>
                  Promise.resolve(val.EndorsementApproved),
                ),
            },
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/LetterApplicationApproved').then((val) =>
                  Promise.resolve(val.LetterApplicationApproved),
                ),
              read: 'all',
            },
          ],
        },
        type: 'final' as const,
      },
    },
  },
  stateMachineOptions: {
    actions: {
      assignToMinistryOfJustice: assign((context) => {
        return {
          ...context,
          application: {
            ...context.application,
            // todo: get list of supreme court national ids
            assignees: ['3105913789'],
          },
        }
      }),
      clearAssignees: assign((context) => ({
        ...context,
        application: {
          ...context.application,
          assignees: [],
        },
      })),
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    // todo map to supreme court natioanl ids
    if (application.assignees.includes('3105913789')) {
      return Roles.ASSIGNEE
    }
    // TODO: Applicant can recommend his own list
    else if (application.applicant === nationalId) {
      return Roles.APPLICANT
    } else if (application.state === States.COLLECT_ENDORSEMENTS) {
      // TODO: Maybe display collection as closed in final state for signaturee
      // everyone can be signaturee if they are not the applicant
      return Roles.SIGNATUREE
    } else {
      return undefined
    }
  },
}

export default PartyLetterApplicationTemplate
