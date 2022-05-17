import {
  ApplicationTemplate,
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTypes,
  ApplicationRole,
  Application,
  DefaultEvents,
} from '@island.is/application/core'
import { Events, States, Roles } from './constants'
import { dataSchema } from './dataSchema'
import { m } from './messages'
import { ApiActions } from './constants'
import { Features } from '@island.is/feature-flags'

const DrivingSchoolConfirmationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.DRIVING_SCHOOL_CONFIRMATION,
  name: m.applicationTitle,
  dataSchema: dataSchema,
  readyForProduction: false,
  featureFlag: Features.drivingSchoolConfirmations,
  stateMachineConfig: {
    initial: States.CONFIRM,
    states: {
      [States.CONFIRM]: {
        meta: {
          name: 'Confirmations',
          actionCard: {
            title: m.applicationTitle,
          },
          progress: 0.33,
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            whenToPrune: 24 * 3600 * 1000,
          },
          onExit: {
            apiModuleAction: ApiActions.submitApplication,
            shouldPersistToExternalData: true,
            throwOnError: true,
          },
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
        type: 'final',
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
