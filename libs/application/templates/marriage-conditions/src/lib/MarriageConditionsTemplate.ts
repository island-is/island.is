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
} from '@island.is/application/types'
import { assign } from 'xstate'
import { getSpouseNationalId } from './utils'
import { FeatureFlagClient } from '@island.is/feature-flags'
import {
  getApplicationFeatureFlags,
  MarriageCondtionsFeatureFlags,
} from './getApplicationFeatureFlags'
import { MaritalStatusApi, ReligionCodesApi } from '../dataProviders'
import { coreHistoryMessages } from '@island.is/application/core'
import { buildPaymentState } from '@island.is/application/utils'

const pruneAfter = (time: number) => {
  return {
    shouldBeListed: true,
    shouldBePruned: true,
    whenToPrune: time,
  }
}

const MarriageConditionsTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.MARRIAGE_CONDITIONS,
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
                        featureFlags[MarriageCondtionsFeatureFlags.ALLOW_FAKE],
                    }),
                  ),
                )
              },
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
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
              ],
              delete: true,
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
        chargeItemCodes: ['AY129'],
        submitTarget: States.SPOUSE_CONFIRM,
      }),
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
                        featureFlags[MarriageCondtionsFeatureFlags.ALLOW_FAKE],
                    }),
                  ),
                )
              },
              actions: [
                { event: DefaultEvents.SUBMIT, name: '', type: 'primary' },
              ],
              write: 'all',
              api: [
                NationalRegistryUserApi,
                UserProfileApi,
                DistrictsApi,
                MaritalStatusApi,
                ReligionCodesApi,
              ],
            },
          ],
          actionCard: {
            historyLogs: [
              {
                logMessage: m.confirmedBySpouse2,
                onEvent: DefaultEvents.SUBMIT,
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
          [DefaultEvents.SUBMIT]: { target: States.DONE },
        },
      },
      [States.DONE]: {
        meta: {
          name: 'Done',
          status: 'completed',
          progress: 1,
          lifecycle: pruneAfter(sixtyDays),
          onEntry: defineTemplateApi({
            action: ApiActions.submitApplication,
            shouldPersistToExternalData: true,
            throwOnError: true,
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
        const spouse: string = getSpouseNationalId(context.application.answers)

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
