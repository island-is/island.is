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
import { PaymentForm } from '@island.is/application/ui-forms'
import { m } from './messages'
import { estateSchema } from './dataSchema'
import {
  ApiActions,
  EstateEvent,
  EstateTypes,
  Roles,
  SPOUSE,
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
import { EstateExternalData } from '../types'

const configuration = ApplicationConfigurations[ApplicationTypes.ESTATE]

const haveAllSignatoriesSigned = (context: ApplicationContext) => {
  const externalData = context.application.externalData as EstateExternalData
  const signatoriesResult = externalData?.getSignatories?.data
  // Only allow completion once the signatory list has been fetched
  // successfully. A successful fetch with no signatories (estate types that
  // require no co-signing at syslumenn, e.g. official division / no assets)
  // is a valid completion case — every() is vacuously true — so those
  // applications don't get stuck in signing until they are pruned. A failed
  // fetch (success falsy) keeps the application in signing so it retries.
  if (!signatoriesResult?.success) {
    return false
  }
  return (signatoriesResult.signatories ?? []).every((s) => s.signed)
}

const submitApplicationAndFetchSignatories = [
  defineTemplateApi({
    action: ApiActions.completeApplication,
    throwOnError: true,
    triggerEvent: DefaultEvents.SUBMIT,
    order: 0,
  }),
  defineTemplateApi({
    action: ApiActions.sendApplicationCopyToParties,
    shouldPersistToExternalData: true,
    externalDataId: 'sendApplicationCopyToParties',
    throwOnError: false,
    triggerEvent: DefaultEvents.SUBMIT,
    order: 1,
  }),
  defineTemplateApi({
    action: ApiActions.getSignatories,
    shouldPersistToExternalData: true,
    externalDataId: 'getSignatories',
    throwOnError: false,
    triggerEvent: DefaultEvents.SUBMIT,
    order: 2,
  }),
]

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
          // Submit before resolving the SUBMIT target so cases with no
          // required signatories skip the signing/status state entirely.
          onExit: submitApplicationAndFetchSignatories,
        },
        on: {
          [DefaultEvents.SUBMIT]: [
            {
              target: States.done,
              cond: haveAllSignatoriesSigned,
            },
            { target: States.signing },
          ],
          [DefaultEvents.PAYMENT]: {
            target: States.payment,
          },
        },
      },
      [States.payment]: buildPaymentState<EstateEvent>({
        organizationId: InstitutionNationalIds.SYSLUMENN,
        chargeItems: getChargeItems,
        // mapUserToRole never returns the default 'applicant' role once an
        // estate type has been selected, so the payment state needs explicit
        // roles for the estate-specific applicant roles.
        roles: [
          Roles.APPLICANT_PERMIT_FOR_UNDIVIDED_ESTATE,
          Roles.APPLICANT_DIVISION_OF_ESTATE_BY_HEIRS,
        ].map((roleId) => ({
          id: roleId,
          formLoader: async () => PaymentForm,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: 'Panta',
              type: 'primary' as const,
            },
            {
              event: DefaultEvents.ABORT,
              name: 'Hætta við',
              type: 'primary' as const,
            },
          ],
          write: 'all' as const,
          delete: true,
        })),
        onExit: submitApplicationAndFetchSignatories,
        submitTarget: [
          {
            target: States.done,
            cond: haveAllSignatoriesSigned,
          },
          { target: States.signing },
        ],
        abortTarget: States.draft,
        lifecycle: {
          shouldBeListed: true,
          shouldBePruned: true,
          whenToPrune: 60 * 24 * 3600 * 1000, // 60 days
          shouldDeleteChargeIfPaymentFulfilled: true,
        },
        payerNationalId: (application) => {
          const selectedEstate = getValueViaPath<string>(
            application.answers,
            'selectedEstate',
          )

          if (selectedEstate === EstateTypes.permitForUndividedEstate) {
            const members = getValueViaPath<
              Array<{ enabled: boolean; relation: string; nationalId: string }>
            >(application.answers, 'estate.estateMembers')
            const spouse = members?.find(
              (member) => member.enabled && member.relation === SPOUSE,
            )
            if (spouse?.nationalId) {
              return spouse.nationalId
            }
          }

          const data = getEstateDataFromApplication(application)
          if (isEstateInfo(data) && data.estate.nationalIdOfDeceased) {
            return data.estate.nationalIdOfDeceased
          }
          return application.applicant
        },
      }),
      [States.signing]: {
        meta: {
          name: 'Signing',
          status: 'inprogress',
          progress: 0.85,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 90 * 24 * 3600 * 1000, // 90 days
          },
          actionCard: {
            pendingAction: (application) => {
              const externalData =
                application.externalData as EstateExternalData
              const signatoriesResult = externalData?.getSignatories?.data
              const signatories = signatoriesResult?.signatories ?? []

              // Signatory list not yet fetched successfully (submission still
              // processing or a transient syslumenn failure): show a pending
              // "still working" state rather than a misleading confirmation.
              if (!signatoriesResult?.success) {
                return {
                  title: m.signingPendingTitle,
                  content: m.signingPendingDescription,
                  displayStatus: 'info',
                }
              }

              // Fetched successfully with no signatories for this case/type:
              // nothing to sign at syslumenn, show a neutral confirmation.
              if (signatories.length === 0) {
                return {
                  title: m.applicationSubmittedTitle,
                  content: m.applicationSubmittedDescription,
                  displayStatus: 'info',
                }
              }

              const allSigned = signatories.every((s) => s.signed)

              if (allSigned) {
                return {
                  title: m.signingCompleteTitle,
                  content: m.signingCompleteDescription,
                  displayStatus: 'success',
                }
              }

              return {
                title: m.signingPendingTitle,
                content: m.signingPendingDescription,
                displayStatus: 'info',
              }
            },
          },
          roles: [
            Roles.APPLICANT_NO_ASSETS,
            Roles.APPLICANT_OFFICIAL_DIVISION,
            Roles.APPLICANT_PERMIT_FOR_UNDIVIDED_ESTATE,
            Roles.APPLICANT_DIVISION_OF_ESTATE_BY_HEIRS,
          ].map((roleId) => ({
            id: roleId,
            formLoader: () =>
              import('../forms/Signing').then((val) =>
                Promise.resolve(val.signingForm),
              ),
            actions: [{ event: 'SUBMIT', name: '', type: 'primary' as const }],
            read: 'all' as const,
            write: {
              externalData: ['getSignatories'],
            },
            api: [
              defineTemplateApi({
                action: ApiActions.getSignatories,
                shouldPersistToExternalData: true,
                externalDataId: 'getSignatories',
                throwOnError: false,
              }),
            ],
          })),
        },
        on: {
          // Finalize the application only once all parties have signed at
          // syslumenn. The signing form only surfaces the finish button when
          // this condition is met (see the form), so this acts as an
          // auto-completion on the applicant's next visit/refresh.
          [DefaultEvents.SUBMIT]: {
            target: States.done,
            cond: haveAllSignatoriesSigned,
          },
        },
      },
      [States.done]: {
        meta: {
          name: 'Approved',
          status: 'completed',
          progress: 1,
          lifecycle: pruneAfterDays(60),
          roles: [
            Roles.APPLICANT_NO_ASSETS,
            Roles.APPLICANT_OFFICIAL_DIVISION,
            Roles.APPLICANT_PERMIT_FOR_UNDIVIDED_ESTATE,
            Roles.APPLICANT_DIVISION_OF_ESTATE_BY_HEIRS,
          ].map((roleId) => ({
            id: roleId,
            formLoader: () =>
              import('../forms/Done').then((val) => Promise.resolve(val.done)),
            read: 'all' as const,
          })),
        },
      },
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    const { applicant } = application

    if (applicant === nationalId) {
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

    return undefined
  },
}

export default EstateTemplate
