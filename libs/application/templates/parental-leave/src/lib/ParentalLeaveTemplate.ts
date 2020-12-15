import {
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTypes,
  ApplicationTemplate,
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
    initial: 'draft',
    states: {
      draft: {
        meta: {
          name: 'draft',
          progress: 0.25,
          roles: [
            {
              id: 'applicant',
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
              target: 'otherParentApproval',
              cond: needsOtherParentApproval,
            },
            { target: 'employerApproval' },
          ],
        },
      },
      otherParentApproval: {
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
              id: 'otherParent',
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
              id: 'applicant',
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
            },
          ],
        },
        on: {
          APPROVE: { target: 'employerApproval' },
          REJECT: { target: 'otherParentRequiresAction' },
        },
      },
      otherParentRequiresAction: {
        meta: {
          name: 'Other parent requires action',
          progress: 0.4,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
            },
          ],
        },
      },
      employerApproval: {
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
              id: 'employer',
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
              id: 'applicant',
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
            },
          ],
        },
        on: {
          APPROVE: { target: 'vinnumalastofnunApproval' },
          ABORT: { target: 'employerRequiresAction' },
        },
      },
      employerRequiresAction: {
        meta: {
          name: 'Employer requires action',
          progress: 0.5,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
            },
          ],
        },
      },
      vinnumalastofnunApproval: {
        meta: {
          name: 'Vinnumálastofnun Approval',
          progress: 0.75,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
            },
          ],
        },
        on: {
          APPROVE: { target: 'approved' },
          REJECT: { target: 'vinnumalastofnunRequiresAction' },
        },
      },
      vinnumalastofnunRequiresAction: {
        meta: {
          name: 'Vinnumálastofnun requires action',
          progress: 0.5,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
            },
          ],
        },
      },
      approved: {
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
  mapUserToRole(id, state): ApplicationRole {
    if (state === 'employerApproval') {
      return 'employer'
    } else if (state === 'otherParentApproval') {
      return 'otherParent'
    }
    return 'applicant'
  },
}

export default ParentalLeaveTemplate
