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
  AllPhotosFromThjodskraApi,
  QualityPhotoApi,
  NationalRegistryUserApi,
  UserProfileApi,
  JurisdictionApi,
  InstitutionNationalIds,
  ApplicationConfigurations,
  BasicChargeItem,
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
import {
  DuplicateEligibilityApi,
  MockableSyslumadurPaymentCatalogApi,
  SyslumadurPaymentCatalogApi,
} from '../dataProviders'
import {
  coreHistoryMessages,
  getValueViaPath,
} from '@island.is/application/core'
import { buildPaymentState } from '@island.is/application/utils'
import { CodeOwners } from '@island.is/shared/constants'
import { DriversLicense } from '@island.is/clients/driving-license'
import { info } from 'kennitala'

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
  const codes: BasicChargeItem[] = []
  let chargeItemCode = 'AY116'
  const licenseData = getValueViaPath<DriversLicense>(
    application.externalData,
    'currentLicense.data',
  )

  // Temporary Driving License
  if (licenseData?.categories.some((category) => category.validToCode === 8)) {
    chargeItemCode = 'AY114'
  }

  // Change price based on age, takes precedence over temporary license
  // and therefore simply overrides chargeItemCode instead of pushing a new one
  const age = info(application.applicant).age
  if (age >= 65) {
    chargeItemCode = 'AY137'
  }

  const withDeliveryFee =
    getValueViaPath<number>(application.answers, 'deliveryMethod') === 1

  codes.push({ code: chargeItemCode as string })
  if (withDeliveryFee) {
    codes.push({ code: 'AY145' })
  }

  return codes
}

const configuration =
  ApplicationConfigurations[ApplicationTypes.DRIVING_LICENSE_DUPLICATE]

const DrivingLicenseDuplicateTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.DRIVING_LICENSE_DUPLICATE,
  codeOwner: CodeOwners.Juni,
  dataSchema: dataSchema,
  translationNamespaces: configuration.translation,
  institution: m.applicantInstitution,
  name: m.applicationTitle,
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
                  allowThjodskraPhotos:
                    featureFlags[
                      DrivingLicenseDuplicateFeatureFlags.ALLOW_THJODSKRA_PHOTOS
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
                NationalRegistryUserApi.configure({
                  params: {
                    legalDomicileIceland: true,
                  },
                }),
                SyslumadurPaymentCatalogApi,
                MockableSyslumadurPaymentCatalogApi,
                AllPhotosFromThjodskraApi,
                QualityPhotoApi,
                UserProfileApi,
                DuplicateEligibilityApi,
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
        chargeItems: getCodes,
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
