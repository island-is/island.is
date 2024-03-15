import {
  ApplicationTemplate,
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTypes,
  ApplicationRole,
  Application,
  DefaultEvents,
  defineTemplateApi,
  CurrentLicenseApi,
  QualitySignatureApi,
  QualityPhotoApi,
  NationalRegistryUserApi,
  UserProfileApi,
  JurisdictionApi,
  InstitutionNationalIds,
} from '@island.is/application/types'
import { Events, States, Roles } from './constants'
import { dataSchema } from './dataSchema'
import { m } from './messages'
import { ApiActions } from './constants'
import { FeatureFlagClient } from '@island.is/feature-flags'
import {
  DrivingLicenseDuplicateFeatureFlags,
  getApplicationFeatureFlags,
} from './getApplicationFeatureFlags'
import { SyslumadurPaymentCatalogApi } from '../dataProviders'
import {
  coreHistoryMessages,
  getValueViaPath,
} from '@island.is/application/core'
import { buildPaymentState } from '@island.is/application/utils'

const oneDay = 24 * 3600 * 1000
const thirtyDays = 24 * 3600 * 1000 * 30

const pruneAfter = (time: number) => {
  return {
    shouldBeListed: true,
    shouldBePruned: true,
    whenToPrune: time,
  }
}
const getCodes = (application: Application) => {
  const chargeItemCode = getValueViaPath<string>(
    application.answers,
    'chargeItemCode',
  )

  if (!chargeItemCode) {
    throw new Error('chargeItemCode missing in answers')
  }
  return [chargeItemCode]
}

const DrivingLicenseDuplicateTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.DRIVING_LICENSE_DUPLICATE,
  name: m.applicationTitle,
  dataSchema: dataSchema,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Draft',
          status: 'draft',
          progress: 0.33,
          lifecycle: pruneAfter(oneDay),
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationStarted,
                onEvent: DefaultEvents.PAYMENT,
              },
              {
                onEvent: DefaultEvents.REJECT,
                logMessage: coreHistoryMessages.applicationRejected,
              },
            ],
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: async ({ featureFlagClient }) => {
                const featureFlags = await getApplicationFeatureFlags(
                  featureFlagClient as FeatureFlagClient,
                )

                const getForm = await import('../forms/application').then(
                  (val) => val.getApplication,
                )

                return getForm({
                  allowFakeData:
                    featureFlags[
                      DrivingLicenseDuplicateFeatureFlags.ALLOW_FAKE
                    ],
                })
              },
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: m.proceedToPayment,
                  type: 'primary',
                },
              ],
              api: [
                CurrentLicenseApi,
                JurisdictionApi,
                NationalRegistryUserApi,
                SyslumadurPaymentCatalogApi,
                QualitySignatureApi,
                QualityPhotoApi,
                UserProfileApi,
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.PAYMENT]: { target: States.PAYMENT },
          [DefaultEvents.REJECT]: { target: States.DECLINED },
        },
      },
      [States.PAYMENT]: buildPaymentState({
        organizationId: InstitutionNationalIds.SYSLUMENN,
        chargeItemCodes: getCodes,
      }),
      [States.DONE]: {
        meta: {
          name: 'Done',
          status: 'completed',
          actionCard: {
            pendingAction: {
              title: m.pendingActionApplicationCompletedTitle,
              displayStatus: 'success',
            },
          },
          progress: 1,
          lifecycle: pruneAfter(thirtyDays),
          onEntry: defineTemplateApi({
            action: ApiActions.submitApplication,
            shouldPersistToExternalData: true,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () => import('../forms/done').then((val) => val.done),
              read: 'all',
            },
          ],
        },
      },
      [States.DECLINED]: {
        meta: {
          name: 'Declined',
          status: 'rejected',
          progress: 1,
          lifecycle: pruneAfter(thirtyDays),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/declined').then((val) => val.declined),
              read: 'all',
            },
          ],
        },
      },
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (application.applicant === nationalId) {
      return Roles.APPLICANT
    }
  },
}

export default DrivingLicenseDuplicateTemplate
