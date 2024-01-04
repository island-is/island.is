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
  getValueViaPath,
  pruneAfterDays,
} from '@island.is/application/core'
import { Events, States, Roles } from './constants'
import { ApiActions } from '../shared'
import { AuthDelegationType } from '@island.is/shared/types'
import { MachineAnswersSchema } from './dataSchema'
import { application as applicationMessage } from './messages'
import { assign } from 'xstate'
import set from 'lodash/set'
import {
  IdentityApi,
  UserProfileApi,
  VinnueftirlitidPaymentCatalogApi,
  MachinesApi,
} from '../dataProviders'
import { ApiScope } from '@island.is/auth/scopes'
import { Features } from '@island.is/feature-flags'

const determineMessageFromApplicationAnswers = (application: Application) => {
  const regNumber = getValueViaPath(
    application.answers,
    'machine.regNumber',
    undefined,
  ) as string | undefined
  return {
    name: applicationMessage.name,
    value: regNumber ? `- ${regNumber}` : '',
  }
}

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.CHANGE_MACHINE_SUPERVISOR,
  name: determineMessageFromApplicationAnswers,
  institution: applicationMessage.institutionName,
  featureFlag: Features.transferOfMachineOwnership,
  translationNamespaces: [
    ApplicationConfigurations.TransferOfMachineOwnership.translation,
  ],
  dataSchema: MachineAnswersSchema,
  allowedDelegations: [
    {
      type: AuthDelegationType.ProcurationHolder,
    },
    {
      type: AuthDelegationType.Custom,
    },
  ],
  requiredScopes: [ApiScope.vinnueftirlitid],
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Gagnaöflun',
          status: 'draft',
          actionCard: {
            tag: {
              label: applicationMessage.actionCardPrerequisites,
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
                import('../forms/Prerequisites').then((module) =>
                  Promise.resolve(module.PrerequisitesForm),
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
              delete: true,
              api: [
                IdentityApi,
                UserProfileApi,
                VinnueftirlitidPaymentCatalogApi,
                MachinesApi,
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DRAFT },
        },
      },
      [States.DRAFT]: {
        meta: {
          name: 'Tilkynning um eigendaskipti að tæki',
          status: 'draft',
          actionCard: {
            tag: {
              label: applicationMessage.actionCardDraft,
              variant: 'blue',
            },
            historyLogs: [
              {
                logMessage: coreHistoryMessages.paymentStarted,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
          lifecycle: EphemeralStateLifeCycle,

          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/TransferOfMachineOwnershipForm/index').then(
                  (module) =>
                    Promise.resolve(module.TransferOfMachineOwnershipForm),
                ),
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.PAYMENT },
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: 'Completed',
          status: 'completed',
          lifecycle: pruneAfterDays(3 * 30),
          onEntry: defineTemplateApi({
            action: ApiActions.submitApplication,
          }),
          actionCard: {
            tag: {
              label: applicationMessage.actionCardDone,
              variant: 'blueberry',
            },
            pendingAction: {
              title: corePendingActionMessages.applicationReceivedTitle,
              displayStatus: 'success',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Approved').then((module) =>
                  Promise.resolve(module.Approved),
                ),
              read: 'all',
            },
          ],
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      assignUsers: assign((context) => {
        const { application } = context

        const buyerNationalId = getBuyerNationalId(application)
        if (buyerNationalId !== null && buyerNationalId !== '') {
          set(application, 'assignees', [buyerNationalId])
        }
        return context
      }),
    },
  },
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    const buyerNationalId = getValueViaPath(
      application.answers,
      'buyer.nationalId',
      '',
    ) as string

    if (id === application.applicant) {
      return Roles.APPLICANT
    }
    if (id === buyerNationalId && application.assignees.includes(id)) {
      return Roles.BUYER
    }

    return undefined
  },
}

export default template

const getBuyerNationalId = (application: Application) => {
  try {
    const buyerNationalId = getValueViaPath(
      application.answers,
      'buyer.nationalId',
      '',
    ) as string
    return buyerNationalId
  } catch (error) {
    console.error(error)
    return ''
  }
}
