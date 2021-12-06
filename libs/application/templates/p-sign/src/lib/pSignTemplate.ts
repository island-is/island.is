import {
  ApplicationTemplate,
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTypes,
  ApplicationRole,
  DefaultStateLifeCycle,
} from '@island.is/application/core'
import { ApiModuleActions, Events, States, Roles } from './constants'
import { dataSchema } from './dataSchema'

const PSignTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.P_SIGN,
  name: '',
  dataSchema: dataSchema,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Draft',
          actionCard: {
            description: 'Umsókn um P-Merki',
          },
          progress: 0.33,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/application').then((val) =>
                  Promise.resolve(val.getApplication()),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          SUBMIT: {
            target: States.DONE,
          },
        },
      },
      [States.DONE]: {
        meta: {
          name: 'Done',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: ApiModuleActions.createPSignApplication,
            shouldPersistToExternalData: true,
            throwOnError: true,
          },
          roles: [
            {
              id: 'applicant',
              formLoader: () => import('../forms/done').then((val) => val.done),
              read: 'all',
            },
          ],
        },
        type: 'final' as const,
      },
    },
  },
  mapUserToRole(): ApplicationRole {
    return 'applicant'
  },
}

export default PSignTemplate
