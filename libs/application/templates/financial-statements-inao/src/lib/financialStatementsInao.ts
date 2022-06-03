import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import { m } from './messages'
import { Events, States, Roles } from './constants'
import { dataSchema } from './utils/dataSchema'
import { Features } from '@island.is/feature-flags'

const FinancialStatementInaoApplication: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.FINANCIAL_STATEMENTS_INAO,
  name: m.applicationTitle,
  institution: m.institutionName,
  dataSchema,
  featureFlag: Features.financialStatementInao,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Draft',
          actionCard: {
            title: m.applicationTitle,
          },
          progress: 0.4,
          lifecycle: EphemeralStateLifeCycle,

          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/application').then((module) =>
                  Promise.resolve(module.getApplication()),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DONE },
        },
      },
      [States.DONE]: {
        meta: {
          name: 'Done',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,

          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () => import('../forms/done').then((val) => val.done),
              read: 'all',
            },
          ],
        },
        type: 'final' as const,
      },
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (application.applicant === nationalId) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default FinancialStatementInaoApplication
