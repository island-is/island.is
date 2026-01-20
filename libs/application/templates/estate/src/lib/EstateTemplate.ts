import {
  coreHistoryMessages,
  getValueViaPath,
  pruneAfterDays,
} from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  defineTemplateApi,
  NationalRegistryV3UserApi,
  UserProfileApi,
  DefaultEvents,
  ApplicationConfigurations,
  InstitutionNationalIds,
} from '@island.is/application/types'
import { buildPaymentState } from '@island.is/application/utils'
import { m } from './messages'
import { estateSchema } from './dataSchema'
import {
  ApiActions,
  EstateEvent,
  EstateTypes,
  Roles,
  States,
} from './constants'
import { FeatureFlagClient } from '@island.is/feature-flags'
import {
  EstateApi,
  EstateOnEntryApi,
  SyslumadurPaymentCatalogApi,
  MockableSyslumadurPaymentCatalogApi,
} from '../dataProviders'
import {
  getApplicationFeatureFlags,
  EstateFeatureFlags,
} from './getApplicationFeatureFlags'
import { CodeOwners } from '@island.is/shared/constants'
import { getChargeItems } from '../utils/getChargeItems'
import { getEstateDataFromApplication, isEstateInfo } from './utils'

const configuration = ApplicationConfigurations[ApplicationTypes.ESTATE]

const EstateTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<EstateEvent>,
  EstateEvent
