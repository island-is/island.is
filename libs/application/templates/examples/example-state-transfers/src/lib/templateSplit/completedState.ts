import { DefaultStateLifeCycle } from '@island.is/application/core'
import { Events, Roles } from '../../utils/types'
import {
  ApplicationContext,
  defineTemplateApi,
} from '@island.is/application/types'
import { ApplicationStateSchema } from '@island.is/application/types'
import { StateNodeConfig } from 'xstate'
import { ApiActions } from '../../utils/types'

export const completedState: StateNodeConfig<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  meta: {
    name: 'Completed',
    status: 'completed',
    lifecycle: DefaultStateLifeCycle,
    // This runs when we try to state transfer to this state
    onEntry: [
      defineTemplateApi({
        action: ApiActions.completeApplication,
        order: 1,
      }),
    ],
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
