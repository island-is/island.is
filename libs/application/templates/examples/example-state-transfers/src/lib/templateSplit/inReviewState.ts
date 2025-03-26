import { Roles, States } from '../../utils/constants'

import { ApplicationContext, DefaultEvents } from '@island.is/application/types'

import { ApplicationStateSchema } from '@island.is/application/types'

import { FormModes } from '@island.is/application/types'
import { Events } from '../../utils/constants'
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
    roles: [
      {
        id: Roles.APPLICANT,
        formLoader: () =>
          import('../../forms/applicantInReviewForm').then((module) =>
            Promise.resolve(module.ApplicantInReviewForm),
          ),
        read: 'all',
      },
      {
        id: Roles.ASSIGNEE,
        formLoader: () =>
          import('../../forms/assigneeInReviewForm').then((module) =>
            Promise.resolve(module.AssigneeInReviewForm),
          ),
        read: 'all',
        write: 'all',
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
