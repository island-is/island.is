import {
  Application,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  NationalRegistryUserApi,
  UserProfileApi,
  defineTemplateApi,
} from '@island.is/application/types'
import { ApiActions, Events, Roles, States } from './constants'
import { dataSchema } from './dataSchema'
import { m } from './messages'
import { EphemeralStateLifeCycle } from '@island.is/application/core'
import { StateLifeCycle } from '@island.is/application/types'
import { CanSignApi, GetListApi } from '../dataProviders'
import { CodeOwners } from '@island.is/shared/constants'

export const WeekLifeCycle: StateLifeCycle = {
  shouldBeListed: false,
  shouldBePruned: true,
  whenToPrune: 1000 * 3600 * 24 * 7,
}

const configuration =
  ApplicationConfigurations[ApplicationTypes.PRESIDENTIAL_LIST_SIGNING]

const SignListTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.PRESIDENTIAL_LIST_SIGNING,
  name: m.applicationName,
  codeOwner: CodeOwners.Juni,
  institution: m.institution,
  initialQueryParameter: 'candidate',
  dataSchema,
  translationNamespaces: [configuration.translation],
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          status: 'draft',
          name: 'Prerequisites',
          progress: 0.1,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: async () =>
                import('../forms/Prerequisites').then((val) =>
                  Promise.resolve(val.Prerequisites),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              delete: true,
              api: [
                NationalRegistryUserApi,
                UserProfileApi,
                CanSignApi,
                GetListApi,
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.DRAFT,
          },
        },
      },
      [States.DRAFT]: {
        meta: {
          name: m.applicationName.defaultMessage,
          status: 'draft',
          lifecycle: WeekLifeCycle,
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
                  name: m.applicationName,
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
            },
          ],
          actionCard: {
            historyLogs: [
              {
                logMessage: m.logListSigned,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DONE },
        },
      },
      [States.DONE]: {
        meta: {
          name: 'Done',
          status: 'completed',
          progress: 1,
          lifecycle: WeekLifeCycle,
          onEntry: defineTemplateApi({
            action: ApiActions.submitApplication,
            shouldPersistToExternalData: true,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Done').then((val) =>
                  Promise.resolve(val.Done),
                ),
              read: 'all',
            },
          ],
        },
      },
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

export default SignListTemplate
