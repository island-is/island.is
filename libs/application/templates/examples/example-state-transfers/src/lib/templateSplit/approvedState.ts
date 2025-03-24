import {
  ApplicationContext,
  FormModes,
  ApplicationStateSchema,
} from '@island.is/application/types'
import { Events, Roles } from '../../utils/constants'
import { StateNodeConfig } from 'xstate'
import { EphemeralStateLifeCycle } from '@island.is/application/core'

export const approvedState: StateNodeConfig<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  meta: {
    name: 'Approved',
    progress: 100,
    status: FormModes.APPROVED,
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
