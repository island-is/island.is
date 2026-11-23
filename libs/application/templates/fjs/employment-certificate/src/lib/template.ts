import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  FormModes,
  ApplicationConfigurations,
} from '@island.is/application/types'
import {
  coreHistoryMessages,
  EphemeralStateLifeCycle,
  pruneAfterDays,
} from '@island.is/application/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Features } from '@island.is/feature-flags'
import { Events, Roles, States } from '../utils/constants'
import {
  canGoBackToHistory,
  isAcceptedForProcessing,
  isClosed,
  isSentToMailbox,
} from '../utils/submitResult'
import {
  EmploymentEligibilityApi,
  EmploymentHistoryPreviewApi,
  NationalRegistryV3UserApi,
  SubmitApplicationApi,
  UserProfileApi,
} from '../dataProviders'
import { dataSchema } from './dataSchema'
import {
  application as m,
  conclusion,
  history,
  pendingAction as pendingActionMessages,
} from './messages'

// Order matters: any accepted request that isn't sent or closed is processing.
const submitTransitions = [
  { target: States.COMPLETED, cond: isSentToMailbox },
  { target: States.CLOSED, cond: isClosed },
  { target: States.PROCESSING, cond: isAcceptedForProcessing },
]

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.EMPLOYMENT_CERTIFICATE,
  name: m.name,
  codeOwner: CodeOwners.OneXInternet,
  institution: m.institutionName,
  translationNamespaces:
    ApplicationConfigurations.EmploymentCertificate.translation,
  featureFlag: Features.isEmploymentCertificateApplicationEnabled,
  dataSchema,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: m.stateMetaNamePrerequisites.defaultMessage,
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
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.submitButton,
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              api: [
                NationalRegistryV3UserApi,
                UserProfileApi,
                EmploymentEligibilityApi,
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
          name: m.stateMetaNameDraft.defaultMessage,
          progress: 0.4,
          status: FormModes.DRAFT,
          lifecycle: pruneAfterDays(2),
          onExit: SubmitApplicationApi,
          actionCard: {
            historyLogs: [
              {
                // Log messages are worded from the application as it is when
                // the history is shown, so they can't describe the outcome of
                // an earlier attempt.
                logMessage: coreHistoryMessages.applicationSent,
                onEvent: DefaultEvents.SUBMIT,
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
                  name: m.submitButton,
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              api: [EmploymentHistoryPreviewApi],
              delete: true,
            },
          ],
        },
        on: {
          // Without a matching transition the submit would leave the
          // application in draft, and the client would go back to the first
          // screen without an error.
          [DefaultEvents.SUBMIT]: [
            ...submitTransitions,
            { target: States.SUBMISSION_FAILED },
          ],
        },
      },
      [States.SUBMISSION_FAILED]: {
        meta: {
          name: m.stateMetaNameSubmissionFailed.defaultMessage,
          progress: 0.8,
          status: FormModes.DRAFT,
          lifecycle: pruneAfterDays(2),
          // Not throwing lets the form fetch the application again, so the
          // screen shows the retry's result, such as a changed history.
          onExit: SubmitApplicationApi,
          actionCard: {
            historyLogs: [
              {
                logMessage: history.resubmitted,
                onEvent: DefaultEvents.SUBMIT,
              },
              {
                logMessage: history.backToHistory,
                onEvent: DefaultEvents.EDIT,
              },
            ],
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/submissionFailedForm').then((module) =>
                  Promise.resolve(module.SubmissionFailedForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: conclusion.retryButton,
                  type: 'primary',
                },
                {
                  event: DefaultEvents.EDIT,
                  name: conclusion.backToHistoryButton,
                  type: 'subtle',
                },
              ],
              write: 'all',
              read: 'all',
              delete: true,
            },
          ],
        },
        on: {
          // Retries reuse the idempotency key, and the API answers 409 when the
          // same key comes with a different body. So the answers can only be
          // changed when the history itself changed.
          [DefaultEvents.EDIT]: {
            target: States.DRAFT,
            cond: canGoBackToHistory,
          },
          [DefaultEvents.SUBMIT]: submitTransitions,
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: m.stateMetaNameCompleted.defaultMessage,
          progress: 1,
          status: FormModes.COMPLETED,
          lifecycle: pruneAfterDays(90),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/completedForm').then((module) =>
                  Promise.resolve(module.CompletedForm),
                ),
              read: 'all',
              delete: true,
            },
          ],
        },
      },
      // Final: the application never checks the status of the case again.
      [States.PROCESSING]: {
        meta: {
          name: m.stateMetaNameProcessing.defaultMessage,
          progress: 1,
          status: FormModes.COMPLETED,
          lifecycle: pruneAfterDays(90),
          actionCard: {
            pendingAction: {
              displayStatus: 'info',
              title: pendingActionMessages.processingTitle,
              content: pendingActionMessages.processingContent,
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/processingForm').then((module) =>
                  Promise.resolve(module.ProcessingForm),
                ),
              read: 'all',
              delete: true,
            },
          ],
        },
      },
      [States.CLOSED]: {
        meta: {
          name: m.stateMetaNameClosed.defaultMessage,
          progress: 1,
          status: FormModes.REJECTED,
          lifecycle: pruneAfterDays(90),
          actionCard: {
            pendingAction: {
              displayStatus: 'info',
              title: pendingActionMessages.closedTitle,
              content: pendingActionMessages.closedContent,
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/closedForm').then((module) =>
                  Promise.resolve(module.ClosedForm),
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
    if (nationalId === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default template
