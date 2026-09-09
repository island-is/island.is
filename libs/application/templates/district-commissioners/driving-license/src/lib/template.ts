import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
  coreHistoryMessages,
} from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  DefaultEvents,
  defineTemplateApi,
  JurisdictionApi,
  CurrentLicenseApi,
  DrivingAssessmentApi,
  NationalRegistryV3UserApi,
  UserProfileApi,
  QualityPhotoAndSignatureApi,
  AllPhotosFromThjodskraApi,
  TeachersApi,
  InstitutionNationalIds,
  ApplicationConfigurations,
} from '@island.is/application/types'
import { FeatureFlagClient } from '@island.is/feature-flags'
import {
  Events,
  States,
  Roles,
  ApiActions,
  B_TEMP,
  B_FULL,
  B_FULL_RENEWAL_65,
} from '../utils/constants'
import { dataSchema } from './dataSchema'
import {
  getApplicationFeatureFlags,
  DrivingLicenseFeatureFlags,
} from '../utils/getApplicationFeatureFlags'
import { m } from './messages'
import { getCodes, hasCompletedPrerequisitesStep } from '../utils/formUtils'
import {
  EligibilityApi,
  GlassesCheckApi,
  MockableSyslumadurPaymentCatalogApi,
  SyslumadurPaymentCatalogApi,
} from '../dataProviders'
import { buildPaymentState } from '@island.is/application/utils'
import { CodeOwners } from '@island.is/shared/constants'

const configuration =
  ApplicationConfigurations[
    ApplicationTypes.DISTRICT_COMMISSIONER_DRIVING_LICENSE
  ]

const DrivingLicenseTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.DISTRICT_COMMISSIONER_DRIVING_LICENSE,
  // TEMP local bypass — do NOT commit. Re-enable once the ConfigCat flag exists.
  // featureFlag: Features.isDistrictCommissionerDrivingLicenseEnabled,
  name: (application) =>
    application.answers.applicationFor === B_TEMP
      ? m.applicationForDrivingLicense.defaultMessage +
        ' - ' +
        m.applicationForTempLicenseTitle.defaultMessage
      : application.answers.applicationFor === B_FULL
      ? m.applicationForDrivingLicense.defaultMessage +
        ' - ' +
        m.applicationForFullLicenseTitle.defaultMessage
      : application.answers.applicationFor === B_FULL_RENEWAL_65
      ? m.applicationForDrivingLicense.defaultMessage +
        ' - ' +
        m.applicationForRenewalLicenseTitle.defaultMessage
      : m.applicationForDrivingLicense.defaultMessage,
  codeOwner: CodeOwners.Juni,
  institution: m.nationalCommissionerOfPolice,
  dataSchema,
  translationNamespaces: configuration.translation,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: m.applicationForDrivingLicense.defaultMessage,
          progress: 0.2,
          status: 'draft',
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: async ({ featureFlagClient }) => {
                const featureFlags = await getApplicationFeatureFlags(
                  featureFlagClient as FeatureFlagClient,
                )

                const getForm = await import(
                  '../forms/prerequisites/getForm'
                ).then((val) => val.getForm)

                return getForm({
                  allowFakeData:
                    featureFlags[DrivingLicenseFeatureFlags.ALLOW_FAKE],
                })
              },
              write: 'all',
              delete: true,
              api: [
                NationalRegistryV3UserApi,
                TeachersApi,
                UserProfileApi,
                SyslumadurPaymentCatalogApi,
                MockableSyslumadurPaymentCatalogApi,
                GlassesCheckApi,
                JurisdictionApi,
                CurrentLicenseApi.configure({
                  params: {
                    useLegacyVersion: true,
                  },
                }),
                DrivingAssessmentApi,
                QualityPhotoAndSignatureApi,
                AllPhotosFromThjodskraApi,
                EligibilityApi,
              ],
            },
          ],
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationStarted,
                onEvent: DefaultEvents.SUBMIT,
              },
              {
                logMessage: coreHistoryMessages.applicationRejected,
                onEvent: DefaultEvents.REJECT,
              },
            ],
          },
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DRAFT },
          [DefaultEvents.REJECT]: { target: States.DECLINED },
        },
      },
      [States.DRAFT]: {
        meta: {
          name: m.applicationForDrivingLicense.defaultMessage,
          status: 'draft',
          progress: 0.4,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 30 * 24 * 3600 * 1000,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: async ({ featureFlagClient }) => {
                const featureFlags = await getApplicationFeatureFlags(
                  featureFlagClient as FeatureFlagClient,
                )

                const getForm = await import('../forms/draft/getForm').then(
                  (val) => val.getForm,
                )

                return getForm({
                  allowPickLicense:
                    featureFlags[
                      DrivingLicenseFeatureFlags.ALLOW_LICENSE_SELECTION
                    ],
                  allow65Renewal:
                    featureFlags[DrivingLicenseFeatureFlags.ALLOW_65_RENEWAL],
                })
              },
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: m.continue,
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.PAYMENT]: [
            {
              target: States.PREREQUISITES,
              cond: hasCompletedPrerequisitesStep(false),
            },
            {
              target: States.PAYMENT,
              cond: hasCompletedPrerequisitesStep(true),
            },
          ],
          [DefaultEvents.REJECT]: { target: States.DECLINED },
        },
      },
      [States.PAYMENT]: buildPaymentState({
        organizationId: InstitutionNationalIds.SYSLUMENN,
        chargeItems: getCodes,
        // Surface RLS's resolved submit-failure reason as a toast on the payment
        // screen (the generic error screen is unchanged). Opt-in per template.
        showSubmitErrorReason: true,
      }),
      [States.DONE]: {
        meta: {
          name: 'Done',
          progress: 1,
          status: 'completed',
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            namespace: ApplicationTypes.DRIVING_LICENSE,
            action: ApiActions.submitApplication,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () => import('../forms/done').then((val) => val.done),
              read: 'all',
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
      [States.DECLINED]: {
        meta: {
          name: 'Declined',
          status: 'rejected',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
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
  mapUserToRole(nationalId, { applicant }) {
    if (nationalId === applicant) {
      return Roles.APPLICANT
    }

    return undefined
  },
}

export default DrivingLicenseTemplate
