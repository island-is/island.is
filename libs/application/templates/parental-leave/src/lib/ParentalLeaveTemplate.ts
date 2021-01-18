import { assign } from 'xstate'
import {
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTypes,
  ApplicationTemplate,
  Application,
  DefaultEvents,
} from '@island.is/application/core'
import { ApplicationAPITemplateAction } from '@island.is/application/api-template-utils'

import {
  generateAssignParentTemplate,
  generateAssignReviewerTemplate,
} from '../emailTemplateGenerators'
import { dataSchema, SchemaFormValues } from './dataSchema'
import { YES } from '../constants'

interface ApiTemplateUtilActions {
  [key: string]: ApplicationAPITemplateAction
}

const TEMPLATE_API_ACTIONS: ApiTemplateUtilActions = {
  assignParentThroughEmail: {
    type: 'assignThroughEmail',
    generateTemplate: generateAssignParentTemplate,
  },
  assignReviewerThroughEmail: {
    type: 'assignThroughEmail',
    generateTemplate: generateAssignReviewerTemplate,
  },
}

type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ABORT }

enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}

enum States {
  DRAFT = 'draft',
  OTHER_PARENT_APPROVAL = 'otherParentApproval',
  OTHER_PARENT_ACTION = 'otherParentRequiresAction',
  VINNUMALASTOFNUN_APPROVAL = 'vinnumalastofnunApproval',
  VINNUMALASTOFNUN_ACTION = 'vinnumalastofnunRequiresAction',
  EMPLOYER_WAITING_TO_ASSIGN = 'employerWaitingToAssign',
  EMPLOYER_APPROVAL = 'employerApproval',
  EMPLOYER_ACTION = 'employerRequiresAction',
  IN_REVIEW = 'inReview',
  APPROVED = 'approved',
}

function needsOtherParentApproval(context: ApplicationContext) {
  const currentApplicationAnswers = context.application
    .answers as SchemaFormValues
  return currentApplicationAnswers.requestRights.isRequestingRights === YES
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
        invoke: {
          src: {
            type: 'apiTemplateUtils',
            action: TEMPLATE_API_ACTIONS.assignParentThroughEmail,
          },
        },
        meta: {
          name: 'Needs other parent approval',
          progress: 0.4,
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
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: {
            target: States.EMPLOYER_WAITING_TO_ASSIGN,
          },
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
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
            },
          ],
        },
      },
      [States.EMPLOYER_WAITING_TO_ASSIGN]: {
        invoke: {
          src: {
            type: 'apiTemplateUtils',
            action: TEMPLATE_API_ACTIONS.assignReviewerThroughEmail,
            // TODO: handle async onDone / onError when transitioning states
          },
        },
        meta: {
          name: 'Waiting to assign employer',
          progress: 0.4,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
            },
          ],
        },
        on: {
          [DefaultEvents.ASSIGN]: { target: States.EMPLOYER_APPROVAL },
          [DefaultEvents.REJECT]: { target: States.DRAFT },
        },
      },
      [States.EMPLOYER_APPROVAL]: {
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
              read: {
                answers: ['spread', 'periods'],
                externalData: ['pregnancyStatus', 'parentalLeaves'],
              },
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: { target: States.VINNUMALASTOFNUN_APPROVAL },
          ABORT: { target: States.EMPLOYER_ACTION },
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
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
            },
          ],
        },
      },
      [States.VINNUMALASTOFNUN_APPROVAL]: {
        meta: {
          name: 'Vinnumálastofnun Approval',
          progress: 0.75,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
            },
          ],
        },
        on: {
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
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
            },
          ],
        },
      },
      [States.APPROVED]: {
        meta: {
          name: 'Approved',
          progress: 1,
        },
        type: 'final' as const,
      },
    },
  },
  stateMachineOptions: {
    actions: {
      assignToOtherParent: assign((context) => {
        const currentApplicationAnswers = context.application
          .answers as SchemaFormValues
        if (
          currentApplicationAnswers.requestRights.isRequestingRights ===
            'yes' &&
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
}

export default ParentalLeaveTemplate
