import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  FormModes,
  UserProfileApi,
  ApplicationConfigurations,
  defineTemplateApi,
  InstitutionNationalIds,
} from '@island.is/application/types'
import * as m from '../lib/messages/application'
import { ApiActions, Events, Roles, States } from '../utils/constants'
import { CodeOwners } from '@island.is/shared/constants'
import { dataSchema } from './dataSchema'
import {
  coreHistoryMessages,
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import { buildPaymentState } from '@island.is/application/utils'
import { assign } from 'xstate'
import { AuthDelegationType } from '@island.is/shared/types'
import { ApiScope, HmsScope } from '@island.is/auth/scopes'
import {
  HMSPaymentCatalogApi,
  IdentityApi,
  MockableHMSPaymentCatalogApi,
  propertiesApi,
} from '../dataProviders'
import { getChargeItems } from '../utils/getChargeItems'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.REGISTRATION_OF_NEW_PROPERTY_NUMBERS,
  name: m.application.applicationName,
  codeOwner: CodeOwners.Origo,
  institution: m.application.institutionName,
  translationNamespaces:
    ApplicationConfigurations.RegistrationOfNewPropertyNumbers.translation,
  requiredScopes: [HmsScope.properties, ApiScope.hms],
  dataSchema,
  allowedDelegations: [
    {
      type: AuthDelegationType.ProcurationHolder,
    },
    {
      type: AuthDelegationType.Custom,
    },
  ],
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Skilyrði',
          progress: 0,
          status: FormModes.DRAFT,
          actionCard: {
            tag: {
              label: m.application.actionCardPrerequisites,
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
                import('../forms/prerequisitesForm').then((module) =>
                  Promise.resolve(module.Prerequisites),
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
              api: [
                UserProfileApi,
                IdentityApi,
                propertiesApi,
                HMSPaymentCatalogApi,
                MockableHMSPaymentCatalogApi,
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
          name: 'Main form',
          progress: 0.4,
          status: FormModes.DRAFT,
          actionCard: {
            tag: {
              label: m.application.actionCardDraft,
              variant: 'blue',
            },
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationSent,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/mainForm').then((module) =>
                  Promise.resolve(module.MainForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
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
      [States.PAYMENT]: buildPaymentState({
        organizationId: InstitutionNationalIds.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
        chargeItems: getChargeItems,
        submitTarget: States.COMPLETED,
        lifecycle: {
          shouldBeListed: true,
          shouldBePruned: true,
          whenToPrune: 600 * 1000 * 6, // 60 minutes
        },
        onExit: [
          defineTemplateApi({
            action: ApiActions.submitApplication,
            triggerEvent: DefaultEvents.SUBMIT,
          }),
        ],
      }),
      [States.COMPLETED]: {
        meta: {
          name: 'Completed form',
          progress: 1,
          status: FormModes.COMPLETED,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/completedForm').then((module) =>
                  Promise.resolve(module.completedForm),
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
      clearAssignees: assign((context) => ({
        ...context,
        application: {
          ...context.application,
          assignees: [],
        },
      })),
    },
  },
  mapUserToRole: (
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined => {
    if (nationalId === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default template
