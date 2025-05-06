import { Events, Roles, States } from '../../utils/types'
import {
  ApplicationContext,
  ApplicationStateSchema,
  DefaultEvents,
  FormModes,
  UserProfileApi,
} from '@island.is/application/types'
import { EphemeralStateLifeCycle } from '@island.is/application/core'
import { StateNodeConfig } from 'xstate'

export const prerequisitesState: StateNodeConfig<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  meta: {
    name: 'Skilyrði',
    progress: 0,
    status: FormModes.DRAFT,
    lifecycle: EphemeralStateLifeCycle,
    roles: [
      {
        id: Roles.APPLICANT,
        formLoader: () =>
          import('../../forms/prerequisitesForm').then((module) =>
            Promise.resolve(module.Prerequisites),
          ),
        actions: [{ event: 'SUBMIT', name: 'Staðfesta', type: 'primary' }],
        write: 'all',
        read: 'all',
        api: [UserProfileApi],
        delete: true,
      },
    ],
  },
  on: {
    [DefaultEvents.SUBMIT]: {
      target: States.DRAFT,
    },
  },
}
