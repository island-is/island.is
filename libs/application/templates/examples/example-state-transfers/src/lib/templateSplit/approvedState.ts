import {
  ApplicationContext,
  FormModes,
  ApplicationStateSchema,
} from '@island.is/application/types'
import { Events, Roles } from '../../utils/constants'
import { StateNodeConfig } from 'xstate'
import { DefaultStateLifeCycle } from '@island.is/application/core'

export const approvedState: StateNodeConfig<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  meta: {
    name: 'Approved',
    progress: 100,
    status: FormModes.APPROVED,
    lifecycle: DefaultStateLifeCycle,
    roles: [
      {
        id: Roles.APPLICANT,
        formLoader: () =>
          import('../../forms/applicantApprovedForm').then((module) =>
            Promise.resolve(module.ApplicantApprovedForm),
          ),
        write: 'all',
        read: 'all',
      },
      {
        id: Roles.ASSIGNEE,
        formLoader: () =>
          import('../../forms/assigneeApprovedForm').then((module) =>
            Promise.resolve(module.AssigneeApprovedForm),
          ),
        write: 'all',
        read: 'all',
      },
    ],
  },
}
