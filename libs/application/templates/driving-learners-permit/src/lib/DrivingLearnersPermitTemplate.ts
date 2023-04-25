import { EphemeralStateLifeCycle } from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  CurrentLicenseApi,
  defineTemplateApi,
  DefaultEvents,
} from '@island.is/application/types'
import { FeatureFlagClient, Features } from '@island.is/feature-flags'
import { DrivingLearnersPermitTemplateEvent, Roles, States } from './constants'
import { ApiActions, FakeDataFeature } from '../shared/constants'
import { m } from './messages'
import { dataSchema } from './dataSchema'
import { truthyFeatureFromClient } from '../shared/utils'

const DrivingLearnersPermitTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<DrivingLearnersPermitTemplateEvent>,
  DrivingLearnersPermitTemplateEvent
> = {
  type: ApplicationTypes.DRIVING_LEARNERS_PERMIT,
  name: m.name,
  institution: m.institutionName,
  dataSchema: dataSchema,
  featureFlag: Features.drivingLearnersPermit,
  readyForProduction: true,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          status: 'draft',
          name: 'Prerequisites',
          progress: 0.33,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: async ({ featureFlagClient }) => {
                const getForm = await import('../forms/form').then(
                  (val) => val.getForm,
                )

                const allowFakeData = await truthyFeatureFromClient(
                  featureFlagClient as FeatureFlagClient,
                  FakeDataFeature.allowFake,
                )

                return getForm({
                  allowFakeData,
                })
              },
              api: [CurrentLicenseApi],
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          SUBMIT: {
            target: States.APPROVED,
          },
        },
      },
      [States.APPROVED]: {
        meta: {
          onEntry: defineTemplateApi({
            action: ApiActions.completeApplication,
            shouldPersistToExternalData: true,
          }),
          status: 'approved',
          name: 'Approved',
          progress: 1,
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            whenToPrune: 31 * 24 * 3600 * 1000,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/done').then((module) =>
                  Promise.resolve(module.Done),
                ),
              write: 'all',
              delete: true,
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
      return Roles.APPLICANT
    }
  },
}

export default DrivingLearnersPermitTemplate
