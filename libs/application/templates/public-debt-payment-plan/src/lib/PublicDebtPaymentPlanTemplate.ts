import {
  Application,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
} from '@island.is/application/core'
import { PublicDebtPaymentPlanSchema } from './dataSchema'
import { application } from './messages'

const States = {
  draft: 'draft',
  submitted: 'submitted',
  closed: 'closed',
  prerequisites: 'prerequisites',
}
export enum API_MODULE_ACTIONS {
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
  institution: application.institutionName,
  readyForProduction: true,
  translationNamespaces: [
    ApplicationConfigurations.PublicDebtPaymentPlan.translation,
  ],
  dataSchema: PublicDebtPaymentPlanSchema,
  stateMachineConfig: {
    initial: States.prerequisites,
    states: {
      [States.prerequisites]: {
        meta: {
          name: States.prerequisites,
          actionCard: {
            title: application.name,
            description: application.description,
          },
          progress: 0.5,
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            whenToPrune: 3600 * 1000,
          },
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
          actionCard: {
            title: application.name,
            description: application.description,
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
          actionCard: {
            title: application.name,
            description: application.description,
          },
          progress: 1,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 0,
          },
        },
      },
      [States.submitted]: {
        meta: {
          name: States.submitted,
          actionCard: {
            title: application.name,
            description: application.description,
          },
          onEntry: {
            apiModuleAction: API_MODULE_ACTIONS.sendApplication,
          },
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
