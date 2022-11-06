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
import { Events, States, Roles } from './constants'
import { z } from 'zod'
import { ApiActions } from '../shared'
import { m } from './messages'
import {
  NationalRegistryUserApi,
  UserProfileApi,
  SyslumadurPaymentCatalogApi,
  CriminalRecordApi,
} from '../dataProviders'

const CriminalRecordSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
})

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.CRIMINAL_RECORD,
  name: m.name,
  institution: m.institutionName,
  translationNamespaces: [ApplicationConfigurations.CriminalRecord.translation],
  dataSchema: CriminalRecordSchema,
  readyForProduction: true,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Umsókn um sakavottorð',
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
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/CriminalRecordForm').then((module) =>
                  Promise.resolve(module.CriminalRecordForm),
                ),
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
              api: [
                NationalRegistryUserApi,
                UserProfileApi,
                SyslumadurPaymentCatalogApi,
                CriminalRecordApi,
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.PAYMENT]: {
            target: States.PAYMENT,
          },
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
            // Applications that stay in this state for 1 hour will be pruned automatically
            whenToPrune: 1 * 3600 * 1000,
          },
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
          [DefaultEvents.SUBMIT]: { target: States.COMPLETED },
          [DefaultEvents.PAYMENT]: { target: States.DRAFT },
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
          onEntry: defineTemplateApi({
            action: ApiActions.getCriminalRecord,
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
