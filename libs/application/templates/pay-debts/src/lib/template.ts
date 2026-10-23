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
  StateLifeCycle,
  VerifyPaymentApi,
} from '@island.is/application/types'
import { getPaymentForm } from '@island.is/application/ui-forms'
import { Events, Roles, States } from '../utils/constants'
import { CodeOwners } from '@island.is/shared/constants'
import { Features } from '@island.is/feature-flags'
import { AuthDelegationType } from '@island.is/shared/types'
import { dataSchema } from './dataSchema'
import {
  CreateDebtPaymentApi,
  DeleteDebtPaymentApi,
  GetDebtsApi,
} from '../dataProviders'
import { application, payment } from './messages'
import {
  coreHistoryMessages,
  corePendingActionMessages,
  EphemeralStateLifeCycle,
  pruneAfterDays,
} from '@island.is/application/core'

const completedLifecycle: StateLifeCycle = {
  ...pruneAfterDays(30), // TODO: Does it need to be kept for 30 days?
  shouldBeListed: false,
}

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.PAY_DEBTS,
  featureFlag: Features.isPayDebtsApplicationEnabled,
  name: application.name,
  codeOwner: CodeOwners.Origo,
  institution: application.institutionName,
  translationNamespaces: ApplicationConfigurations.PayDebts.translation,
  allowedDelegations: [{ type: AuthDelegationType.ProcurationHolder }],
  dataSchema,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: application.stateMetaNameDraft.defaultMessage,
          progress: 0.4,
          status: FormModes.DRAFT,
          lifecycle: EphemeralStateLifeCycle,
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
                  name: payment.buttons.submit,
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              api: [GetDebtsApi],
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.PAYMENT,
          },
        },
      },
      // Not buildPaymentState: a debt has no FJS catalog item
      [States.PAYMENT]: {
        meta: {
          name: 'Greiðsla',
          status: FormModes.IN_PROGRESS,
          lifecycle: EphemeralStateLifeCycle,
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.paymentAccepted,
                onEvent: DefaultEvents.SUBMIT,
              },
              {
                logMessage: coreHistoryMessages.paymentCancelled,
                onEvent: DefaultEvents.ABORT,
              },
            ],
            pendingAction: {
              title: corePendingActionMessages.paymentPendingTitle,
              content: corePendingActionMessages.paymentPendingDescription,
              displayStatus: 'warning',
            },
          },
          onEntry: CreateDebtPaymentApi,
          onExit: [
            VerifyPaymentApi.configure({
              triggerEvent: DefaultEvents.SUBMIT,
            }),
            DeleteDebtPaymentApi.configure({
              triggerEvent: DefaultEvents.ABORT,
            }),
          ],
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: async () => getPaymentForm(),
              actions: [
                { event: DefaultEvents.SUBMIT, name: 'Panta', type: 'primary' },
                {
                  event: DefaultEvents.ABORT,
                  name: 'Hætta við',
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.COMPLETED },
          [DefaultEvents.ABORT]: { target: States.DRAFT },
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: application.stateMetaNameCompleted.defaultMessage,
          progress: 1,
          status: FormModes.COMPLETED,
          lifecycle: completedLifecycle,
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
    if (nationalId === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default template
