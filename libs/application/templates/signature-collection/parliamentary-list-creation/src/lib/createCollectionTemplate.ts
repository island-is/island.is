import {
  Application,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  defineTemplateApi,
  NationalRegistryUserApi,
  StateLifeCycle,
  UserProfileApi,
} from '@island.is/application/types'
import { ApiActions, Events, Roles, States } from './constants'
import { dataSchema } from './dataSchema'
import { m } from './messages'
import { EphemeralStateLifeCycle } from '@island.is/application/core'
import { Features } from '@island.is/feature-flags'
import {
  ParliamentaryCollectionApi,
  CandidateApi,
  ParliamentaryIdentityApi,
  IsDelegatedToCompanyApi,
} from '../dataProviders'
import { AuthDelegationType } from '@island.is/shared/types'
import { CodeOwners } from '@island.is/shared/constants'

const WeekLifeCycle: StateLifeCycle = {
  shouldBeListed: false,
  shouldBePruned: true,
  whenToPrune: 1000 * 3600 * 24 * 7,
}

const createListTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.PARLIAMENTARY_LIST_CREATION,
  name: m.applicationName,
  codeOwner: CodeOwners.Juni,
  institution: m.institution,
  featureFlag: Features.ParliamentaryElectionApplication,
  dataSchema,
  translationNamespaces: [
    ApplicationConfigurations[ApplicationTypes.PARLIAMENTARY_LIST_CREATION]
      .translation,
  ],
  allowedDelegations: [
    {
      type: AuthDelegationType.ProcurationHolder,
    },
  ],
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
                CandidateApi,
                ParliamentaryCollectionApi,
                ParliamentaryIdentityApi,
                IsDelegatedToCompanyApi,
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
                logMessage: m.logListCreated,
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

export default createListTemplate
