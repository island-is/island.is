import {
  ApplicationTemplate,
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTypes,
  ApplicationRole,
  Application,
  DefaultEvents,
  defineTemplateApi,
  EmployeeApi,
  NationalRegistryUserApi,
  ApplicationConfigurations,
} from '@island.is/application/types'
import { Events, States, Roles } from './constants'
import { dataSchema } from './dataSchema'
import { m } from './messages'
import { ApiActions } from './constants'
import { CodeOwners } from '@island.is/shared/constants'

const configuration =
  ApplicationConfigurations[ApplicationTypes.DRIVING_SCHOOL_CONFIRMATION]

const DrivingSchoolConfirmationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.DRIVING_SCHOOL_CONFIRMATION,
  name: m.applicationTitle,
  codeOwner: CodeOwners.Juni,
  dataSchema: dataSchema,
  translationNamespaces: [configuration.translation],
  stateMachineConfig: {
    initial: States.CONFIRM,
    states: {
      [States.CONFIRM]: {
        meta: {
          name: 'Confirmations',
          status: 'draft',
          actionCard: {
            title: m.applicationTitle,
          },
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
              id: Roles.SCHOOL_EMPLOYEE,
              formLoader: () =>
                import('../forms/drivingSchoolConfirmation').then((val) =>
                  Promise.resolve(val.getDrivingSchoolConfirmation()),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
              api: [EmployeeApi, NationalRegistryUserApi],
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
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            whenToPrune: 24 * 3600 * 1000,
          },
          roles: [
            {
              id: Roles.SCHOOL_EMPLOYEE,
              formLoader: () => import('../forms/done').then((val) => val.done),
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
      return Roles.SCHOOL_EMPLOYEE
    }
  },
}

export default DrivingSchoolConfirmationTemplate
