import {
  coreHistoryMessages,
  corePendingActionMessages,
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
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
  FormModes,
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'
import { CodeOwners } from '@island.is/shared/constants'
import {
  AvailableLocationsApi,
  ChildrenApi,
  LanguagesApi,
  RejectionReasonsApi,
  SpeechPathologistsApi,
} from '../dataProviders'
import {
  overviewMessages,
  prerequisitesMessages,
  sharedMessages,
} from '../lib/messages'
import { ApiModuleActions, Events, Roles, States } from '../utils/constants'
import { dataSchema } from './dataSchema'

const SpeechTherapyWaitingListRegistrationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.SPEECH_THERAPY_WAITING_LIST_REGISTRATION,
  name: sharedMessages.applicationName,
  codeOwner: CodeOwners.Deloitte,
  institution: sharedMessages.institution,
  translationNamespaces:
    ApplicationConfigurations.SpeechTherapyWaitingListRegistration.translation,
  dataSchema,
  featureFlag: Features.isSpeechTherapyWaitingListRegistrationEnabled,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: States.PREREQUISITES,
          progress: 0,
          status: FormModes.DRAFT,
          lifecycle: EphemeralStateLifeCycle,
          actionCard: {
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: coreHistoryMessages.applicationStarted,
              },
            ],
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/prerequisitesForm').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: prerequisitesMessages.children.startApplication,
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              api: [
                ChildrenApi,
                LanguagesApi,
                AvailableLocationsApi,
                SpeechPathologistsApi,
                RejectionReasonsApi,
              ],
              delete: true,
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
          name: States.DRAFT,
          progress: 0.4,
          status: FormModes.DRAFT,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: coreHistoryMessages.applicationSent,
              },
            ],
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/mainForm').then((module) =>
                  Promise.resolve(module.MainForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: overviewMessages.submitButton,
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.COMPLETED,
          },
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: States.COMPLETED,
          progress: 1,
          status: FormModes.COMPLETED,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            pendingAction: {
              title: corePendingActionMessages.applicationReceivedTitle,
              displayStatus: 'success',
            },
          },
          onEntry: defineTemplateApi({
            action: ApiModuleActions.sendApplication,
            namespace:
              ApplicationTypes.SPEECH_THERAPY_WAITING_LIST_REGISTRATION,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/completedForm').then((module) =>
                  Promise.resolve(module.completedForm),
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

export default SpeechTherapyWaitingListRegistrationTemplate
