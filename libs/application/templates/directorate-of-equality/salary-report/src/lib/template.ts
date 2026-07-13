import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  FormModes,
  UserProfileApi,
  ApplicationConfigurations,
  IdentityApi,
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'
import { isCompany } from 'kennitala'
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
import {
  hasActiveEqualityReport,
  hasPostponedOutlierPlan,
} from '../utils/eligibility'
import { CodeOwners } from '@island.is/shared/constants'
import { dataSchema } from './dataSchema'
import {
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
              target: States.COMPLETED,
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
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/completedForm').then((module) =>
                  Promise.resolve(module.completedForm),
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
