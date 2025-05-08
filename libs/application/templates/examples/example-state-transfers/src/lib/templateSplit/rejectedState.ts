import { DefaultStateLifeCycle } from '@island.is/application/core'
import {
  ApplicationContext,
  ApplicationStateSchema,
  defineTemplateApi,
  FormModes,
} from '@island.is/application/types'
import { ApiActions, Events, Roles } from '../../utils/types'
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
    onEntry: [
      defineTemplateApi({
        action: ApiActions.rejectApplication,
        order: 1,
      }),
    ],
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
