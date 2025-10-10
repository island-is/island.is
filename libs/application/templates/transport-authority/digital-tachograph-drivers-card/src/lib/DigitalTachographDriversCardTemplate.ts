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
  corePendingActionMessages,
  pruneAfterDays,
} from '@island.is/application/core'
import { Events, States, Roles } from './constants'
import { application } from './messages'
import { ApiActions } from '../shared'
import { DigitalTachographDriversCardSchema } from './dataSchema'
import {
  NationalRegistryUserApi,
  UserProfileApi,
  SamgongustofaPaymentCatalogApi,
  DrivingLicenseApi,
  QualityPhotoAndSignatureApi,
  NewestDriversCardApi,
  NationalRegistryBirthplaceApi,
  MockableSamgongustofaPaymentCatalogApi,
} from '../dataProviders'
import { buildPaymentState } from '@island.is/application/utils'
import { getChargeItems } from '../utils'
import { CodeOwners } from '@island.is/shared/constants'
import { FeatureFlagClient, Features } from '@island.is/feature-flags'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.DIGITAL_TACHOGRAPH_DRIVERS_CARD,
  name: application.name,
  codeOwner: CodeOwners.Origo,
  institution: application.institutionName,
  translationNamespaces:
    ApplicationConfigurations.DigitalTachographDriversCard.translation,
  dataSchema: DigitalTachographDriversCardSchema,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Ökumannskort',
          status: 'draft',
          actionCard: {
            tag: {
              label: application.actionCardDraft,
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
              formLoader: async ({ featureFlagClient }) => {
                const client = featureFlagClient as FeatureFlagClient
                const allowFakeData = await client.getValue(
                  Features.digitalTachographDriversCardAllowFakeData,
                  false,
                )

                const getForm = await import(
                  '../forms/digitalTachographDriversCardForm/index'
                ).then((module) => module.getDigitalTachographDriversCardForm)

                return getForm({
                  allowFakeData,
                })
              },
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
                NationalRegistryUserApi,
                UserProfileApi,
                SamgongustofaPaymentCatalogApi,
                MockableSamgongustofaPaymentCatalogApi,
                DrivingLicenseApi,
                QualityPhotoAndSignatureApi,
                NewestDriversCardApi,
                NationalRegistryBirthplaceApi,
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
              label: application.actionCardDone,
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
                import('../forms/confirmation').then((val) =>
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
