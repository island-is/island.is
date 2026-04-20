import {
  ApplicationTemplate,
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTypes,
  ApplicationRole,
  Application,
  DefaultEvents,
  defineTemplateApi,
  HasTeachingRightsApi,
  NationalRegistryUserApi,
  GetTeacherRightsApi,
  ApplicationConfigurations,
} from '@island.is/application/types'
import { Events, States, Roles } from './constants'
import { dataSchema } from './dataSchema'
import { m } from './messages'
import { ApiActions } from './constants'
import {
  DrivingLicenseFeatureFlags,
  getApplicationFeatureFlags,
} from './getApplicationFeatureFlags'
import { FeatureFlagClient } from '@island.is/feature-flags'
import { CodeOwners } from '@island.is/shared/constants'

const configuration =
  ApplicationConfigurations[ApplicationTypes.DRIVING_INSTRUCTOR_REGISTRATIONS]

const InstructorRegistrationsTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.DRIVING_INSTRUCTOR_REGISTRATIONS,
  name: m.applicationTitle,
  codeOwner: CodeOwners.Juni,
  dataSchema: dataSchema,
  translationNamespaces: [configuration.translation],
  stateMachineConfig: {
    initial: States.REGISTRY,
    states: {
      [States.REGISTRY]: {
        meta: {
          name: 'Registrations',
          actionCard: {
            title: m.applicationTitle,
          },
          status: 'inprogress',
          progress: 0.33,
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            whenToPrune: 24 * 3600 * 1000,
          },
          onExit: defineTemplateApi({
            action: ApiActions.submitApplication,
            shouldPersistToExternalData: true,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.INSTRUCTOR,
              formLoader: async ({ featureFlagClient }) => {
                const featureFlags = await getApplicationFeatureFlags(
                  featureFlagClient as FeatureFlagClient,
                )
                const getForm = await import(
                  '../forms/instructorRegistrations'
                ).then((val) => val.getInstructorRegistrations)

                return getForm(
                  featureFlags[DrivingLicenseFeatureFlags.ALLOW_BE_LICENSE],
                )
              },
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              api: [
                HasTeachingRightsApi,
                NationalRegistryUserApi,
                GetTeacherRightsApi,
              ],
              delete: true,
              write: {
                answers: ['approveExternalData'],
                externalData: [
                  HasTeachingRightsApi.externalDataId,
                  NationalRegistryUserApi.externalDataId,
                  GetTeacherRightsApi.externalDataId,
                ],
              },
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
      return Roles.INSTRUCTOR
    }
  },
}

export default InstructorRegistrationsTemplate
