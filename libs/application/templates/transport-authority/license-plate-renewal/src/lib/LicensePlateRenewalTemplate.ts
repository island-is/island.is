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
  IdentityApi,
  InstitutionNationalIds,
} from '@island.is/application/types'
import {
  EphemeralStateLifeCycle,
  coreHistoryMessages,
  corePendingActionMessages,
  getValueViaPath,
  pruneAfterDays,
} from '@island.is/application/core'
import { Events, States, Roles } from './constants'
import { application as applicationMessage } from './messages'
import { ApiActions } from '../shared'
import { LicensePlateRenewalSchema } from './dataSchema'
import {
  SamgongustofaPaymentCatalogApi,
  MyPlateOwnershipsApi,
  MockableSamgongustofaPaymentCatalogApi,
} from '../dataProviders'
import { AuthDelegationType } from '@island.is/shared/types'
import { ApiScope } from '@island.is/auth/scopes'
import { buildPaymentState } from '@island.is/application/utils'
import { getChargeItems, getExtraData } from '../utils'
import { isPaymentRequired } from '../utils/isPaymentRequired'
import { CodeOwners } from '@island.is/shared/constants'

const determineMessageFromApplicationAnswers = (application: Application) => {
  const regno = getValueViaPath(
    application.answers,
    'pickPlate.regno',
    undefined,
  ) as string | undefined
  return {
    name: applicationMessage.name,
    value: regno ? `- ${regno}` : '',
  }
}

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.LICENSE_PLATE_RENEWAL,
  name: determineMessageFromApplicationAnswers,
  codeOwner: CodeOwners.Origo,
  institution: applicationMessage.institutionName,
  translationNamespaces:
    ApplicationConfigurations.LicensePlateRenewal.translation,
  dataSchema: LicensePlateRenewalSchema,
  allowedDelegations: [
    {
      type: AuthDelegationType.ProcurationHolder,
    },
    {
      type: AuthDelegationType.Custom,
    },
  ],
  requiredScopes: [ApiScope.samgongustofaVehicles],
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Endurnýja einkanúmer',
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
          onExit: [
            defineTemplateApi({
              action: ApiActions.submitApplication,
            }),
          ],
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/LicensePlateRenewalForm/index').then(
                  (module) => Promise.resolve(module.LicensePlateRenewalForm),
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
                MyPlateOwnershipsApi,
                IdentityApi,
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: [
            {
              target: States.PAYMENT,
              cond: (application) => isPaymentRequired(application),
            },
            {
              target: States.COMPLETED,
              cond: (application) => !isPaymentRequired(application),
            },
          ],
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
              title: corePendingActionMessages.applicationReceivedTitle,
              displayStatus: 'success',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Conclusion').then((val) =>
                  Promise.resolve(val.Conclusion),
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
