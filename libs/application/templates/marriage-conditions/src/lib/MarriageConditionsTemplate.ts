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
} from '@island.is/application/types'
import { assign } from 'xstate'
import { Features } from '@island.is/feature-flags'
import { getSpouseNationalId } from './utils'
import { FeatureFlagClient } from '@island.is/feature-flags'
import {
  getApplicationFeatureFlags,
  MarriageCondtionsFeatureFlags,
} from './getApplicationFeatureFlags'

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
  readyForProduction: true,
  featureFlag: Features.marriageConditions,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Draft',
          status: 'draft',
          actionCard: {
            title: m.applicationTitle,
          },
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
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.PAYMENT]: { target: States.PAYMENT },
        },
      },
      [States.PAYMENT]: {
        meta: {
          name: 'Payment state',
          status: 'inprogress',
          progress: 0.9,
          lifecycle: pruneAfter(sixtyDays),
          onEntry: {
            apiModuleAction: ApiActions.createCharge,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/payment').then((val) =>
                  Promise.resolve(val.getPayment()),
                ),
              actions: [
                { event: DefaultEvents.ASSIGN, name: '', type: 'primary' },
                {
                  event: DefaultEvents.ABORT,
                  name: 'Hætta við',
                  type: 'reject',
                },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.ASSIGN]: { target: States.SPOUSE_CONFIRM },
        },
      },
      [States.SPOUSE_CONFIRM]: {
        entry: 'assignToSpouse',
        meta: {
          name: 'Done',
          status: 'inprogress',
          progress: 1,
          lifecycle: pruneAfter(sixtyDays),
          onEntry: {
            apiModuleAction: ApiActions.assignSpouse,
          },
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
            },
          ],
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
          actionCard: {
            tag: {
              label: m.actionCardDoneTag,
            },
          },
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
