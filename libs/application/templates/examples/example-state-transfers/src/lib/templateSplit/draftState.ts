import {
  ApplicationContext,
  ApplicationStateSchema,
  DefaultEvents,
  FormModes,
} from '@island.is/application/types'
import { Events, Roles, States } from '../../utils/types'
import { DefaultStateLifeCycle } from '@island.is/application/core'
import { StateNodeConfig } from 'xstate'

export const draftState: StateNodeConfig<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  meta: {
    name: 'Main form',
    progress: 0.4,
    status: FormModes.DRAFT,
    lifecycle: DefaultStateLifeCycle,
    roles: [
      {
        id: Roles.APPLICANT,
        formLoader: () =>
          import('../../forms/mainForm').then((module) =>
            Promise.resolve(module.MainForm),
          ),
        actions: [{ event: 'SUBMIT', name: 'Staðfesta', type: 'primary' }],
        write: 'all',
        read: 'all',
        delete: true,
      },
    ],
  },
  // Here you can have different events sending the applications into different
  // states depending on what is triggered
  on: {
    [DefaultEvents.SUBMIT]: {
      target: States.COMPLETED,
    },
    [DefaultEvents.ASSIGN]: {
      target: States.IN_REVIEW,
    },
  },
}
