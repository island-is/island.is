import { assign } from 'xstate'
import set from 'lodash/set'
import {
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTypes,
  ApplicationTemplate,
  Application,
  DefaultEvents,
} from '@island.is/application/core'

import { dataSchema, SchemaFormValues } from './dataSchema'
import { answerValidators } from './answerValidators'
import { YES, API_MODULE_ACTIONS } from '../constants'

import {
  hasEmployer,
  needsOtherParentApproval,
} from './parentalLeaveTemplateUtils'

type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ABORT }
  | { type: DefaultEvents.EDIT }

enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}

export enum States {
  // First flow
  DRAFT = 'draft',

  OTHER_PARENT_APPROVAL = 'otherParentApproval',
  OTHER_PARENT_ACTION = 'otherParentRequiresAction',

  EMPLOYER_WAITING_TO_ASSIGN = 'employerWaitingToAssign',
  EMPLOYER_APPROVAL = 'employerApproval',
  EMPLOYER_ACTION = 'employerRequiresAction',

  VINNUMALASTOFNUN_APPROVAL = 'vinnumalastofnunApproval',
  VINNUMALASTOFNUN_ACTION = 'vinnumalastofnunRequiresAction',

  APPROVED = 'approved',

  // Edit Flow
  EDIT_OR_ADD_PERIODS = 'editOrAddPeriods',

  EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS = 'employerWaitingToAssignForEdits',
  EMPLOYER_APPROVE_EDITS = 'employerApproveEdits',
  EMPLOYER_EDITS_ACTION = 'employerRequiresActionOnEdits',

  VINNUMALASTOFNUN_APPROVE_EDITS = 'vinnumalastofnunApproveEdits',
  VINNUMALASTOFNUN_EDITS_ACTION = 'vinnumalastofnunRequiresActionOnEdits',
}

const ParentalLeaveTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.PARENTAL_LEAVE,
  name: 'Umsókn um fæðingarorlof',
  dataSchema,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: States.DRAFT,
          progress: 0.25,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ParentalLeaveForm').then((val) =>
                  Promise.resolve(val.ParentalLeaveForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          SUBMIT: [
            {
              target: States.OTHER_PARENT_APPROVAL,
              cond: needsOtherParentApproval,
            },
            { target: States.EMPLOYER_WAITING_TO_ASSIGN },
          ],
        },
      },

      [States.OTHER_PARENT_APPROVAL]: {
        entry: 'assignToOtherParent',
        exit: 'clearAssignees',
        meta: {
          name: 'Needs other parent approval',
          progress: 0.4,
          onEntry: {
            apiModuleAction: API_MODULE_ACTIONS.assignOtherParent,
          },
          roles: [
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/OtherParentApproval').then((val) =>
                  Promise.resolve(val.OtherParentApproval),
                ),
              actions: [
                {
                  event: DefaultEvents.APPROVE,
                  name: 'Approve',
                  type: 'primary',
                },
                { event: DefaultEvents.REJECT, name: 'Reject', type: 'reject' },
              ],
            },
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: [
            {
              target: States.EMPLOYER_WAITING_TO_ASSIGN,
              cond: hasEmployer,
            },
            {
              target: States.VINNUMALASTOFNUN_APPROVAL,
            },
          ],
          [DefaultEvents.REJECT]: { target: States.OTHER_PARENT_ACTION },
        },
      },
      [States.OTHER_PARENT_ACTION]: {
        meta: {
          name: 'Other parent requires action',
          progress: 0.4,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/DraftRequiresAction').then((val) =>
                  Promise.resolve(val.DraftRequiresAction),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: { target: States.DRAFT },
        },
      },
      [States.EMPLOYER_WAITING_TO_ASSIGN]: {
        exit: 'saveEmployerNationalRegistryId',
        meta: {
          name: 'Waiting to assign employer',
          progress: 0.4,
          onEntry: {
            apiModuleAction: API_MODULE_ACTIONS.assignEmployer,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.ASSIGN]: { target: States.EMPLOYER_APPROVAL },
          [DefaultEvents.REJECT]: { target: States.DRAFT }, // TODO: This should go to the needs action screen, and then they can go to states.DRAFT.
        },
      },
      [States.EMPLOYER_APPROVAL]: {
        exit: 'clearAssignees',
        meta: {
          name: 'Employer Approval',
          progress: 0.5,
          roles: [
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/EmployerApproval').then((val) =>
                  Promise.resolve(val.EmployerApproval),
                ),
              read: { answers: ['periods'], externalData: ['pregnancyStatus'] },
              actions: [
                {
                  event: DefaultEvents.APPROVE,
                  name: 'Approve',
                  type: 'primary',
                },
                { event: DefaultEvents.REJECT, name: 'Reject', type: 'reject' },
              ],
            },
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: { target: States.VINNUMALASTOFNUN_APPROVAL },
          [DefaultEvents.REJECT]: { target: States.EMPLOYER_ACTION },
        },
      },
      [States.EMPLOYER_ACTION]: {
        meta: {
          name: 'Employer requires action',
          progress: 0.5,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/DraftRequiresAction').then((val) =>
                  Promise.resolve(val.DraftRequiresAction),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: { target: States.DRAFT },
        },
      },
      [States.VINNUMALASTOFNUN_APPROVAL]: {
        meta: {
          name: 'Vinnumálastofnun Approval',
          progress: 0.75,
          onEntry: {
            apiModuleAction: API_MODULE_ACTIONS.sendApplication,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          // TODO: How does VMLST approve? Do we need a form like in employer approval?
          // Or is it a webhook that sets the application as approved?
          [DefaultEvents.APPROVE]: { target: States.APPROVED },
          [DefaultEvents.REJECT]: { target: States.VINNUMALASTOFNUN_ACTION },
        },
      },
      [States.VINNUMALASTOFNUN_ACTION]: {
        meta: {
          name: 'Vinnumálastofnun requires action',
          progress: 0.5,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/DraftRequiresAction').then((val) =>
                  Promise.resolve(val.DraftRequiresAction),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: { target: States.DRAFT },
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
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        type: 'final' as const,
        on: {
          [DefaultEvents.EDIT]: { target: States.EDIT_OR_ADD_PERIODS },
        },
      },

      // Edit Flow States
      [States.EDIT_OR_ADD_PERIODS]: {
        // entry: 'copyPeriodsToTemp',
        // exit: 'mergePeriodAnswers',
        meta: {
          name: States.EDIT_OR_ADD_PERIODS,
          progress: 1,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/EditOrAddPeriods').then((val) =>
                  Promise.resolve(val.EditOrAddPeriods),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
                {
                  event: DefaultEvents.ABORT,
                  name: 'Abort',
                  type: 'abort',
                },
              ],
              write: 'all',
              read: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: [
            {
              target: States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
              cond: hasEmployer,
            },
            { target: States.VINNUMALASTOFNUN_APPROVE_EDITS },
          ],
          [DefaultEvents.ABORT]: [
            {
              target: States.APPROVED,
            },
          ],
        },
      },

      [States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS]: {
        exit: 'saveEmployerNationalRegistryId',
        meta: {
          name: 'Waiting to assign employer to review period edits',
          progress: 0.4,
          onEntry: {
            apiModuleAction: API_MODULE_ACTIONS.assignEmployer,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/EditsInReview').then((val) =>
                  Promise.resolve(val.EditsInReview),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.ASSIGN]: { target: States.EMPLOYER_APPROVE_EDITS },
          [DefaultEvents.REJECT]: { target: States.EMPLOYER_EDITS_ACTION },
        },
      },

      [States.EMPLOYER_APPROVE_EDITS]: {
        meta: {
          name: 'Employer is reviewing the period edits',
          progress: 0.4,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/EditsInReview').then((val) =>
                  Promise.resolve(val.EditsInReview),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: {
            target: States.VINNUMALASTOFNUN_APPROVE_EDITS,
          },
          [DefaultEvents.REJECT]: { target: States.EMPLOYER_EDITS_ACTION },
        },
      },
      [States.EMPLOYER_EDITS_ACTION]: {
        meta: {
          name: 'Employer rejected the period edits',
          progress: 0.4,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/EditsRequireAction').then((val) =>
                  Promise.resolve(val.EditsRequireAction),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: {
            target: States.EDIT_OR_ADD_PERIODS,
          },
          [DefaultEvents.ABORT]: { target: States.APPROVED },
        },
      },
      [States.VINNUMALASTOFNUN_APPROVE_EDITS]: {
        meta: {
          name: 'VMLST is reviewing the period edits',
          progress: 0.4,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/EditsInReview').then((val) =>
                  Promise.resolve(val.EditsInReview),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: { target: States.APPROVED },
          [DefaultEvents.REJECT]: {
            target: States.VINNUMALASTOFNUN_EDITS_ACTION,
          },
        },
      },
      [States.VINNUMALASTOFNUN_EDITS_ACTION]: {
        meta: {
          name: 'VMLST rejected the period edits',
          progress: 0.4,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/EditsRequireAction').then((val) =>
                  Promise.resolve(val.EditsRequireAction),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: {
            target: States.EDIT_OR_ADD_PERIODS,
          },
          [DefaultEvents.ABORT]: { target: States.APPROVED },
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      /*
      When the user enters the edit state we will copy the current
      periods to temp so that if they cancel out, we will bring
      back the original periods answer.
      */
      // copyPeriodsToTemp: assign((context, event) => {
      //   // Only continue if going to edit (skip init event)
      //   if (event.type !== DefaultEvents.EDIT) {
      //     return context
      //   }

      //   const currentApplicationAnswers = context.application.answers

      //   if (currentApplicationAnswers['periods'] !== undefined) {
      //     return {
      //       ...context,
      //       application: {
      //         ...context.application,
      //         answers: {
      //           ...context.application.answers,
      //           tempPeriods: currentApplicationAnswers['periods'],
      //         },
      //       },
      //     }
      //   }
      //   return context
      // }),
      /*
      When the user submits or cancels an edit we no longer need to 
      store temp periods, so we will clear them out from the answers.
      */
      // mergePeriodAnswers: assign((context, event) => {
      //   console.log('######mergePeriodAnswers#######', event.type)

      //   // Only continue if submiting or aborting (skip init event)
      //   if (
      //     event.type !== DefaultEvents.SUBMIT &&
      //     event.type !== DefaultEvents.REJECT
      //   ) {
      //     return context
      //   }

      //   console.log('22222######mergePeriodAnswers#######', event.type)

      //   // If they are aborting, bring back the old periods from temp,
      //   // otherwise we already saved the periods, so just need
      //   // to clear temp
      //   const periodsToSave =
      //     event.type === DefaultEvents.REJECT
      //       ? Object.assign(
      //           context.application.answers['tempPeriods'] as Object,
      //         )
      //       : context.application.answers['periods']

      //   // Don't need these anymore so let's remove them.
      //   delete context.application.answers['tempPeriods']

      //   return {
      //     ...context,
      //     application: {
      //       ...context.application,
      //       answers: {
      //         ...context.application.answers,
      //         periods: periodsToSave,
      //       },
      //     },
      //   }
      // }),

      assignToOtherParent: assign((context) => {
        const currentApplicationAnswers = context.application
          .answers as SchemaFormValues

        if (
          currentApplicationAnswers.requestRights.isRequestingRights === YES &&
          currentApplicationAnswers.otherParentId !== undefined &&
          currentApplicationAnswers.otherParentId !== ''
        ) {
          return {
            ...context,
            application: {
              ...context.application,
              assignees: [currentApplicationAnswers.otherParentId],
            },
          }
        }
        return context
      }),
      saveEmployerNationalRegistryId: assign((context, event) => {
        // Only save if employer gets assigned
        if (event.type !== DefaultEvents.ASSIGN) {
          return context
        }

        const { application } = context
        const { answers } = application

        set(answers, 'employer.nationalRegistryId', application.assignees[0])

        return {
          ...context,
          application,
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
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (id === application.applicant) {
      return Roles.APPLICANT
    }
    if (application.assignees.includes(id)) {
      return Roles.ASSIGNEE
    }
    return undefined
  },
  answerValidators,
}

export default ParentalLeaveTemplate
