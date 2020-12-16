import {
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTypes,
  ApplicationTemplate,
  Application,
} from '@island.is/application/core'
import { assign } from 'xstate'

import assignParentTemplate from '../emailTemplates/assignToParent'
import assignEmployerTemplate from '../emailTemplates/assignToEmployer'
import { dataSchema, SchemaFormValues } from './dataSchema'

type Events =
  | { type: 'APPROVE' }
  | { type: 'REJECT' }
  | { type: 'SUBMIT' }
  | { type: 'ABORT' }

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
  EMPLOYER_APPROVAL = 'employerApproval',
  EMPLOYER_ACTION = 'employerRequiresAction',
  IN_REVIEW = 'inReview',
  APPROVED = 'approved',
}

function needsOtherParentApproval(context: ApplicationContext) {
  const currentApplicationAnswers = context.application
    .answers as SchemaFormValues
  return currentApplicationAnswers.requestRights === 'yes'
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
              actions: [{ event: 'SUBMIT', name: 'Submit', type: 'primary' }],
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
            { target: States.EMPLOYER_APPROVAL },
          ],
        },
      },
      [States.OTHER_PARENT_APPROVAL]: {
        entry: 'assignToOtherParent',
        invoke: {
          src: {
            type: 'emailService',
            emailTemplate: assignParentTemplate,
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
                { event: 'APPROVE', name: 'Approve', type: 'primary' },
                { event: 'REJECT', name: 'Reject', type: 'reject' },
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
          APPROVE: { target: States.EMPLOYER_APPROVAL },
          REJECT: { target: States.OTHER_PARENT_ACTION },
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
      [States.EMPLOYER_APPROVAL]: {
        entry: 'assignToEmployer',
        invoke: {
          src: {
            type: 'emailService',
            emailTemplate: assignEmployerTemplate,
          },
        },
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
              read: { answers: ['periods'] },
              actions: [
                { event: 'APPROVE', name: 'Approve', type: 'primary' },
                { event: 'REJECT', name: 'Reject', type: 'reject' },
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
          APPROVE: { target: States.VINNUMALASTOFNUN_APPROVAL },
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
          APPROVE: { target: States.APPROVED },
          REJECT: { target: States.VINNUMALASTOFNUN_ACTION },
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
          currentApplicationAnswers.requestRights === 'yes' &&
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
      assignToEmployer: assign((context) => {
        // here we might go the email route instead.
        const currentApplicationAnswers = context.application
          .answers as SchemaFormValues
        if (
          currentApplicationAnswers.employer.nationalRegistryId !== undefined &&
          currentApplicationAnswers.employer.nationalRegistryId !== ''
        ) {
          return {
            ...context,
            application: {
              ...context.application,
              assignees: [
                currentApplicationAnswers.employer.nationalRegistryId,
              ],
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
