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

type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.EDIT }

const PartyLetterApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
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
            target: States.COLLECT_ENDORSEMENTS,
          },
        },
      },
      [States.COLLECT_ENDORSEMENTS]: {
        meta: {
          name: 'Safna meðmælum',
          progress: 0.75,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: API_MODULE_ACTIONS.CreateEndorsementList,
            shouldPersistToExternalData: true,
            throwOnError: true,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/CollectEndorsements').then((val) =>
                  Promise.resolve(val.CollectEndorsements),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              read: 'all',
              write: 'all',
            },
            {
              id: Roles.SIGNATUREE,
              formLoader: () =>
                import('../forms/EndorsementForm').then((val) =>
                  Promise.resolve(val.EndorsementForm),
                ),
              read: 'all',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.IN_REVIEW,
          },
        },
      },
      [States.IN_REVIEW]: {
        entry: 'assignToMinistryOfJustice',
        exit: 'clearAssignees',
        meta: {
          name: 'In Review',
          progress: 0.9,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: API_MODULE_ACTIONS.AssingMinistryOfJustice,
          },
          roles: [
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/InReview').then((module) =>
                  Promise.resolve(module.InReview),
                ),
              actions: [
                {
                  event: DefaultEvents.APPROVE,
                  name: 'Samþykkja',
                  type: 'primary',
                },
                { event: DefaultEvents.REJECT, name: 'Hafna', type: 'reject' },
              ],
              write: 'all',
            },
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/LetterApplicationApproved').then((module) =>
                  Promise.resolve(module.LetterApplicationApproved),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: [
            {
              target: States.APPROVED,
            },
          ],
          [DefaultEvents.REJECT]: { target: States.REJECTED },
        },
      },
      [States.REJECTED]: {
        meta: {
          name: 'Safna meðmælum',
          progress: 0.75,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: API_MODULE_ACTIONS.ApplicationRejected,
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
                import('../forms/EndorsementForm').then((val) =>
                  Promise.resolve(val.EndorsementForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Samþykkja',
                  type: 'primary',
                },
              ],
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.IN_REVIEW,
          },
          [DefaultEvents.REJECT]: { target: States.IN_REVIEW },
        },
      },
      [States.APPROVED]: {
        entry: 'assignToMinistryOfJustice',
        meta: {
          name: 'Approved',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: API_MODULE_ACTIONS.SubmitPartyLetter,
            throwOnError: true,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/LetterApplicationApproved').then((val) =>
                  Promise.resolve(val.LetterApplicationApproved),
                ),
              read: 'all',
            },
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import(
                  '../forms/LetterApplicationApprovedOverview'
                ).then((val) =>
                  Promise.resolve(val.LetterApplicationApprovedOverview),
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
            // todo: get list of ministry of justice national ids
            assignees: ['0000000000'],
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
    // todo map to ministry of justice natioanl ids
    if (application.assignees.includes('0000000000')) {
      return Roles.ASSIGNEE
    }
    // TODO: Applicant can recommend his own list
    else if (application.applicant === nationalId) {
      return Roles.APPLICANT
    } else if (
      application.state === States.COLLECT_ENDORSEMENTS ||
      States.REJECTED
    ) {
      // TODO: Maybe display collection as closed in final state for signaturee
      // everyone can be signaturee if they are not the applicant
      return Roles.SIGNATUREE
    } else {
      return undefined
    }
  },
}

export default PartyLetterApplicationTemplate
