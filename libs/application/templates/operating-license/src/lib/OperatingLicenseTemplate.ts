import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  ApplicationRole,
  defineTemplateApi,
  UserProfileApi,
  InstitutionNationalIds,
  ApplicationConfigurations,
  BasicChargeItem,
} from '@island.is/application/types'
import { dataSchema } from './dataSchema'
import { Roles, States, Events, ApiActions } from './constants'
import { m } from './messages'
import { FeatureFlagClient } from '@island.is/feature-flags'
import {
  getApplicationFeatureFlags,
  OperatingLicenseFeatureFlags,
} from './getApplicationFeatureFlags'
import {
  JudicialAdministrationApi,
  CriminalRecordApi,
  NoDebtCertificateApi,
  SyslumadurPaymentCatalogApi,
} from '../dataProviders'
import { AuthDelegationType } from '@island.is/shared/types'
import { coreHistoryMessages } from '@island.is/application/core'
import { buildPaymentState } from '@island.is/application/utils'
import { CodeOwners } from '@island.is/shared/constants'
import { getChargeItemCode } from './utils'

const oneDay = 24 * 3600 * 1000
const thirtyDays = 24 * 3600 * 1000 * 30

const pruneAfter = (time: number) => {
  return {
    shouldBeListed: true,
    shouldBePruned: true,
    whenToPrune: time,
  }
}

const getCodes = (application: Application): BasicChargeItem[] => {
  const chargeItemCode = getChargeItemCode(application.answers)
  if (!chargeItemCode) {
    throw new Error('chargeItemCode missing in request')
  }

  return [{ code: chargeItemCode }]
}

const configuration =
  ApplicationConfigurations[ApplicationTypes.OPERATING_LICENSE]

const OperatingLicenseTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.OPERATING_LICENSE,
  name: m.formName.defaultMessage,
  codeOwner: CodeOwners.Juni,
  institution: m.institution,
  allowedDelegations: [{ type: AuthDelegationType.ProcurationHolder }],
  dataSchema,
  translationNamespaces: [configuration.translation],
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: '',
          status: 'draft',
          progress: 0.33,
          lifecycle: pruneAfter(oneDay),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: async ({ featureFlagClient }) => {
                const featureFlags = await getApplicationFeatureFlags(
                  featureFlagClient as FeatureFlagClient,
                )
                return import('../forms/draft/index').then((val) =>
                  Promise.resolve(
                    val.getApplication({
                      allowFakeData:
                        featureFlags[OperatingLicenseFeatureFlags.ALLOW_FAKE],
                    }),
                  ),
                )
              },
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: m.confirm.defaultMessage,
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
              api: [
                SyslumadurPaymentCatalogApi,
                UserProfileApi,
                CriminalRecordApi,
                NoDebtCertificateApi,
                JudicialAdministrationApi,
              ],
            },
          ],
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationStarted,
                onEvent: DefaultEvents.PAYMENT,
              },
            ],
          },
        },
        on: {
          [DefaultEvents.PAYMENT]: { target: States.PAYMENT },
        },
      },
      [States.PAYMENT]: buildPaymentState({
        organizationId: InstitutionNationalIds.SYSLUMENN,
        chargeItems: getCodes,
      }),
      [States.DONE]: {
        meta: {
          name: 'Done',
          status: 'completed',
          progress: 1,
          lifecycle: pruneAfter(thirtyDays),
          onEntry: defineTemplateApi({
            action: ApiActions.submitOperatingLicenseApplication,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Done').then((val) =>
                  Promise.resolve(val.Done),
                ),
              read: {
                externalData: ['submitOperatingLicenseApplication'],
              },
            },
          ],
          actionCard: {
            pendingAction: {
              title: coreHistoryMessages.applicationReceived,
              content: '',
              displayStatus: 'success',
            },
          },
        },
      },
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (
      nationalId === application.applicant ||
      application.applicantActors.includes(nationalId)
    ) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default OperatingLicenseTemplate
