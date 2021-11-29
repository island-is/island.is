import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  DefaultStateLifeCycle,
} from '@island.is/application/core'
import { ApiActions } from '../shared'
import { Events, States, Roles } from './constants'
import { dataSchema } from './dataSchema'
import { m } from './messages'

const PMarktemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.P_MARK,
  name: m.applicationForDrivingLicense,
  institution: m.nationalCommissionerOfPolice,
  dataSchema,
  readyForProduction: false,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: m.applicationForDrivingLicense.defaultMessage,
          actionCard: {
            description: m.actionCardDraft,
          },
          progress: 0.33,
          lifecycle: DefaultStateLifeCycle,
          onExit: {
            apiModuleAction: ApiActions.submitApplication,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/application').then((val) =>
                  Promise.resolve(val.getApplication(true, true)),
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

export default PMarktemplate
