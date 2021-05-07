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
import { dataSchema } from './dataSchema'
import { assign } from 'xstate'

type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.EDIT }

enum States {
  DRAFT = 'draft',
  COLLECT_SIGNATURES = 'collectSignatures',
  DECLINED = 'declined',
  IN_REVIEW = 'inReview',
  APPROVED = 'approved',
}

enum Roles {
  APPLICANT = 'applicant',
  SIGNATUREE = 'signaturee',
  ASSIGNEE = 'assignee',
}

const PartyApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.PARTY_APPLICATION,
  name: 'Framboð',
  dataSchema,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: States.DRAFT,
          progress: 0.25,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ConstituencyForm').then((module) =>
                  Promise.resolve(module.ConstituencyForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Hefja söfnun',
                  type: 'primary',
                },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.COLLECT_SIGNATURES,
          },
        },
      },
      [States.COLLECT_SIGNATURES]: {
        meta: {
          name: 'Safna meðmælum',
          progress: 0.75,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/CollectEndorsementsForm').then((val) =>
                  Promise.resolve(val.CollectEndorsementsForm),
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
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.IN_REVIEW,
          },
        },
      },
      [States.IN_REVIEW]: {
        //entry: 'assignToSupremeCourt',
        //exit: 'clearAssignees',
        meta: {
          name: 'In Review',
          progress: 0.9,
          lifecycle: DefaultStateLifeCycle,
          /*onEntry: {
            apiModuleAction: API_MODULE_ACTIONS.assignToSupremeCourt,
          },*/
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
                import('../forms/ConstituencyForm').then((module) =>
                  Promise.resolve(module.ConstituencyForm),
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
          [DefaultEvents.REJECT]: { target: States.COLLECT_SIGNATURES },
        },
      },
      [States.APPROVED]: {
        //exit: 'clearAssignees',
        meta: {
          name: States.APPROVED,
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
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
    },
  },
  stateMachineOptions: {
    actions: {
      assignToSupremeCourt: assign((context) => {
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
      console.log('assignee')
      return Roles.ASSIGNEE
    }
    // TODO: Applicant can recommend his own list
    else if (application.applicant === nationalId) {
      console.log('applicant')
      return Roles.APPLICANT
    } else if (application.state === States.COLLECT_SIGNATURES) {
      // TODO: Maybe display collection as closed in final state for signaturee
      // everyone can be signaturee if they are not the applicant
      console.log('signaturee')
      return Roles.SIGNATUREE
    } else {
      console.log('undefined')
      return undefined
    }
  },
}

export default PartyApplicationTemplate
