import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  ApplicationConfigurations,
} from '@island.is/application/core'
import { Events, States, Roles, MCEvents } from './constants'
import * as z from 'zod'
import { ApiActions } from '../shared'
import { m } from './messages'
import {
  existsAndKMarking,
  exists,
} from '../util/mortgageCertificateValidation'

const MortgageCertificateSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  selectProperty: z
    .object({
      propertyNumber: z.string().optional(),
      isFromSearch: z.boolean().optional(),
    })
    .optional(),
})

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.MORTGAGE_CERTIFICATE,
  name: m.name,
  institution: m.institutionName,
  translationNamespaces: [
    ApplicationConfigurations.MortgageCertificate.translation,
  ],
  dataSchema: MortgageCertificateSchema,
  readyForProduction: true,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Umsókn um veðbókarvottorð',
          actionCard: {
            tag: {
              label: m.actionCardDraft,
              variant: 'blue',
            },
          },
          progress: 0.25,
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            // Applications that stay in this state for 24 hours will be pruned automatically
            whenToPrune: 24 * 3600 * 1000,
          },
          onExit: {
            apiModuleAction: ApiActions.validateMortgageCertificate,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/MortgageCertificateForm').then((module) =>
                  Promise.resolve(module.MortgageCertificateForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: [
            {
              target: States.PAYMENT_INFO,
              cond: existsAndKMarking,
            },
            {
              target: States.PENDING_REJECTED,
              cond: exists,
            },
            {
              target: States.DRAFT,
            },
          ],
        },
      },
      [States.PENDING_REJECTED]: {
        meta: {
          name: 'Beiðni um vinnslu',
          actionCard: {
            tag: {
              label: m.actionCardDraft,
              variant: 'blue',
            },
          },
          progress: 0.25,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            // Applications that stay in this state for 3x30 days (approx. 3 months) will be pruned automatically
            whenToPrune: 3 * 30 * 24 * 3600 * 1000,
          },
          onEntry: {
            apiModuleAction: ApiActions.submitRequestToSyslumenn,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/PendingRejected').then(
                  (val) => val.PendingRejected,
                ),
              actions: [],
              write: 'all',
            },
          ],
        },
        on: {
          [MCEvents.PENDING_REJECTED_TRY_AGAIN]: {
            target: States.PENDING_REJECTED_TRY_AGAIN,
          },
          [DefaultEvents.SUBMIT]: { target: States.PENDING_REJECTED_TRY_AGAIN },
        },
      },
      [States.PENDING_REJECTED_TRY_AGAIN]: {
        meta: {
          name: 'Beiðni um vinnslu',
          actionCard: {
            tag: {
              label: m.actionCardDraft,
              variant: 'blue',
            },
          },
          progress: 0.25,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            // Applications that stay in this state for 3x30 days (approx. 3 months) will be pruned automatically
            whenToPrune: 3 * 30 * 24 * 3600 * 1000,
          },
          onExit: {
            apiModuleAction: ApiActions.validateMortgageCertificate,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/PendingRejectedTryAgain').then(
                  (val) => val.PendingRejectedTryAgain,
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: [
            {
              target: States.PAYMENT_INFO,
              cond: existsAndKMarking,
            },
            {
              target: States.PENDING_REJECTED_TRY_AGAIN,
            },
          ],
        },
      },
      [States.PAYMENT_INFO]: {
        meta: {
          name: 'Greiðsla',
          actionCard: {
            tag: {
              label: m.actionCardPayment,
              variant: 'red',
            },
          },
          progress: 0.25,
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            // Applications that stay in this state for 24 hours will be pruned automatically
            whenToPrune: 24 * 3600 * 1000,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/PaymentInfo').then((val) => val.PaymentInfo),
              actions: [
                { event: DefaultEvents.SUBMIT, name: 'Áfram', type: 'primary' },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.PAYMENT]: { target: States.PAYMENT },
          [DefaultEvents.SUBMIT]: { target: States.PAYMENT },
        },
      },
      [States.PAYMENT]: {
        meta: {
          name: 'Greiðsla',
          actionCard: {
            tag: {
              label: m.actionCardPayment,
              variant: 'red',
            },
          },
          progress: 0.8,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            // Applications that stay in this state for 24 hours will be pruned automatically
            whenToPrune: 24 * 3600 * 1000,
          },
          onEntry: {
            apiModuleAction: ApiActions.createCharge,
          },
          onExit: {
            apiModuleAction: ApiActions.submitApplication,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Payment').then((val) => val.Payment),
              actions: [
                { event: DefaultEvents.SUBMIT, name: 'Áfram', type: 'primary' },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.PAYMENT]: { target: States.DRAFT },
          [DefaultEvents.SUBMIT]: { target: States.COMPLETED },
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: 'Completed',
          progress: 1,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            // Applications that stay in this state for 3x30 days (approx. 3 months) will be pruned automatically
            whenToPrune: 3 * 30 * 24 * 3600 * 1000,
          },
          actionCard: {
            tag: {
              label: m.actionCardDone,
              variant: 'blueberry',
            },
          },
          onEntry: {
            apiModuleAction: ApiActions.getMortgageCertificate,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Approved').then((val) =>
                  Promise.resolve(val.Approved),
                ),
              read: 'all',
            },
          ],
        },
        type: 'final' as const,
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

export default template
