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
} from '@island.is/application/types'
import { Events, States, Roles } from './constants'
import { dataSchema } from './dataSchema'
import { m } from './messages'
import { ApiActions } from './constants'

const InstructorRegistrationsTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.DRIVING_INSTRUCTOR_REGISTRATIONS,
  name: m.applicationTitle,
  dataSchema: dataSchema,
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
              formLoader: () =>
                import('../forms/instructorRegistrations').then((val) =>
                  Promise.resolve(val.getInstructorRegistrations()),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              api: [HasTeachingRightsApi, NationalRegistryUserApi],
              delete: true,
              write: {
                answers: ['approveExternalData'],
                externalData: [
                  HasTeachingRightsApi.externalDataId,
                  NationalRegistryUserApi.externalDataId,
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
