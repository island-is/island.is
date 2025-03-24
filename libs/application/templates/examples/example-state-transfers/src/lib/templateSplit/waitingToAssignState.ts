import { Roles, States } from '../../utils/constants'

import { ApplicationContext, DefaultEvents } from '@island.is/application/types'

import { ApplicationStateSchema } from '@island.is/application/types'

import { FormModes } from '@island.is/application/types'
import { Events } from '../../utils/constants'
import { DefaultStateLifeCycle } from '@island.is/application/core'
import { StateNodeConfig } from 'xstate'

export const waitingToAssignState: StateNodeConfig<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  meta: {
    name: 'In Progress',
    status: FormModes.IN_PROGRESS,
    lifecycle: DefaultStateLifeCycle,
    roles: [
      {
        id: Roles.APPLICANT,
        formLoader: () =>
          import('../../forms/waitingToAssignForm').then((module) =>
            Promise.resolve(module.PendingReview),
          ),
        read: 'all',
      },
      {
        id: Roles.ASSIGNEE,
        formLoader: () =>
          import('../../forms/assigneeForm').then((module) =>
            Promise.resolve(module.AssigneeForm),
          ),
        read: 'all',
      },
    ],
  },
  on: {
    [DefaultEvents.EDIT]: {
      target: States.DRAFT,
      actions: 'unAssignUser',
    },
  },
}
