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
  InstitutionNationalIds,
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'
import {
  ActiveEqualityReportApi,
  CompanyRegistryApi,
  DoeCompanyApi,
  EqualityReportTemplateDocxApi,
  EqualityReportTemplateHtmlApi,
  GetReportCommentsApi,
  PreviousEqualityReportContentApi,
  SubmitReportCommentApi,
  SubmitEqualityReportApi,
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
        entry: 'assignToInstitution',
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
                logMessage: messages.inReview.sentHistoryLog,
              },
            ],
          },
          // So the comment thread's non-empty check has fresh externalData on
          // first render — role.api alone never auto-fetches outside
          // PREREQUISITES, it only permits the on-demand call CommentThread
          // makes from within the mounted field.
          onEntry: GetReportCommentsApi,
          // onExit (not onEntry on IN_REVIEW) so a failed submission blocks
          // the transition instead of silently landing the applicant on a
          // fake "in review" screen with a stale backend record.
          onExit: SubmitEqualityReportApi,
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
                GetReportCommentsApi,
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
              label: coreMessages.tagsInProgress,
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
              write: {
                answers: ['comment'],
                externalData: ['getReportComments', 'submitReportComment'],
              },
              api: [GetReportCommentsApi, SubmitReportCommentApi],
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
          [DefaultEvents.APPROVE]: {
            target: States.APPROVED,
          },
          [DefaultEvents.REJECT]: {
            target: States.DENIED,
          },
          [DefaultEvents.EDIT]: {
            target: States.DRAFT,
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
              label: coreMessages.tagsDone,
              variant: 'mint',
            },
          },
          // So the comment thread's non-empty check has fresh externalData —
          // see the identical comment on States.DRAFT.
          onEntry: GetReportCommentsApi,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/approvedForm').then((module) =>
                  Promise.resolve(module.approvedForm),
                ),
              read: 'all',
              write: { externalData: ['getReportComments'] },
              api: [GetReportCommentsApi],
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
          // So the comment thread's non-empty check has fresh externalData —
          // see the identical comment on States.DRAFT.
          onEntry: GetReportCommentsApi,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/deniedForm').then((module) =>
                  Promise.resolve(module.deniedForm),
                ),
              read: 'all',
              write: { externalData: ['getReportComments'] },
              api: [GetReportCommentsApi],
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
      },
    },
  },
  mapUserToRole,
}

export default template
