import {
  ApplicationConfigurations,
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
} from '@island.is/application/types'
import {
  EphemeralStateLifeCycle,
  coreHistoryMessages,
  pruneAfterDays,
} from '@island.is/application/core'
import { Events, States, Roles } from './constants'
import { z } from 'zod'
import { m } from './messages'
import { NoDebtCertificateApi } from '../dataProviders'
import { AuthDelegationType } from '@island.is/shared/types'
import { CodeOwners } from '@island.is/shared/constants'

const NoDebtCertificateSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
})

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.NO_DEBT_CERTIFICATE,
  name: m.name,
  codeOwner: CodeOwners.Origo,
  institution: m.institutionName,
  translationNamespaces: [
    ApplicationConfigurations.NoDebtCertificate.translation,
  ],
  dataSchema: NoDebtCertificateSchema,
  allowedDelegations: [
    {
      type: AuthDelegationType.ProcurationHolder,
    },
  ],
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Umsókn um skuldleysisvottorð',
          status: 'draft',
          actionCard: {
            tag: {
              label: m.actionCardDraft,
              variant: 'blue',
            },
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationStarted,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/NoDebtCertificateForm').then((module) =>
                  Promise.resolve(module.NoDebtCertificateForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
              api: [NoDebtCertificateApi],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.COMPLETED },
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: 'Completed',
          status: 'completed',
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
