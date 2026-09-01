import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import { Features } from '@island.is/feature-flags'
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
import { CodeOwners } from '@island.is/shared/constants'
import { AuthDelegationType } from '@island.is/shared/types'

import {
  CategoriesApi,
  ChildSafetyLevelsApi,
  ChildUnknownNationalIdStatesApi,
  DisabilityStatusesApi,
  GendersApi,
  GuardianNotAwareReasonsApi,
  IdentityApiProvider,
  LanguageEnvironmentsApi,
  NationalRegistryV3UserApi,
  NotifierRolesApi,
  NotifierRoleSubTypesApi,
  PostalCodesApi,
  PronounsApi,
  ProtectiveFactorsApi,
  SchoolTypesApi,
} from '../dataProviders'
import {
  applicationCardMessages,
  overviewMessages,
  prerequisitesMessages,
  sharedMessages,
} from '../lib/messages'
import { ApiModuleActions, Events, Roles, States } from '../utils/constants'
import { getApplicantRole } from '../utils/roleUtils'
import { dataSchema } from './dataSchema'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.CHILD_PROTECTION_NOTIFICATION,
  name: sharedMessages.applicationName,
  featureFlag: Features.childProtectionNotification,
  codeOwner: CodeOwners.Deloitte,
  institution: sharedMessages.institution, // TODO: Confirm correct institution name
  translationNamespaces: [
    ApplicationConfigurations.ChildProtectionNotification.translation,
  ],
  allowedDelegations: [{ type: AuthDelegationType.ProcurationHolder }],
  newApplicationButtonLabel: applicationCardMessages.newNotificationButton,
  dataSchema,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Skilyrði',
          progress: 0,
          status: FormModes.DRAFT,
          lifecycle: EphemeralStateLifeCycle,
          actionCard: {
            historyLogs: [
              {
                logMessage: applicationCardMessages.historyNotificationStarted,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
          onExit: [
            defineTemplateApi({
              action: ApiModuleActions.getChildNationalIdType,
              externalDataId: 'childNationalIdType',
              namespace: ApplicationTypes.CHILD_PROTECTION_NOTIFICATION,
              throwOnError: true,
            }),
          ],
          roles: [
            ...[Roles.MINOR_APPLICANT, Roles.ADULT_PERSONAL_APPLICANT].map(
              (roleId) => ({
                id: roleId,
                formLoader: () =>
                  import('../forms/prerequisitesForm').then((module) =>
                    Promise.resolve(module.PersonalPrerequisites),
                  ),
                actions: [
                  {
                    event: DefaultEvents.SUBMIT,
                    name: prerequisitesMessages.child.startNotification,
                    type: 'primary' as const,
                  },
                ],
                write: 'all' as const,
                read: 'all' as const,
                api: [NationalRegistryV3UserApi],
                delete: true,
              }),
            ),
            {
              id: Roles.ADULT_PROCURATION_APPLICANT,
              formLoader: () =>
                import('../forms/prerequisitesForm').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: prerequisitesMessages.child.startNotification,
                  type: 'primary' as const,
                },
              ],
              write: 'all' as const,
              read: 'all' as const,
              api: [
                IdentityApiProvider,
                CategoriesApi,
                ProtectiveFactorsApi,
                GendersApi,
                PronounsApi,
                DisabilityStatusesApi,
                ChildSafetyLevelsApi,
                PostalCodesApi,
                ChildUnknownNationalIdStatesApi,
                GuardianNotAwareReasonsApi,
                SchoolTypesApi,
                LanguageEnvironmentsApi,
                NotifierRolesApi,
                NotifierRoleSubTypesApi,
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
          name: 'Main form',
          progress: 0.4,
          status: FormModes.DRAFT,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            tag: {
              label: applicationCardMessages.notificationInProgressTag,
            },
            historyButton: applicationCardMessages.openNotificationButton,
            historyLogs: [
              {
                logMessage: applicationCardMessages.historyNotificationSent,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
          roles: [
            {
              id: Roles.MINOR_APPLICANT,
              formLoader: () =>
                import('../forms/minor/draftForm').then((module) =>
                  Promise.resolve(module.MinorDraftForm),
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
            {
              id: Roles.ADULT_PERSONAL_APPLICANT,
              formLoader: () =>
                import('../forms/adultPersonal/draftForm').then((module) =>
                  Promise.resolve(module.AdultPersonalDraftForm),
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
            {
              id: Roles.ADULT_PROCURATION_APPLICANT,
              formLoader: () =>
                import('../forms/adultProcuration/draftForm').then((module) =>
                  Promise.resolve(module.AdultProcurationDraftForm),
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
          name: 'Completed form',
          progress: 1,
          status: FormModes.COMPLETED,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            tag: {
              label: applicationCardMessages.notificationReceivedTag,
            },
            pendingAction: {
              title: applicationCardMessages.notificationReceivedTitle,
              content: applicationCardMessages.notificationReceivedContent,
              displayStatus: 'success',
              button: applicationCardMessages.openNotificationButton,
            },
          },
          roles: [
            {
              id: Roles.MINOR_APPLICANT,
              formLoader: () =>
                import('../forms/minor/completedForm').then((module) =>
                  Promise.resolve(module.MinorCompletedForm),
                ),
              read: 'all',
            },
            {
              id: Roles.ADULT_PERSONAL_APPLICANT,
              formLoader: () =>
                import('../forms/adultPersonal/completedForm').then((module) =>
                  Promise.resolve(module.AdultPersonalCompletedForm),
                ),
              read: 'all',
            },
            {
              id: Roles.ADULT_PROCURATION_APPLICANT,
              formLoader: () =>
                import('../forms/adultProcuration/completedForm').then(
                  (module) =>
                    Promise.resolve(module.AdultProcurationCompletedForm),
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
    if (nationalId !== application.applicant) {
      return undefined
    }
    return getApplicantRole(nationalId)
  },
}

export default template
