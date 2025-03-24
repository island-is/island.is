import { EphemeralStateLifeCycle } from '@island.is/application/core'
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
    lifecycle: EphemeralStateLifeCycle,
    roles: [
      {
        id: Roles.APPLICANT,
        formLoader: () =>
          import('../../forms/prerequisitesForm').then((module) =>
            Promise.resolve(module.Prerequisites),
          ),
      },
      {
        id: Roles.ASSIGNEE,
        formLoader: () =>
          import('../../forms/prerequisitesForm').then((module) =>
            Promise.resolve(module.Prerequisites),
          ),
      },
    ],
  },
}
