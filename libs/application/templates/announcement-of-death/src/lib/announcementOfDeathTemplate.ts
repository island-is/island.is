import {
  EphemeralStateLifeCycle,
  coreHistoryMessages,
} from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTypes,
  ApplicationRole,
  Application,
  DefaultEvents,
  defineTemplateApi,
  NationalRegistryV3UserApi,
  UserProfileApi,
  ExistingApplicationApi,
  ApplicationConfigurations,
} from '@island.is/application/types'
import {
  Events,
  States,
  Roles,
  HalfYearLifeCycle,
  DayLifeCycle,
} from './constants'
import { dataSchema } from './dataSchema'
import { m } from '../lib/messages'
import { ApiActions } from './constants'
import { DeathNoticeApi } from '../dataProviders'
import { determineMessageFromApplicationAnswers } from './utils'
import { CodeOwners } from '@island.is/shared/constants'

const configuration =
  ApplicationConfigurations[ApplicationTypes.ANNOUNCEMENT_OF_DEATH]
const AnnouncementOfDeathTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.ANNOUNCEMENT_OF_DEATH,
  name: determineMessageFromApplicationAnswers,
  codeOwner: CodeOwners.Juni,
  institution: m.applicationInstitution,
  dataSchema: dataSchema,
  translationNamespaces: [configuration.translation],
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        id: 'prerequisite',
        exit: [],
        meta: {
          name: 'Prerequisites',
          status: 'draft',
          onEntry: defineTemplateApi({
            action: ApiActions.syslumennOnEntry,
            shouldPersistToExternalData: true,
            throwOnError: false,
          }),
          progress: 0.25,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/prerequisite').then((val) =>
                  Promise.resolve(val.prerequisite()),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
                { event: DefaultEvents.REJECT, name: 'Reject', type: 'reject' },
              ],
              write: 'all',
              delete: true,
              api: [
                DeathNoticeApi,
                NationalRegistryV3UserApi,
                UserProfileApi,
                ExistingApplicationApi.configure({
                  params: {
                    states: [States.DRAFT],
                    where: {
                      applicant: 'applicant',
                    },
                  },
                }),
              ],
            },
          ],
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationStarted,
                onEvent: DefaultEvents.SUBMIT,
              },
              {
                logMessage: m.logApplicationDelegated,
                onEvent: DefaultEvents.REJECT,
              },
            ],
          },
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DRAFT },
          [DefaultEvents.REJECT]: { target: States.DELEGATED },
        },
      },
      [States.DRAFT]: {
        meta: {
          name: 'Draft',
          status: 'draft',
          progress: 0.5,
          lifecycle: HalfYearLifeCycle,
          onExit: defineTemplateApi({
            action: ApiActions.submitApplication,
            shouldPersistToExternalData: true,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/draft/draft').then((val) =>
                  Promise.resolve(val.draft),
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
              api: [
                ExistingApplicationApi.configure({
                  params: {
                    states: [States.DRAFT],
                    where: {
                      applicant: 'applicant',
                    },
                  },
                }),
              ],
            },
          ],
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationSent,
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
          progress: 1,
          status: 'completed',
          lifecycle: HalfYearLifeCycle,

          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () => import('../forms/done').then((val) => val.done),
              read: 'all',
            },
          ],
        },
      },
      [States.DELEGATED]: {
        meta: {
          name: 'Delegated',
          status: 'completed',
          progress: 1,
          lifecycle: DayLifeCycle,
          onEntry: defineTemplateApi({
            action: ApiActions.assignElectedPerson,
            shouldPersistToExternalData: false,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/delegated').then((val) => val.delegated),
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
    if (application.applicant === nationalId) {
      return Roles.APPLICANT
    }
  },
}

export default AnnouncementOfDeathTemplate
