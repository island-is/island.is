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
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'
import {
  ActiveEqualityReportApi,
  BlankExcelTemplateApi,
  CompanyRegistryApi,
  DoeCompanyApi,
  EditOutliersApi,
  ImportPresignApi,
  ParsedSalaryReportApi,
  SalaryAnalysisApi,
  SubmitSalaryReportApi,
} from '../dataProviders'
import { Events, Roles, States } from '../utils/constants'
import { mapUserToRole } from '../utils/mapUserToRole'
import {
  hasActiveEqualityReport,
  hasPostponedOutlierPlan,
} from '../utils/eligibility'
import { CodeOwners } from '@island.is/shared/constants'
import { dataSchema } from './dataSchema'
import {
  coreHistoryMessages,
  coreMessages,
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
  pruneAfterDays,
} from '@island.is/application/core'
import { messages } from './messages'
import { AuthDelegationType } from '@island.is/shared/types'
import { ApiScope } from '@island.is/auth/scopes'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.SALARY_REPORT,
  name: messages.general.applicationName,
  featureFlag: Features.isDirectorateOfEqualityApplicationsEnabled,
  codeOwner: CodeOwners.Hugsmidjan,
  institution: messages.general.institution,
  translationNamespaces:
    ApplicationConfigurations[ApplicationTypes.SALARY_REPORT].translation,
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
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/prerequisitesForm').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              api: [
                UserProfileApi,
                IdentityApi,
                CompanyRegistryApi,
                DoeCompanyApi,
                ActiveEqualityReportApi,
                BlankExcelTemplateApi,
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
          [DefaultEvents.SUBMIT]: [
            {
              target: States.DRAFT,
              cond: hasActiveEqualityReport,
            },
            {
              target: States.NOT_ALLOWED,
            },
          ],
        },
      },
      [States.NOT_ALLOWED]: {
        meta: {
          name: 'Not allowed',
          status: FormModes.REJECTED,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/notAllowedForm').then((m) =>
                  Promise.resolve(m.NotAllowedForm),
                ),
              read: 'all',
            },
          ],
        },
      },
      [States.DRAFT]: {
        meta: {
          name: 'Main form',
          progress: 0.4,
          status: FormModes.DRAFT,
          lifecycle: DefaultStateLifeCycle,
          // onExit (not onEntry on the target states) so a failed submission
          // blocks the transition instead of silently landing the applicant
          // on POSTPONED/COMPLETED with a stale backend record.
          onExit: SubmitSalaryReportApi,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/mainForm').then((module) =>
                  Promise.resolve(module.MainForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              api: [ImportPresignApi, ParsedSalaryReportApi, SalaryAnalysisApi],
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: [
            {
              target: States.POSTPONED,
              cond: hasPostponedOutlierPlan,
            },
            {
              target: States.IN_REVIEW,
            },
          ],
        },
      },
      [States.POSTPONED]: {
        meta: {
          name: 'Úrbótaáætlun',
          progress: 0.9,
          status: FormModes.IN_PROGRESS,
          lifecycle: pruneAfterDays(90),
          // Fires on leaving POSTPONED (i.e. the final plan submit), PUTting
          // just the outlier explanations rather than resubmitting the whole
          // report — the report itself was already submitted via DRAFT's
          // onExit.
          onExit: EditOutliersApi,
          actionCard: {
            tag: {
              label: messages.postponed.tagLabel,
              variant: 'blueberry',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: messages.historyLogs.postponed,
              },
            ],
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/postponedForm').then((module) =>
                  Promise.resolve(module.postponedForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              read: 'all',
              write: {
                answers: ['salaryAnalysis'],
                externalData: ['salaryAnalysisResult'],
              },
              api: [SalaryAnalysisApi],
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
          progress: 0.95,
          status: FormModes.IN_PROGRESS,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: false,
          },
          actionCard: {
            tag: {
              label: coreMessages.tagsInProgress,
              variant: 'blueberry',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage: coreHistoryMessages.applicationApproved,
              },
              {
                onEvent: DefaultEvents.REJECT,
                logMessage: coreHistoryMessages.applicationRejected,
              },
            ],
          },
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
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: {
            target: States.APPROVED,
          },
          [DefaultEvents.REJECT]: {
            target: States.DENIED,
          },
        },
      },
      [States.APPROVED]: {
        meta: {
          name: 'Samþykkt',
          progress: 1,
          status: FormModes.APPROVED,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            tag: {
              label: coreMessages.tagsApproved,
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
          name: 'Hafnað',
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
  mapUserToRole,
}

export default template
