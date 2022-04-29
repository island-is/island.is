import {
  ApplicationTemplate,
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTypes,
  ApplicationRole,
  DefaultStateLifeCycle,
  Application,
  DefaultEvents,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import { Events, States, Roles } from './constants'
import { dataSchema } from './dataSchema'
import { m } from '../lib/messages'
import { ApiActions } from './constants'

const AnnouncementOfDeathTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.ANNOUNCEMENT_OF_DEATH,
  name: m.applicationTitle,
  institution: m.applicationInstitution,
  dataSchema: dataSchema,
  readyForProduction: false,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        id: 'prerequisite',
        exit: [],
        meta: {
          name: 'Prerequisites',
          actionCard: {
            title: m.applicationTitle,
          },
          onEntry: {
            apiModuleAction: ApiActions.syslumennOnEntry,
            shouldPersistToExternalData: true,
            throwOnError: false,
          },
          progress: 0.25,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/prerequisite').then((val) =>
                  Promise.resolve(val.prerequisite()),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DRAFT },
        },
      },
      [States.DRAFT]: {
        meta: {
          name: 'Draft',
          actionCard: {
            title: m.applicationTitle,
          },
          progress: 0.5,
          lifecycle: DefaultStateLifeCycle,
          onExit: {
            apiModuleAction: ApiActions.submitApplication,
            shouldPersistToExternalData: true,
            throwOnError: true,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/draft').then((val) =>
                  Promise.resolve(val.draft()),
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
          [DefaultEvents.REJECT]: { target: States.DELEGATED },
        },
      },
      [States.DONE]: {
        meta: {
          name: 'Done',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,

          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () => import('../forms/done').then((val) => val.done),
              read: 'all',
            },
          ],
        },
        type: 'final' as const,
      },
      [States.DELEGATED]: {
        meta: {
          name: 'Delegated',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/delegated').then((val) => val.delegated),
              read: 'all',
            },
          ],
        },
        type: 'final' as const,
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

export default AnnouncementOfDeathTemplate
