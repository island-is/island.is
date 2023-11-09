import {
  DefaultStateLifeCycle,
  coreHistoryMessages,
} from '@island.is/application/core'
import {
  Application,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'
import { Events, Roles, States } from './constants'
import { dataSchema } from './dataSchema'
import { m } from './messages'

const SignatureListTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.SIGNATURE_LIST_CREATION,
  name: m.applicationName,
  institution: m.institution,
  featureFlag: Features.passportApplication,
  dataSchema,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      draft: {
        meta: {
          name: m.applicationName.defaultMessage,
          status: 'draft',
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Draft').then((val) =>
                  Promise.resolve(val.Draft),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
              api: [NationalRegistryUserApi],
            },
          ],
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationStarted,
                onEvent: DefaultEvents.PAYMENT,
              },
            ],
          },
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DRAFT },
        },
      },
      [States.DONE]: {},
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (nationalId === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default SignatureListTemplate
