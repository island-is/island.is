import { Events, States, Roles, twoDays, sixtyDays } from './constants'
import { dataSchema } from './dataSchema'
import { m } from '../lib/messages'
import { ApiActions } from './constants'
import {
  ApplicationTemplate,
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTypes,
  ApplicationRole,
  Application,
  DefaultEvents,
  defineTemplateApi,
  NationalRegistryUserApi,
  UserProfileApi,
  DistrictsApi,
  InstitutionNationalIds,
  ApplicationConfigurations,
} from '@island.is/application/types'
import { assign } from 'xstate'
import { FeatureFlagClient } from '@island.is/feature-flags'
import {
  getApplicationFeatureFlags,
  MarriageConditionsFeatureFlags,
} from './getApplicationFeatureFlags'
import {
  BirthCertificateApi,
  DistrictCommissionersPaymentCatalogApi,
  MockableDistrictCommissionersPaymentCatalogApi,
  MaritalStatusApi,
  ReligionCodesApi,
} from '../dataProviders'
import {
  coreHistoryMessages,
  getValueViaPath,
} from '@island.is/application/core'
import { buildPaymentState } from '@island.is/application/utils'
import { PaymentForm } from '@island.is/application/ui-forms'
import { CodeOwners } from '@island.is/shared/constants'

const pruneAfter = (time: number) => {
  return {
    shouldBeListed: true,
    shouldBePruned: true,
    whenToPrune: time,
  }
}

const configuration =
  ApplicationConfigurations[ApplicationTypes.MARRIAGE_CONDITIONS]

const MarriageConditionsTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.MARRIAGE_CONDITIONS,
  name: m.applicationTitle,
  codeOwner: CodeOwners.Juni,
  dataSchema: dataSchema,
  translationNamespaces: [configuration.translation],
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Draft',
          status: 'draft',
          progress: 0.33,
          lifecycle: pruneAfter(twoDays),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: async ({ featureFlagClient }) => {
                const featureFlags = await getApplicationFeatureFlags(
                  featureFlagClient as FeatureFlagClient,
                )
                return import('../forms/application').then((val) =>
                  Promise.resolve(
                    val.getApplication({
                      allowFakeData:
                        featureFlags[MarriageConditionsFeatureFlags.ALLOW_FAKE],
                    }),
                  ),
                )
              },
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: '',
                  type: 'primary',
                },
              ],
              write: 'all',
              api: [
                NationalRegistryUserApi,
                UserProfileApi,
                DistrictsApi,
                MaritalStatusApi,
                ReligionCodesApi,
                DistrictCommissionersPaymentCatalogApi,
                BirthCertificateApi,
                MockableDistrictCommissionersPaymentCatalogApi,
              ],
              delete: true,
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
          [DefaultEvents.SUBMIT]: { target: States.SPOUSE_CONFIRM },
        },
      },
      [States.SPOUSE_CONFIRM]: {
        entry: 'assignToSpouse',
        meta: {
          name: 'Done',
          status: 'inprogress',
          progress: 1,
          lifecycle: pruneAfter(sixtyDays),
          onEntry: defineTemplateApi({
            action: ApiActions.assignSpouse,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/done').then((val) =>
                  Promise.resolve(val.done),
                ),
              read: 'all',
            },
            {
              id: Roles.ASSIGNED_SPOUSE,
              formLoader: async ({ featureFlagClient }) => {
                const featureFlags = await getApplicationFeatureFlags(
                  featureFlagClient as FeatureFlagClient,
                )
                return import('../forms/spouseConfirmation').then((val) =>
                  Promise.resolve(
                    val.spouseConfirmation({
                      allowFakeData:
                        featureFlags[MarriageConditionsFeatureFlags.ALLOW_FAKE],
                    }),
                  ),
                )
              },
              actions: [
                { event: DefaultEvents.PAYMENT, name: '', type: 'primary' },
              ],
              write: 'all',
              api: [
                NationalRegistryUserApi,
                UserProfileApi,
                DistrictsApi,
                MaritalStatusApi,
                ReligionCodesApi,
                DistrictCommissionersPaymentCatalogApi,
                BirthCertificateApi,
                MockableDistrictCommissionersPaymentCatalogApi,
              ],
            },
          ],
          actionCard: {
            historyLogs: [
              {
                logMessage: m.confirmedBySpouse2,
                onEvent: DefaultEvents.PAYMENT,
                includeSubjectAndActor: true,
              },
            ],
            pendingAction: {
              title: m.waitingForConfirmationSpouse2Title,
              content: m.waitingForConfirmationSpouse2Description,
              displayStatus: 'warning',
            },
          },
        },
        on: {
          [DefaultEvents.PAYMENT]: { target: States.PAYMENT },
        },
      },
      [States.PAYMENT]: buildPaymentState({
        organizationId: InstitutionNationalIds.SYSLUMENN,
        roles: [
          {
            id: Roles.ASSIGNED_SPOUSE,
            formLoader: async () => {
              return PaymentForm
            },
          },
        ],
        chargeItems: (application) => {
          const paymentCodes = []
          paymentCodes.push(
            getValueViaPath<boolean>(
              application.answers,
              'applicant.hasBirthCertificate',
            )
              ? { code: 'AY171', quantity: 1 }
              : [],
          )
          paymentCodes.push(
            getValueViaPath<boolean>(
              application.externalData,
              'birthCertificate.data.hasBirthCertificate',
            )
              ? { code: 'AY171', quantity: 1 }
              : [],
          )
          paymentCodes.push({ code: 'AY128', quantity: 1 }) // Survey
          paymentCodes.push({ code: 'AY172', quantity: 2 }) // Marital status

          return paymentCodes.flat()
        },
        submitTarget: States.DONE,
      }),
      [States.DONE]: {
        meta: {
          name: 'Done',
          status: 'completed',
          progress: 1,
          lifecycle: pruneAfter(sixtyDays),
          onEntry: defineTemplateApi({
            action: ApiActions.submitApplication,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/done').then((val) =>
                  Promise.resolve(val.done),
                ),
              read: 'all',
            },
            {
              id: Roles.ASSIGNED_SPOUSE,
              formLoader: () =>
                import('../forms/spouseDone').then((val) =>
                  Promise.resolve(val.spouseDone),
                ),
              read: {
                answers: ['spouse'],
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
  stateMachineOptions: {
    actions: {
      assignToSpouse: assign((context) => {
        const spouse = getValueViaPath(
          context.application.answers,
          'spouse.person.nationalId',
        ) as string

        return {
          ...context,
          application: {
            ...context.application,
            assignees: spouse ? [spouse] : [],
          },
        }
      }),
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (
      application.assignees.includes(nationalId) &&
      nationalId !== application.applicant
    ) {
      return Roles.ASSIGNED_SPOUSE
    }
    if (nationalId === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default MarriageConditionsTemplate
