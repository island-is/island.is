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
import { application as applicationMessage } from './messages'
import { ApiActions } from '../shared'
import { OrderVehicleRegistrationCertificateSchema } from './dataSchema'
import {
  IdentityApi,
  SamgongustofaPaymentCatalogApi,
  CurrentVehiclesApi,
} from '../dataProviders'
import { AuthDelegationType } from '@island.is/shared/types'
import { Features } from '@island.is/feature-flags'
import { ApiScope } from '@island.is/auth/scopes'
import { buildPaymentState } from '@island.is/application/utils'
import { ChargeItemCode } from '@island.is/shared/constants'
import { getExtraData } from '../utils'

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
  type: ApplicationTypes.ORDER_VEHICLE_REGISTRATION_CERTIFICATE,
  name: determineMessageFromApplicationAnswers,
  institution: applicationMessage.institutionName,
  translationNamespaces: [
    ApplicationConfigurations.OrderVehicleRegistrationCertificate.translation,
  ],
  dataSchema: OrderVehicleRegistrationCertificateSchema,
  allowedDelegations: [
    {
      type: AuthDelegationType.ProcurationHolder,
    },
    {
      type: AuthDelegationType.Custom,
      featureFlag: Features.transportAuthorityApplicationsCustomDelegation,
    },
  ],
  requiredScopes: [ApiScope.samgongustofaVehicles],
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Panta skráningarskírteini',
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
          progress: 0.25,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import(
                  '../forms/OrderVehicleRegistrationCertificateForm/index'
                ).then((module) =>
                  Promise.resolve(
                    module.OrderVehicleRegistrationCertificateForm,
                  ),
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
                IdentityApi,
                SamgongustofaPaymentCatalogApi,
                CurrentVehiclesApi,
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
        chargeItemCodes: [
          ChargeItemCode.TRANSPORT_AUTHORITY_ORDER_VEHICLE_REGISTRATION_CERTIFICATE,
        ],
        submitTarget: States.COMPLETED,
        extraData: getExtraData,
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
          progress: 1,
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
