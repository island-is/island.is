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
          ],
        },
        on: {
          APPROVE: { target: 'employerApproval' },
          REJECT: { target: 'draft' },
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
              read: {
                answers: ['spread', 'periods'],
                externalData: ['pregnancyStatus', 'parentalLeaves'],
              },
            },
          ],
        },
        on: {
          APPROVE: { target: 'inReview' },
          ABORT: { target: 'draft' },
        },
      },
      inReview: {
        meta: {
          name: 'In Review',
          progress: 0.75,
        },
        on: {
          APPROVE: { target: 'approved' },
          REJECT: { target: 'draft' },
        },
      },
      approved: {
        meta: {
          name: 'Approved',
          progress: 1,
        },
        type: 'final' as const,
      },
      rejected: {
        meta: {
          name: 'Rejected',
        },
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
