import {
  ApplicationConfigurations,
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  defineTemplateApi,
} from '@island.is/application/types'
import {
  EphemeralStateLifeCycle,
  pruneAfterDays,
} from '@island.is/application/core'
import { Events, States, Roles, MCEvents } from './constants'
import { z } from 'zod'
import { ApiActions } from '../shared'
import { m } from './messages'
import {
  existsAndKMarking,
  exists,
} from '../util/mortgageCertificateValidation'
import {
  IdentityApi,
  NationalRegistryRealEstateApi,
  UserProfileApi,
  SyslumadurPaymentCatalogApi,
} from '../dataProviders'
import { Features } from '@island.is/feature-flags'
import { AuthDelegationType } from '@island.is/shared/types'

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
  readyForProduction: true,
  translationNamespaces: [
    ApplicationConfigurations.MortgageCertificate.translation,
  ],
  dataSchema: MortgageCertificateSchema,
  allowedDelegations: [
    {
      type: AuthDelegationType.ProcurationHolder,
      featureFlag: Features.mortgageCertificateDelegations,
    },
  ],
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Umsókn um veðbókarvottorð',
          status: 'draft',
          actionCard: {
            tag: {
              label: m.actionCardDraft,
              variant: 'blue',
            },
          },
          progress: 0.25,
          lifecycle: EphemeralStateLifeCycle,
          onExit: defineTemplateApi({
            action: ApiActions.validateMortgageCertificate,
          }),
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
              api: [
                IdentityApi,
                NationalRegistryRealEstateApi,
                UserProfileApi,
                SyslumadurPaymentCatalogApi,
              ],
              delete: true,
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
          status: 'inprogress',
          name: 'Beiðni um vinnslu',
          actionCard: {
            tag: {
              label: m.actionCardDraft,
              variant: 'blue',
            },
          },
          progress: 0.25,
          lifecycle: pruneAfterDays(3 * 30),
          onEntry: defineTemplateApi({
            action: ApiActions.submitRequestToSyslumenn,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/PendingRejected').then(
                  (val) => val.PendingRejected,
                ),
              actions: [],
              write: 'all',
              delete: true,
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
          status: 'inprogress',
          actionCard: {
            tag: {
              label: m.actionCardDraft,
              variant: 'blue',
            },
          },
          progress: 0.25,
          lifecycle: pruneAfterDays(3 * 30),
          onExit: defineTemplateApi({
            action: ApiActions.validateMortgageCertificate,
          }),
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
              delete: true,
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
          status: 'inprogress',
          actionCard: {
            tag: {
              label: m.actionCardPayment,
              variant: 'red',
            },
          },
          progress: 0.25,
          lifecycle: EphemeralStateLifeCycle,
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
          status: 'inprogress',
          actionCard: {
            tag: {
              label: m.actionCardPayment,
              variant: 'red',
            },
          },
          progress: 0.8,
          lifecycle: pruneAfterDays(1 / 24),
          onEntry: defineTemplateApi({
            action: ApiActions.createCharge,
          }),
          onExit: defineTemplateApi({
            action: ApiActions.submitApplication,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Payment').then((val) => val.Payment),
              actions: [
                { event: DefaultEvents.SUBMIT, name: 'Áfram', type: 'primary' },
              ],
              write: 'all',
              delete: true,
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
          status: 'completed',
          progress: 1,
          lifecycle: pruneAfterDays(3 * 30),
          actionCard: {
            tag: {
              label: m.actionCardDone,
              variant: 'blueberry',
            },
          },
          onEntry: defineTemplateApi({
            action: ApiActions.getMortgageCertificate,
          }),
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