> = {
  type: ApplicationTypes.ESTATE,
  name: ({ answers }) =>
    answers.selectedEstate
      ? m.prerequisitesTitle.defaultMessage + ' - ' + answers.selectedEstate
      : m.prerequisitesTitle.defaultMessage,

  codeOwner: CodeOwners.Juni,
  institution: m.institution,
  dataSchema: estateSchema,
  translationNamespaces: [configuration.translation],
  allowMultipleApplicationsInDraft: true,
  stateMachineConfig: {
    initial: States.prerequisites,
    states: {
      [States.prerequisites]: {
        meta: {
          name: '',
          status: 'draft',
          progress: 0,
          lifecycle: pruneAfterDays(60),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: async ({ featureFlagClient }) => {
                const featureFlags = await getApplicationFeatureFlags(
                  featureFlagClient as FeatureFlagClient,
                )

                const getForm = await import('../forms/Prerequisites').then(
                  (val) => val.getForm,
                )

                return getForm({
                  allowDivisionOfEstate:
                    featureFlags[EstateFeatureFlags.ALLOW_DIVISION_OF_ESTATE],
                  allowEstateWithoutAssets:
                    featureFlags[
                      EstateFeatureFlags.ALLOW_ESTATE_WITHOUT_ASSETS
                    ],
                  allowPermitToPostponeEstateDivision:
                    featureFlags[
                      EstateFeatureFlags
                        .ALLOW_PERMIT_TO_POSTPONE_ESTATE_DIVISION
                    ],
                  allowDivisionOfEstateByHeirs:
                    featureFlags[
                      EstateFeatureFlags.ALLOW_DIVISION_OF_ESTATE_BY_HEIRS
                    ],
                  allowEstatePayment:
                    featureFlags[EstateFeatureFlags.ALLOW_ESTATE_PAYMENT],
                })
              },
              actions: [{ event: 'SUBMIT', name: '', type: 'primary' }],
              write: 'all',
              delete: true,
              api: [
                EstateOnEntryApi,
                SyslumadurPaymentCatalogApi,
                MockableSyslumadurPaymentCatalogApi,
              ],
            },
          ],
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationStarted,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.draft,
          },
        },
      },
      [States.draft]: {
        meta: {
          name: '',
          status: 'draft',
          progress: 0.25,
          lifecycle: pruneAfterDays(60),
          roles: [
            {
              id: Roles.APPLICANT_NO_ASSETS,
              formLoader: () =>
                import('../forms/Forms').then((module) =>
                  Promise.resolve(module.estateWithoutAssetsForm),
                ),
              actions: [{ event: 'SUBMIT', name: '', type: 'primary' }],
              write: 'all',
              delete: true,
              api: [NationalRegistryV3UserApi, UserProfileApi, EstateApi],
            },
            {
              id: Roles.APPLICANT_OFFICIAL_DIVISION,
              formLoader: () =>
                import('../forms/Forms').then((module) =>
                  Promise.resolve(module.officialDivisionForm),
                ),
              actions: [{ event: 'SUBMIT', name: '', type: 'primary' }],
              write: 'all',
              delete: true,
              api: [NationalRegistryV3UserApi, UserProfileApi, EstateApi],
            },
            {
              id: Roles.APPLICANT_PERMIT_FOR_UNDIVIDED_ESTATE,
              formLoader: () =>
                import('../forms/Forms').then((module) =>
                  Promise.resolve(module.undividedEstateForm),
                ),
              actions: [
                { event: 'SUBMIT', name: '', type: 'primary' },
                { event: 'PAYMENT', name: '', type: 'primary' },
              ],
              write: 'all',
              delete: true,
              api: [
                NationalRegistryV3UserApi,
                UserProfileApi,
                EstateApi,
                SyslumadurPaymentCatalogApi,
                MockableSyslumadurPaymentCatalogApi,
              ],
            },
            {
              id: Roles.APPLICANT_DIVISION_OF_ESTATE_BY_HEIRS,
              formLoader: () =>
                import('../forms/Forms').then((module) =>
                  Promise.resolve(module.privateDivisionForm),
                ),
              actions: [
                { event: 'SUBMIT', name: '', type: 'primary' },
                { event: 'PAYMENT', name: '', type: 'primary' },
              ],
              write: 'all',
              delete: true,
              api: [
                NationalRegistryV3UserApi,
                UserProfileApi,
                EstateApi,
                SyslumadurPaymentCatalogApi,
                MockableSyslumadurPaymentCatalogApi,
              ],
            },
          ],
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationReceived,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.done,
          },
          [DefaultEvents.PAYMENT]: {
            target: States.payment,
          },
        },
      },
      [States.payment]: buildPaymentState({
        organizationId: InstitutionNationalIds.SYSLUMENN,
        chargeItems: getChargeItems,
        submitTarget: States.done,
        abortTarget: States.draft,
        lifecycle: {
          shouldBeListed: true,
          shouldBePruned: true,
          whenToPrune: 60 * 24 * 3600 * 1000, // 60 days
          shouldDeleteChargeIfPaymentFulfilled: true,
        },
        payerNationalId: (application) => {
          const data = getEstateDataFromApplication(application)
          if (isEstateInfo(data) && data.estate.nationalIdOfDeceased) {
            return data.estate.nationalIdOfDeceased
          }
          return application.applicant
        },
      }),
      [States.done]: {
        meta: {
          name: 'Approved',
          status: 'completed',
          progress: 1,
          lifecycle: pruneAfterDays(60),
          onEntry: defineTemplateApi({
            action: ApiActions.completeApplication,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT_NO_ASSETS,
              formLoader: () =>
                import('../forms/Done').then((val) =>
                  Promise.resolve(val.done),
                ),
              read: 'all',
            },
            {
              id: Roles.APPLICANT_OFFICIAL_DIVISION,
              formLoader: () =>
                import('../forms/Done').then((val) =>
                  Promise.resolve(val.done),
                ),
              read: 'all',
            },
            {
              id: Roles.APPLICANT_PERMIT_FOR_UNDIVIDED_ESTATE,
              formLoader: () =>
                import('../forms/Done').then((val) =>
                  Promise.resolve(val.done),
                ),
              read: 'all',
            },
            {
              id: Roles.APPLICANT_DIVISION_OF_ESTATE_BY_HEIRS,
              formLoader: () =>
                import('../forms/Done').then((val) =>
                  Promise.resolve(val.done),
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
    if (application.applicant === nationalId) {
      const selectedEstate = getValueViaPath<string>(
        application.answers,
        'selectedEstate',
      )
      if (selectedEstate === EstateTypes.officialDivision) {
        return Roles.APPLICANT_OFFICIAL_DIVISION
      } else if (selectedEstate === EstateTypes.estateWithoutAssets) {
        return Roles.APPLICANT_NO_ASSETS
      } else if (selectedEstate === EstateTypes.permitForUndividedEstate) {
        return Roles.APPLICANT_PERMIT_FOR_UNDIVIDED_ESTATE
      } else if (selectedEstate === EstateTypes.divisionOfEstateByHeirs) {
        return Roles.APPLICANT_DIVISION_OF_ESTATE_BY_HEIRS
      } else return Roles.APPLICANT
    }
  },
}

export default EstateTemplate
