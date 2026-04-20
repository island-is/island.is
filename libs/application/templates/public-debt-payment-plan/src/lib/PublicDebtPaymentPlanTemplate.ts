import {
  coreHistoryMessages,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import {
  Application,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  ApplicationConfigurations,
  defineTemplateApi,
  UserProfileApi,
  IdentityApi,
} from '@island.is/application/types'
import { PaymentPlanPrerequisitesApi } from '../dataProviders'
import { PublicDebtPaymentPlanSchema } from './dataSchema'
import { application, conclusion } from './messages'
import { AuthDelegationType } from '@island.is/shared/types'
import { CodeOwners } from '@island.is/shared/constants'

const States = {
  draft: 'draft',
  submitted: 'submitted',
  closed: 'closed',
  prerequisites: 'prerequisites',
}
export enum ApiModuleActions {
  sendApplication = 'sendApplication',
}

type PublicDebtPaymentPlanEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ABORT }

enum Roles {
  APPLICANT = 'applicant',
}

const PublicDebtPaymentPlanTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<PublicDebtPaymentPlanEvent>,
  PublicDebtPaymentPlanEvent
> = {
  type: ApplicationTypes.PUBLIC_DEBT_PAYMENT_PLAN,
  name: application.name,
  codeOwner: CodeOwners.NordaApplications,
  institution: application.institutionName,
  allowedDelegations: [{ type: AuthDelegationType.ProcurationHolder }],
  translationNamespaces:
    ApplicationConfigurations.PublicDebtPaymentPlan.translation,
  dataSchema: PublicDebtPaymentPlanSchema,
  stateMachineConfig: {
    initial: States.prerequisites,
    states: {
      [States.prerequisites]: {
        meta: {
          status: 'draft',
          name: States.prerequisites,
          actionCard: {
            title: application.name,
            description: application.description,
            historyLogs: {
              logMessage: coreHistoryMessages.applicationStarted,
              onEvent: DefaultEvents.SUBMIT,
            },
          },
          progress: 0.5,
          lifecycle: EphemeralStateLifeCycle,

          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/PrerequisitesForm').then((module) =>
                  Promise.resolve(module.PrerequisitesForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Hefja umsókn',
                  type: 'primary',
                },
              ],
              write: 'all',
              api: [IdentityApi, UserProfileApi, PaymentPlanPrerequisitesApi],
              delete: true,
            },
          ],
        },
        on: {
          SUBMIT: { target: States.draft },
        },
      },
      [States.draft]: {
        meta: {
          name: States.draft,
          status: 'draft',
          actionCard: {
            title: application.name,
            description: application.description,
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationSent,
                onEvent: DefaultEvents.SUBMIT,
              },
              {
                logMessage: coreHistoryMessages.applicationAborted,
                onEvent: DefaultEvents.ABORT,
              },
            ],
          },
          progress: 0.5,
          // Application is only suppose to live for an hour
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 3600 * 1000,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/PaymentPlanForm').then((module) =>
                  Promise.resolve(module.PaymentPlanForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          SUBMIT: {
            target: States.submitted,
          },
          [DefaultEvents.ABORT]: {
            target: States.closed,
          },
        },
      },
      [States.closed]: {
        meta: {
          name: States.closed,
          status: 'completed',
          actionCard: {
            title: application.name,
            description: application.description,
          },
          progress: 1,
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            whenToPrune: 0,
          },
        },
      },
      [States.submitted]: {
        meta: {
          name: States.submitted,
          status: 'completed',
          actionCard: {
            title: application.name,
            pendingAction: {
              title: conclusion.general.alertTitle,
              content: conclusion.general.alertMessage,
              displayStatus: 'success',
            },
          },
          onEntry: defineTemplateApi({
            action: ApiModuleActions.sendApplication,
          }),
          progress: 1,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 3600 * 1000,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/PaymentPlanSubmittedForm').then((module) =>
                  Promise.resolve(module.PaymentPlanSubmittedForm),
                ),
            },
          ],
        },
      },
    },
  },
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (id === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default PublicDebtPaymentPlanTemplate
