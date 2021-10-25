import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  DefaultStateLifeCycle,
  DefaultEvents,
} from '@island.is/application/core'
import { ApiActions } from '../shared'
import { Events, States } from './constants'
import { dataSchema } from './dataSchema'
import { m } from './messages'
import { FeatureFlagClient } from '@island.is/feature-flags'

type DrivingLicenseFeatureFlags =
  | 'applicationTemplateDrivingLicenseAllowFakeData'
  | 'applicationTemplateDrivingLicenseAllowLicenseSelection'

const getClientSideFeatureFlags = async (
  client: FeatureFlagClient,
): Promise<Record<DrivingLicenseFeatureFlags, boolean>> => {
  const featureFlags: DrivingLicenseFeatureFlags[] = [
    'applicationTemplateDrivingLicenseAllowLicenseSelection',
    'applicationTemplateDrivingLicenseAllowFakeData',
  ]

  return (
    await Promise.all(
      featureFlags.map(async (key: DrivingLicenseFeatureFlags) => {
        return { key, value: !!(await client.getValue(key, false)) }
      }),
    )
  ).reduce(
    (
      acc,
      { key, value }: { key: DrivingLicenseFeatureFlags; value: boolean },
    ) => {
      return {
        ...acc,
        [key]: value,
      }
    },
    {} as Record<DrivingLicenseFeatureFlags, boolean>,
  )
}

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.DRIVING_LICENSE,
  name: m.applicationForDrivingLicense,
  institution: m.nationalCommissionerOfPolice,
  dataSchema,
  readyForProduction: true,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: m.applicationForDrivingLicense.defaultMessage,
          actionCard: {
            description: m.actionCardDraft,
          },
          progress: 0.33,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: 'applicant',
              formLoader: async ({ featureFlagClient }) => {
                const featureFlags = await getClientSideFeatureFlags(
                  featureFlagClient,
                )

                const getApplication = await import(
                  '../forms/application'
                ).then((val) => val.getApplication)

                return getApplication(
                  featureFlags.applicationTemplateDrivingLicenseAllowFakeData,
                  featureFlags.applicationTemplateDrivingLicenseAllowLicenseSelection,
                )
              },
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: m.continue,
                  type: 'primary',
                },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.PAYMENT]: { target: States.PAYMENT },
          [DefaultEvents.REJECT]: { target: States.DECLINED },
        },
      },
      [States.PAYMENT]: {
        meta: {
          name: 'Payment state',
          actionCard: {
            description: m.actionCardPayment,
          },
          progress: 0.9,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: ApiActions.createCharge,
          },
          onExit: {
            apiModuleAction: ApiActions.submitApplication,
          },
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/payment').then((val) => val.payment),
              actions: [
                { event: DefaultEvents.SUBMIT, name: 'Panta', type: 'primary' },
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
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: 'applicant',
              formLoader: () => import('../forms/done').then((val) => val.done),
              read: 'all',
            },
          ],
        },
        type: 'final' as const,
      },
      [States.DECLINED]: {
        meta: {
          name: 'Declined',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/declined').then((val) => val.declined),
              read: 'all',
            },
          ],
        },
        type: 'final' as const,
      },
    },
  },
  mapUserToRole(): ApplicationRole {
    return 'applicant'
  },
}

export default template
