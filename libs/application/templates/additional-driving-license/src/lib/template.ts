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
  NationalRegistryV3UserApi,
  TeachersApi,
  JurisdictionApi,
  CurrentLicenseApi,
  DrivingAssessmentApi,
  QualityPhotoApi,
  QualityPhotoAndSignatureApi,
  AllPhotosFromThjodskraApi,
  ExistingApplicationApi,
  InstitutionNationalIds,
} from '@island.is/application/types'
import { Events, Roles, States } from '../utils/constants'
import { CodeOwners } from '@island.is/shared/constants'
import { dataSchema } from './dataSchema'
import { FeatureFlagClient } from '@island.is/feature-flags'
import {
  coreHistoryMessages,
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import { m } from './messages'
import { BE, B_ADVANCED } from './constants'
import {
  MockableSyslumadurPaymentCatalogApi,
  SyslumadurPaymentCatalogApi,
} from '../dataProviders'
import {
  getApplicationFeatureFlags,
  DrivingLicenseFeatureFlags,
} from './getApplicationFeatureFlags'
import { getCodes, hasCompletedPrerequisitesStep } from './utils'
import { buildPaymentState } from '@island.is/application/utils'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.ADDITIONAL_DRIVING_LICENSE,
  name: (application) =>
    application.answers.applicationFor === BE
      ? m.applicationForBELicenseTitle.defaultMessage
      : application.answers.applicationFor === B_ADVANCED
      ? m.applicationForBAdvancedDescription.defaultMessage
      : m.applicationForDrivingLicense.defaultMessage,
  codeOwner: CodeOwners.Juni,
  institution: m.nationalCommissionerOfPolice,
  translationNamespaces: [
    ApplicationConfigurations.AdditionalDrivingLicense.translation,
  ],
  dataSchema,
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
                  '../forms/prerequisitesForm/getForm'
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
                JurisdictionApi,
                CurrentLicenseApi.configure({
                  params: {
                    useLegacyVersion: true,
                    validCategories: ['B'],
                  },
                }),
                DrivingAssessmentApi,
                QualityPhotoApi,
                QualityPhotoAndSignatureApi,
                AllPhotosFromThjodskraApi,
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
          name: 'Main form',
          progress: 0.4,
          status: FormModes.DRAFT,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/mainForm').then((module) =>
                  Promise.resolve(module.mainForm),
                ),
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
              delete: true,
            },
          ],
        },
      },
      [States.DECLINED]: {
        meta: {
          name: 'Declined',
          status: FormModes.REJECTED,
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/declinedForm').then((module) =>
                  Promise.resolve(module.declinedForm),
                ),
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
    if (nationalId === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default template
