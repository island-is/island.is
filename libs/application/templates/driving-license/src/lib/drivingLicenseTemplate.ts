import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
  coreHistoryMessages,
  getValueViaPath,
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
  NationalRegistryUserApi,
  UserProfileApi,
  QualityPhotoApi,
  TeachersApi,
  ExistingApplicationApi,
  InstitutionNationalIds,
  Application,
  ApplicationConfigurations,
  BasicChargeItem,
} from '@island.is/application/types'
import { FeatureFlagClient } from '@island.is/feature-flags'
import {
  Events,
  States,
  Roles,
  BE,
  B_TEMP,
  B_FULL,
  B_FULL_RENEWAL_65,
  ApiActions,
  CHARGE_ITEM_CODES,
  DELIVERY_FEE,
} from './constants'
import { dataSchema } from './dataSchema'
import {
  getApplicationFeatureFlags,
  DrivingLicenseFeatureFlags,
} from './getApplicationFeatureFlags'
import { m } from './messages'
import { hasCompletedPrerequisitesStep } from './utils'
import {
  GlassesCheckApi,
  MockableSyslumadurPaymentCatalogApi,
  SyslumadurPaymentCatalogApi,
} from '../dataProviders'
import { buildPaymentState } from '@island.is/application/utils'
import { Pickup } from './types'
import { CodeOwners } from '@island.is/shared/constants'

const getCodes = (application: Application): BasicChargeItem[] => {
  const applicationFor = getValueViaPath<
    'B-full' | 'B-temp' | 'BE' | 'B-full-renewal-65' | 'B-advanced'
  >(application.answers, 'applicationFor', 'B-full')

  const pickup = getValueViaPath<Pickup>(application.answers, 'pickup')

  const codes: BasicChargeItem[] = []

  const DEFAULT_ITEM_CODE = CHARGE_ITEM_CODES[B_FULL]

  const targetCode =
    typeof applicationFor === 'string'
      ? CHARGE_ITEM_CODES[applicationFor]
        ? CHARGE_ITEM_CODES[applicationFor]
        : DEFAULT_ITEM_CODE
      : DEFAULT_ITEM_CODE

  codes.push({ code: targetCode })

  if (pickup === Pickup.POST) {
    codes.push({ code: CHARGE_ITEM_CODES[DELIVERY_FEE] })
  }

  if (!targetCode) {
    throw new Error('No selected charge item code')
  }

  return codes
}

const configuration =
  ApplicationConfigurations[ApplicationTypes.DRIVING_LICENSE]

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.DRIVING_LICENSE,
  name: (application) =>
    application.answers.applicationFor === BE
      ? m.applicationForBELicenseTitle.defaultMessage
      : application.answers.applicationFor === B_TEMP
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
  translationNamespaces: [configuration.translation],
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
                  allowPickLicense:
                    featureFlags[
                      DrivingLicenseFeatureFlags.ALLOW_LICENSE_SELECTION
                    ],
                  allowBELicense:
                    featureFlags[DrivingLicenseFeatureFlags.ALLOW_BE_LICENSE],
                  allow65Renewal:
                    featureFlags[DrivingLicenseFeatureFlags.ALLOW_65_RENEWAL],
                  allowAdvanced:
                    featureFlags[DrivingLicenseFeatureFlags.ALLOW_ADVANCED],
                })
              },
              write: 'all',
              delete: true,
              api: [
                NationalRegistryUserApi,
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
                QualityPhotoApi,
                ExistingApplicationApi.configure({
                  params: {
                    states: [States.PAYMENT, States.DRAFT],
                    where: {
                      applicant: 'applicant',
                    },
                  },
                }),
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
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: async () => (await import('../forms/draft')).draft,
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
      }),
      [States.DONE]: {
        meta: {
          name: 'Done',
          progress: 1,
          status: 'completed',
          lifecycle: DefaultStateLifeCycle,
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

export default template
