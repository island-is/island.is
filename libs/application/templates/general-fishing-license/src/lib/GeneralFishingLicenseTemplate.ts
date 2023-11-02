import {
  Application,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  defineTemplateApi,
  InstitutionNationalIds,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import { Events, States, Roles } from '../constants'
import { GeneralFishingLicenseSchema } from './dataSchema'
import { application } from './messages'
import { ApiActions } from '../shared'
import { AuthDelegationType } from '@island.is/shared/types'
import {
  DepartmentOfFisheriesPaymentCatalogApi,
  ShipRegistryApi,
  IdentityApi,
} from '../dataProviders'
import {
  coreHistoryMessages,
  DefaultStateLifeCycle,
  getValueViaPath,
} from '@island.is/application/core'
import { gflPendingActionMessages } from './messages/actionCards'
import { Features } from '@island.is/feature-flags'
import { buildPaymentState } from '@island.is/application/utils'
import { GeneralFishingLicenseAnswers } from '..'
import { ChargeItemCode } from '@island.is/shared/constants'

const pruneAtMidnight = () => {
  const date = new Date()
  const utcDate = new Date(date.toUTCString()) // In case user is not on GMT
  const midnightDate = new Date(date.toUTCString())
  midnightDate.setHours(23, 59, 59)
  const timeToPrune = midnightDate.getTime() - utcDate.getTime()
  return {
    shouldBeListed: true,
    shouldBePruned: true,
    whenToPrune: timeToPrune,
  }
}

const getCodes = (application: Application) => {
  const answers = application.answers as GeneralFishingLicenseAnswers
  const chargeItemCode = getValueViaPath(
    answers,
    'fishingLicense.chargeType',
  ) as string

  if (!chargeItemCode) {
    throw new Error('Vörunúmer fyrir FJS vantar.')
  }

  // If strandveiðileyfi, then we set the const to "Sérstakt gjald vegna strandleyfa", otherwise null.
  const strandveidileyfi =
    chargeItemCode === ChargeItemCode.GENERAL_FISHING_LICENSE_COASTAL
      ? ChargeItemCode.GENERAL_FISHING_LICENSE_SPECIAL_COASTAL
      : false

  return strandveidileyfi
    ? [chargeItemCode, strandveidileyfi]
    : [chargeItemCode]
}

const GeneralFishingLicenseTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.GENERAL_FISHING_LICENSE,
  name: application.general.name,
  institution: application.general.institutionName,
  translationNamespaces: [
    ApplicationConfigurations.GeneralFishingLicense.translation,
  ],
  dataSchema: GeneralFishingLicenseSchema,
  allowedDelegations: [
    { type: AuthDelegationType.ProcurationHolder },
    {
      type: AuthDelegationType.Custom,
      featureFlag: Features.isFishingLicenceCustomDelegationEnabled,
    },
  ],
  requiredScopes: ['@island.is/fishing-license'],
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: application.general.name.defaultMessage,
          status: 'draft',
          progress: 0.1,
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            whenToPrune: 600 * 1000, // 10 minutes
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: async () =>
                await import(
                  '../forms/GeneralFishingLicensePrerequisitesForm/index'
                ).then((val) =>
                  Promise.resolve(val.GeneralFishingLicensePrerequisitesForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              api: [
                NationalRegistryUserApi,
                DepartmentOfFisheriesPaymentCatalogApi,
                ShipRegistryApi,
                IdentityApi,
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DRAFT },
        },
      },
      [States.DRAFT]: {
        meta: {
          name: application.general.name.defaultMessage,
          status: 'draft',
          progress: 0.3,
          lifecycle: pruneAtMidnight(),
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.paymentStarted,
                onEvent: DefaultEvents.PAYMENT,
              },
            ],
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: async () =>
                await import('../forms/GeneralFishingLicenseForm/index').then(
                  (val) => Promise.resolve(val.GeneralFishingLicenseForm),
                ),
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: 'Staðfesta',
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
          [DefaultEvents.PAYMENT]: { target: States.PAYMENT },
          [DefaultEvents.REJECT]: {
            target: States.DECLINED,
          },
        },
      },
      [States.PAYMENT]: buildPaymentState({
        organizationId: InstitutionNationalIds.FISKISTOFA,
        chargeItemCodes: getCodes,
        submitTarget: States.SUBMITTED,
      }),
      [States.SUBMITTED]: {
        meta: {
          name: application.general.name.defaultMessage,
          status: 'completed',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            pendingAction: {
              title: gflPendingActionMessages.applicationrReceivedTitle,
              content: gflPendingActionMessages.applicationrReceivedContent,
              displayStatus: 'success',
            },
          },
          onEntry: defineTemplateApi({
            action: ApiActions.submitApplication,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/GeneralFishingLicenseSubmittedForm').then(
                  (val) =>
                    Promise.resolve(val.GeneralFishingLicenseSubmittedForm),
                ),
            },
          ],
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
                import('../forms/GeneralFishingLicenseDeclinedForm').then(
                  (val) => val.GeneralFishingLicenseDeclinedForm,
                ),
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

export default GeneralFishingLicenseTemplate
