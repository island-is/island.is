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
  CompanyRegistryApi,
  CreateEqualityDraftApi,
  DoeCompanyApi,
  EqualityReportTemplateDocxApi,
  GetReportCommentsApi,
  IdentityApiProvider,
  PreviousEqualityReportContentApi,
  SubmitReportCommentApi,
  SubmitEqualityDraftApi,
} from '../dataProviders'
import { Events, Roles, States } from '../utils/constants'
import { mapUserToRole } from '../utils/mapUserToRole'
import { CodeOwners } from '@island.is/shared/constants'
import { dataSchema } from './dataSchema'
import {
  coreMessages,
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
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
  type: ApplicationTypes.EQUALITY_REPORT,
  name: messages.general.applicationName,
  featureFlag: Features.isDirectorateOfEqualityApplicationsEnabled,
  codeOwner: CodeOwners.Hugsmidjan,
  institution: messages.general.institution,
  translationNamespaces:
    ApplicationConfigurations[ApplicationTypes.EQUALITY_REPORT].translation,
  dataSchema,
  newApplicationButtonLabel: messages.general.newApplicationButtonLabel,
  allowedDelegations: [{ type: AuthDelegationType.ProcurationHolder }],
  requiredScopes: [ApiScope.directorateOfEquality],
  allowMultipleApplicationsInDraft: false,
  stateMachineOptions: {
    actions: {
      assignToInstitution: assign((context) => {
        const { application } = context
        set(application, 'assignees', [
          InstitutionNationalIds.DOMSMALA_RADUNEYTID,
        ])
        return context
      }),
      // Both transitions into IN_REVIEW write the flag, so whatever a client
      // may have put in answers while editing is overwritten by the route
      // actually taken.
      markRevised: assign((context) => {
        const { application } = context
        set(application, 'answers.hasBeenRevised', true)
        return context
      }),
      markNotRevised: assign((context) => {
        const { application } = context
        set(application, 'answers.hasBeenRevised', false)
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
          actionCard: {
            tag: {
              label: messages.general.tagDraft,
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
                IdentityApiProvider,
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
          [DefaultEvents.SUBMIT]: {
            target: States.DRAFT,
          },
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
          // onExit (not onEntry on IN_REVIEW) so a failed submission blocks
          // the transition instead of silently landing the applicant on a
          // fake "in review" screen with a stale backend record.
          onExit: SubmitEqualityDraftApi,
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
                CreateEqualityDraftApi,
                EqualityReportTemplateDocxApi,
                PreviousEqualityReportContentApi,
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
            actions: 'markNotRevised',
          },
        },
      },
      [States.IN_REVIEW]: {
        meta: {
          name: 'Til yfirferðar',
          progress: 0.8,
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
          // revision lands on a screen built for that purpose — comments
          // first, then the actual goalsAndActions content to fix — rather
          // than dropping the applicant back onto the full mainForm.
          [DefaultEvents.EDIT]: {
            target: States.DRAFT_RETRY,
          },
        },
      },
      [States.DRAFT_RETRY]: {
        meta: {
          name: 'Lagfæring',
          progress: 0.7,
          status: FormModes.IN_PROGRESS,
          lifecycle: DefaultStateLifeCycle,
          // So the comment thread's non-empty check has fresh externalData —
          // see the identical comment on States.DRAFT.
          onEntry: GetReportCommentsApi,
          // No onExit for content — Editor.tsx pushes the revised content
          // straight to DMR's already-submitted (IN_REVIEW) report via the
          // directorateOfEqualityEditEqualityContent GraphQL mutation the
          // moment a file is uploaded, so there's nothing left to commit at
          // transition time.
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
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage: messages.inReview.approvedHistoryLog,
              },
              {
                onEvent: DefaultEvents.REJECT,
                logMessage: messages.inReview.rejectedHistoryLog,
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
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              read: 'all',
              write: {
                answers: ['comment', 'goalsAndActions'],
                externalData: [
                  'getReportComments',
                  'submitReportComment',
                  'equalityReportTemplateDocx',
                ],
              },
              api: [
                GetReportCommentsApi,
                SubmitReportCommentApi,
                EqualityReportTemplateDocxApi,
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
            actions: 'markRevised',
          },
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
