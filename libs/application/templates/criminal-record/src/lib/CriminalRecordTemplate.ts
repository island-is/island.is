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
  coreHistoryMessages,
  corePendingActionMessages,
  pruneAfterDays,
} from '@island.is/application/core'
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
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Umsókn um sakavottorð',
          status: 'draft',
          actionCard: {
            tag: {
              label: m.actionCardDraft,
              variant: 'blue',
            },
            historyLogs: [
              {
                logMessage: coreHistoryMessages.paymentStarted,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
          progress: 0.25,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/CriminalRecordForm').then((module) =>
                  Promise.resolve(module.CriminalRecordForm),
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
                NationalRegistryUserApi,
                UserProfileApi,
                SyslumadurPaymentCatalogApi,
                CriminalRecordApi,
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.COMPLETED },
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
            pendingAction: {
              title: corePendingActionMessages.paymentPendingTitle,
              content: corePendingActionMessages.paymentPendingDescription,
              displayStatus: 'warning',
            },
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
          [DefaultEvents.SUBMIT]: { target: States.COMPLETED },
          [DefaultEvents.ABORT]: { target: States.DRAFT },
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
            pendingAction: {
              title: m.pendingActionApplicationCompletedTitle,
              displayStatus: 'success',
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
