import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  DefaultEvents,
  FormModes,
  UserProfileApi,
  ApplicationConfigurations,
  InstitutionNationalIds,
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'
import {
  ActiveEqualityReportApi,
  BlankExcelTemplateApi,
  CompanyRegistryApi,
  CreateSalaryDraftApi,
  DoeCompanyApi,
  EditOutliersApi,
  GetDraftCriteriaTreeApi,
  GetDraftHeaderApi,
  GetReportCommentsApi,
  IdentityApiProvider,
  ImportPresignApi,
  ImportSalaryDraftWorkbookApi,
  ListDraftCriteriaApi,
  ListDraftEmployeesApi,
  ListDraftOutlierGroupsApi,
  ListDraftRolesApi,
  ListDraftRolesWithStepsApi,
  SalaryAnalysisApi,
  SubCriterionCatalogApi,
  SubmitReportCommentApi,
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
  coreMessages,
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
  pruneAfterDays,
} from '@island.is/application/core'
import { messages } from './messages'
import { AuthDelegationType } from '@island.is/shared/types'
import { ApiScope } from '@island.is/auth/scopes'
import { assign } from 'xstate'
import set from 'lodash/set'

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
  newApplicationButtonLabel: messages.general.newApplicationButtonLabel,
  stateMachineOptions: {
    actions: {
      assignToInstitution: assign((context) => {
        const { application } = context
        set(application, 'assignees', [
          InstitutionNationalIds.DOMSMALA_RADUNEYTID,
        ])
        return context
      }),
    },
  },
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
                IdentityApiProvider,
                CompanyRegistryApi,
                DoeCompanyApi,
                SubCriterionCatalogApi,
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
              // This is the role every unauthorized caller falls through to, so
              // it gets nothing: the dead-end form reads no answers and no
              // externalData, only `application.applicant`.
              read: { answers: [], externalData: [] },
              write: { answers: [] },
              delete: false,
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
              // Same dead-end form as the PREREQUISITES fall-through above, and
              // it reads nothing either — this applicant is authorized, just
              // ineligible.
              read: { answers: [], externalData: [] },
              write: { answers: [] },
              delete: false,
            },
          ],
        },
      },
      [States.DRAFT]: {
        entry: 'assignToInstitution',
        meta: {
          name: 'Main form',
          progress: 0.4,
          status: FormModes.DRAFT,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            tag: {
              label: messages.general.tagDraft,
              variant: 'blue',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: messages.inReview.sentHistoryLog,
              },
            ],
          },
          // onExit (not onEntry on the target states) so a failed submission
          // blocks the transition instead of silently landing the applicant
          // on POSTPONED/COMPLETED with a stale backend record.
          onExit: SubmitSalaryReportApi,
          // onEntry so the comment thread's non-empty check has fresh
          // externalData to read on first render — role.api alone never
          // auto-fetches outside PREREQUISITES, it only permits the on-demand
          // call CommentThread makes from within the mounted field.
          onEntry: GetReportCommentsApi,
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
              // Ordered in groups: same order runs concurrently via
              // Promise.all, so every provider reading/seeding the draft
              // must be strictly after CreateSalaryDraftApi — otherwise a
              // GetDraft*/ListDraft* read races the draft-create POST and
              // 404s before the row is committed.
              api: [
                ImportPresignApi.configure({ order: 0 }),
                CreateSalaryDraftApi.configure({ order: 0 }),
                ImportSalaryDraftWorkbookApi.configure({ order: 1 }),
                GetDraftHeaderApi.configure({ order: 2 }),
                GetDraftCriteriaTreeApi.configure({ order: 2 }),
                ListDraftRolesWithStepsApi.configure({ order: 2 }),
                ListDraftCriteriaApi.configure({ order: 2 }),
                ListDraftRolesApi.configure({ order: 2 }),
                ListDraftEmployeesApi.configure({ order: 2 }),
                ListDraftOutlierGroupsApi.configure({ order: 2 }),
                SalaryAnalysisApi.configure({ order: 2 }),
              ],
              delete: true,
            },
            {
              id: Roles.ASSIGNEE,
              shouldBeListedForRole: false,
              read: 'all',
              write: 'all',
              delete: false,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: [
            {
              target: States.POSTPONE_RECEIVED,
              cond: hasPostponedOutlierPlan,
            },
            {
              target: States.IN_REVIEW,
            },
          ],
        },
      },
      // Deliberately indistinguishable from POSTPONED on the outside: same tag,
      // same pending action, same lifecycle. Which of the two the application
      // sits in is bookkeeping about whether the applicant has closed the
      // receipt, and Mínar síður should read the same either way.
      [States.POSTPONE_RECEIVED]: {
        meta: {
          name: 'Sending móttekin',
          progress: 0.9,
          status: FormModes.IN_PROGRESS,
          lifecycle: pruneAfterDays(90),
          actionCard: {
            tag: {
              label: messages.postponed.tagLabel,
              variant: 'blueberry',
            },
            pendingAction: {
              title: messages.postponed.pendingActionTitle,
              content: messages.postponed.pendingActionContent,
              button: messages.postponed.pendingActionButton,
              displayStatus: 'info',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/postponeReceivedForm').then((module) =>
                  Promise.resolve(module.postponeReceivedForm),
                ),
              read: 'all',
              // Nothing on this screen writes an answer — the closer dispatches
              // an event. An empty array rather than an absent `write` all the
              // same, so the shell's answers submission is never rejected
              // outright (see the identical note on States.IN_REVIEW).
              write: { answers: [] },
              delete: true,
            },
            {
              id: Roles.ASSIGNEE,
              shouldBeListedForRole: false,
              read: 'all',
              write: 'all',
              delete: false,
            },
          ],
        },
        on: {
          // Dispatched by PostponeReceiptCloser as the applicant leaves, not by
          // a button. No history log: the applicant did nothing worth logging,
          // the submission itself was already logged on the way out of DRAFT.
          [DefaultEvents.SUBMIT]: {
            target: States.POSTPONED,
          },
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
          // So the comment thread's non-empty check has fresh externalData —
          // see the identical comment on States.DRAFT.
          //
          // This state in particular depends on the provider's
          // `throwOnError: false`: it is entered by PostponeReceiptCloser's
          // beacon with nobody watching, and an onEntry runs before the new
          // state is persisted and blocks it by default — so a hiccup from
          // DMR's comments endpoint would silently leave the applicant on the
          // receipt. CommentThread refetches on mount anyway.
          onEntry: GetReportCommentsApi,
          actionCard: {
            tag: {
              label: messages.postponed.tagLabel,
              variant: 'blueberry',
            },
            pendingAction: {
              title: messages.postponed.pendingActionTitle,
              content: messages.postponed.pendingActionContent,
              button: messages.postponed.pendingActionButton,
              displayStatus: 'info',
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
                answers: ['salaryAnalysis', 'comment'],
                externalData: [
                  'salaryAnalysisResult',
                  'getReportComments',
                  'submitReportComment',
                ],
              },
              api: [
                SalaryAnalysisApi,
                GetReportCommentsApi,
                SubmitReportCommentApi,
              ],
              delete: true,
            },
            {
              id: Roles.ASSIGNEE,
              shouldBeListedForRole: false,
              read: 'all',
              write: 'all',
              delete: false,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.IN_REVIEW,
          },
          // DMR can dispatch EDIT independent of the application's own
          // frontend state — frontend states only pick which form renders,
          // they don't mirror DMR's backend workflow status 1:1.
          [DefaultEvents.EDIT]: {
            target: States.DRAFT_RETRY,
          },
        },
      },
      [States.DRAFT_RETRY]: {
        meta: {
          name: 'Lagfæring',
          progress: 0.9,
          status: FormModes.IN_PROGRESS,
          lifecycle: pruneAfterDays(90),
          // Fires on leaving DRAFT_RETRY (the resubmit), PUTting the outlier
          // explanations same as POSTPONED's onExit — see the identical
          // comment there.
          onExit: EditOutliersApi,
          // So the comment thread's non-empty check has fresh externalData —
          // see the identical comment on States.DRAFT.
          onEntry: GetReportCommentsApi,
          actionCard: {
            tag: {
              label: messages.draftRetry.tagLabel,
              variant: 'purple',
            },
            pendingAction: {
              title: messages.draftRetry.pendingActionTitle,
              content: messages.draftRetry.pendingActionContent,
              button: messages.draftRetry.pendingActionButton,
              displayStatus: 'info',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: messages.historyLogs.draftRetry,
              },
            ],
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/draftRetryForm').then((module) =>
                  Promise.resolve(module.draftRetryForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              read: 'all',
              write: {
                answers: ['salaryAnalysis', 'comment'],
                externalData: [
                  'salaryAnalysisResult',
                  'getReportComments',
                  'submitReportComment',
                ],
              },
              api: [
                SalaryAnalysisApi,
                GetReportCommentsApi,
                SubmitReportCommentApi,
              ],
              delete: false,
            },
            {
              id: Roles.ASSIGNEE,
              shouldBeListedForRole: false,
              read: 'all',
              write: 'all',
              delete: false,
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
              label: messages.inReview.tagLabel,
              variant: 'blueberry',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage: messages.inReview.approvedHistoryLog,
              },
              {
                onEvent: DefaultEvents.REJECT,
                logMessage: messages.inReview.rejectedHistoryLog,
              },
              {
                onEvent: DefaultEvents.EDIT,
                logMessage: messages.inReview.editHistoryLog,
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
              // No real answers to write in this state (the comment thread
              // was removed from this form) — an empty `answers` array is
              // still required, not an absent `write`, so that normal
              // screen-to-screen navigation's answers submission passes
              // applicationTemplateValidation.service.ts's writable-answers
              // check instead of being rejected outright.
              write: { answers: [] },
              delete: false,
            },
            {
              id: Roles.ASSIGNEE,
              shouldBeListedForRole: false,
              read: 'all',
              write: 'all',
              delete: false,
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
          // Targets DRAFT_RETRY (not DRAFT) so a case-worker-requested
          // revision reuses the same restricted comments/outlier-plan-editing
          // flow — there's no path back to the original
          // company/employee/criteria data-entry screens from here, by
          // design.
          [DefaultEvents.EDIT]: {
            target: States.DRAFT_RETRY,
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
              // No real answers to write in this state (the comment thread
              // was removed from this form) — an empty `answers` array is
              // still required, not an absent `write`, so that normal
              // screen-to-screen navigation's answers submission passes
              // applicationTemplateValidation.service.ts's writable-answers
              // check instead of being rejected outright.
              write: { answers: [] },
              delete: false,
            },
            {
              id: Roles.ASSIGNEE,
              shouldBeListedForRole: false,
              read: 'all',
              write: 'all',
              delete: false,
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
              // See the identical comment on States.APPROVED.
              write: { answers: [] },
              delete: false,
            },
            {
              id: Roles.ASSIGNEE,
              shouldBeListedForRole: false,
              read: 'all',
              write: 'all',
              delete: false,
            },
          ],
        },
      },
    },
  },
  mapUserToRole,
}

export default template
