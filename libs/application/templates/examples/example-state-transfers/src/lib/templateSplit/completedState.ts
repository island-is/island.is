import { DefaultStateLifeCycle } from '@island.is/application/core'
import { Events, Roles } from '../../utils/constants'
import { ApplicationContext } from '@island.is/application/types'
import { ApplicationStateSchema } from '@island.is/application/types'
import { StateNodeConfig } from 'xstate'

export const completedState: StateNodeConfig<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  meta: {
    name: 'Completed',
    status: 'completed',
    lifecycle: DefaultStateLifeCycle,
    roles: [
      {
        id: Roles.APPLICANT,
        formLoader: () =>
          import('../../forms/completedForm').then((module) =>
            Promise.resolve(module.completedForm),
          ),
        write: 'all',
        read: 'all',
      },
    ],
  },
}
