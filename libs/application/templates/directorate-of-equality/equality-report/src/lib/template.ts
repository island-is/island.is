import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  DefaultEvents,
  FormModes,
  UserProfileApi,
  ApplicationConfigurations,
  IdentityApi,
  defineTemplateApi,
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'
import {
  ActiveEqualityReportApi,
  CompanyRegistryApi,
  DoeCompanyApi,
  EqualityReportTemplateDocxApi,
  EqualityReportTemplateHtmlApi,
  PreviousEqualityReportContentApi,
} from '../dataProviders'
import { ApiActions, Events, Roles, States } from '../utils/constants'
import { CodeOwners } from '@island.is/shared/constants'
import { dataSchema } from './dataSchema'
import {
  coreHistoryMessages,
  coreMessages,
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import { messages } from './messages'
import { AuthDelegationType } from '@island.is/shared/types'
import { ApiScope } from '@island.is/auth/scopes'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.EQUALITY_REPORT,
  name: messages.general.applicationName,
  featureFlag: Features.isDirectorateOfEqualityApplicationsEnabled,
  codeOwner: CodeOwners.Hugsmidjan,
  institution: messages.general.institution,
  translationNamespaces: ApplicationConfigurations.EqualityReport.translation,
  dataSchema,
  allowedDelegations: [{ type: AuthDelegationType.ProcurationHolder }],
  requiredScopes: [ApiScope.directorateOfEquality],
  allowMultipleApplicationsInDraft: false,
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
            tag: {
              label: coreMessages.tagsDraft,
              variant: 'blue',
            },
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
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              api: [
                UserProfileApi,
                IdentityApi,
                CompanyRegistryApi,
                ActiveEqualityReportApi,
                DoeCompanyApi,
              ],
              delete: true,
            },
            {
              id: Roles.NOT_ALLOWED,
              formLoader: () =>
                import('../forms/notAllowedForm').then((m) =>
                  Promise.resolve(m.NotAllowedForm),
                ),
              read: 'all',
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
              label: coreMessages.tagsDraft,
              variant: 'blue',
            },
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
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              api: [
                EqualityReportTemplateHtmlApi,
                EqualityReportTemplateDocxApi,
                PreviousEqualityReportContentApi,
              ],
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.IN_REVIEW,
          },
        },
      },
      [States.IN_REVIEW]: {
        meta: {
          name: 'Til yfirferðar',
          progress: 0.8,
          status: FormModes.IN_PROGRESS,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            tag: {
              label: coreMessages.tagsInProgress,
              variant: 'blueberry',
            },
          },
          onEntry: defineTemplateApi({
            action: ApiActions.submitEqualityReport,
            namespace: 'DirectorateOfEquality',
            shouldPersistToExternalData: true,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/inReviewForm').then((module) =>
                  Promise.resolve(module.inReviewForm),
                ),
              read: 'all',
              delete: true,
            },
            {
              id: Roles.REVIEWER,
              write: 'all',
              read: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: {
            target: States.APPROVED,
          },
          DENY: {
            target: States.DENIED,
          },
          [DefaultEvents.EDIT]: {
            target: States.DRAFT,
          },
        },
      },
      [States.APPROVED]: {
        meta: {
          name: 'Approved form',
          progress: 1,
          status: FormModes.APPROVED,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            tag: {
              label: coreMessages.tagsDone,
              variant: 'mint',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/approvedForm').then((module) =>
                  Promise.resolve(module.approvedForm),
                ),
              read: 'all',
              delete: true,
            },
          ],
        },
      },
      [States.DENIED]: {
        meta: {
          name: 'Denied form',
          progress: 1,
          status: FormModes.REJECTED,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            tag: {
              label: coreMessages.tagsRejected,
              variant: 'red',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/deniedForm').then((module) =>
                  Promise.resolve(module.deniedForm),
                ),
              read: 'all',
              delete: true,
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
    if (
      isCompany(application.applicant) &&
      nationalId === application.applicant
    ) {
      return Roles.APPLICANT
    }
    return Roles.NOT_ALLOWED
  },
}

export default template
