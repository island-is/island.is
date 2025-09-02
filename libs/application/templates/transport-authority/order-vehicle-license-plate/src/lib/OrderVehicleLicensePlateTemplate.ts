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
  InstitutionNationalIds,
} from '@island.is/application/types'
import {
  EphemeralStateLifeCycle,
  coreHistoryMessages,
  getValueViaPath,
  pruneAfterDays,
} from '@island.is/application/core'
import { Events, States, Roles } from './constants'
import { application as applicationMessage, information } from './messages'
import { ApiActions } from '../shared'
import { OrderVehicleLicensePlateSchema } from './dataSchema'
import {
  CurrentVehiclesApi,
  DeliveryStationsApi,
  IdentityApi,
  MockableSamgongustofaPaymentCatalogApi,
  PlateTypesApi,
  SamgongustofaPaymentCatalogApi,
} from '../dataProviders'
import { AuthDelegationType } from '@island.is/shared/types'
import { ApiScope } from '@island.is/auth/scopes'
import { buildPaymentState } from '@island.is/application/utils'
import { getChargeItems, getExtraData } from '../utils'
import { CodeOwners } from '@island.is/shared/constants'

const determineMessageFromApplicationAnswers = (application: Application) => {
  const plate = getValueViaPath(
    application.answers,
    'pickVehicle.plate',
    undefined,
  ) as string | undefined
  return {
    name: applicationMessage.name,
    value: plate ? `- ${plate}` : '',
  }
}

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.ORDER_VEHICLE_LICENSE_PLATE,
  name: determineMessageFromApplicationAnswers,
  codeOwner: CodeOwners.Origo,
  institution: applicationMessage.institutionName,
  translationNamespaces: [
    ApplicationConfigurations.OrderVehicleLicensePlate.translation,
  ],
  dataSchema: OrderVehicleLicensePlateSchema,
  allowedDelegations: [
    {
      type: AuthDelegationType.ProcurationHolder,
    },
    {
      type: AuthDelegationType.Custom,
    },
  ],
  requiredScopes: [ApiScope.samgongustofaVehicles],
  adminDataConfig: {
    whenToPostPrune: 2 * 365 * 24 * 3600 * 1000, // 2 years
    answers: [
      {
        key: 'pickVehicle.plate',
        isListed: true,
        label: information.labels.pickVehicle.vehicle,
      },
    ],
  },
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Panta skráningarmerki',
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
          onExit: defineTemplateApi({
            action: ApiActions.validateApplication,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/OrderVehicleLicensePlateForm/index').then(
                  (module) =>
                    Promise.resolve(module.OrderVehicleLicensePlateForm),
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
              api: [
                SamgongustofaPaymentCatalogApi,
                MockableSamgongustofaPaymentCatalogApi,
                CurrentVehiclesApi,
                DeliveryStationsApi,
                PlateTypesApi,
                IdentityApi,
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.PAYMENT },
        },
      },
      [States.PAYMENT]: buildPaymentState({
        organizationId: InstitutionNationalIds.SAMGONGUSTOFA,
        chargeItems: getChargeItems,
        extraData: getExtraData,
        submitTarget: States.COMPLETED,
        onExit: [
          defineTemplateApi({
            action: ApiActions.submitApplication,
            triggerEvent: DefaultEvents.SUBMIT,
          }),
        ],
      }),
      [States.COMPLETED]: {
        meta: {
          name: 'Completed',
          status: 'completed',
          lifecycle: pruneAfterDays(3 * 30),
          actionCard: {
            tag: {
              label: applicationMessage.actionCardDone,
              variant: 'blueberry',
            },
            pendingAction: {
              title: applicationMessage.pendingActionOrderReceivedTitle,
              displayStatus: 'success',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Confirmation').then((val) =>
                  Promise.resolve(val.Confirmation),
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
