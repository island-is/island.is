import { DefaultStateLifeCycle } from '@island.is/application/core'
import {
  ApplicationContext,
  ApplicationStateSchema,
  FormModes,
} from '@island.is/application/types'
import { Events, Roles } from '../../utils/constants'
import { StateNodeConfig } from 'xstate'

export const rejectedState: StateNodeConfig<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  meta: {
    name: 'Rejected',
    progress: 100,
    status: FormModes.REJECTED,
    lifecycle: DefaultStateLifeCycle,
    roles: [
      {
        id: Roles.APPLICANT,
        formLoader: () =>
          import('../../forms/applicantRejectedForm').then((module) =>
            Promise.resolve(module.ApplicantRejectedForm),
          ),
        write: 'all',
        read: 'all',
        delete: true,
      },
      {
        id: Roles.ASSIGNEE,
        formLoader: () =>
          import('../../forms/assigneeRejectedForm').then((module) =>
            Promise.resolve(module.AssigneeRejectedForm),
          ),
        write: 'all',
        read: 'all',
        delete: true,
      },
    ],
  },
}
