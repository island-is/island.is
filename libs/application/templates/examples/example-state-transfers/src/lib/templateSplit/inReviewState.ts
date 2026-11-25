import { ApiActions, Events, Roles, States } from '../../utils/types'
import {
  ApplicationContext,
  DefaultEvents,
  defineTemplateApi,
} from '@island.is/application/types'
import { ApplicationStateSchema } from '@island.is/application/types'
import { FormModes } from '@island.is/application/types'
import { DefaultStateLifeCycle } from '@island.is/application/core'
import { StateNodeConfig } from 'xstate'

export const inReviewState: StateNodeConfig<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  meta: {
    name: 'In Review',
    status: FormModes.IN_PROGRESS,
    lifecycle: DefaultStateLifeCycle,
    onEntry: [
      defineTemplateApi({
        action: ApiActions.moveToReviewState,
        order: 1,
      }),
    ],
    roles: [
      {
        id: Roles.APPLICANT,
        formLoader: () =>
          import('../../forms/applicantInReviewForm').then((module) =>
            Promise.resolve(module.ApplicantInReviewForm),
          ),
        actions: [
          {
            event: 'EDIT',
            name: 'Move application back to DRAFT',
            type: 'primary',
          },
        ],
        read: 'all',
      },
      {
        id: Roles.ASSIGNEE,
        formLoader: () =>
          import('../../forms/assigneeInReviewForm').then((module) =>
            Promise.resolve(module.AssigneeInReviewForm),
          ),
        actions: [
          { event: 'APPROVE', name: 'Approve', type: 'primary' },
          { event: 'REJECT', name: 'Reject', type: 'reject' },
        ],
        read: 'all',
        write: { answers: ['approveOrReject', 'approveOrRejectReason'] },
      },
    ],
  },
  on: {
    [DefaultEvents.EDIT]: {
      target: States.DRAFT,
      actions: 'unAssignUser',
    },
    [DefaultEvents.APPROVE]: {
      target: States.APPROVED,
    },
    [DefaultEvents.REJECT]: {
      target: States.REJECTED,
    },
  },
}
