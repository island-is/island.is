import { EphemeralStateLifeCycle } from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTypes,
  ApplicationRole,
  Application,
  DefaultEvents,
  StateLifeCycle,
} from '@island.is/application/types'
import { Events, States, Roles } from './constants'
import { dataSchema } from './dataSchema'
import { m } from '../lib/messages'
import { ApiActions } from './constants'
import { Features } from '@island.is/feature-flags'

const HalfYearLifeCycle: StateLifeCycle = {
  shouldBeListed: true,
  shouldBePruned: true,
  whenToPrune: 1000 * 3600 * 24 * 182, // 6 months
}

const DayLifeCycle: StateLifeCycle = {
  shouldBeListed: true,
  shouldBePruned: true,
  whenToPrune: 1000 * 3600 * 24,
}

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
  featureFlag: Features.announcementOfDeath,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        id: 'prerequisite',
        exit: [],
        meta: {
          name: 'Prerequisites',
          status: 'draft',
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
                { event: DefaultEvents.REJECT, name: 'Reject', type: 'reject' },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DRAFT },
          [DefaultEvents.REJECT]: { target: States.DELEGATED },
        },
      },
      [States.DRAFT]: {
        meta: {
          name: 'Draft',
          actionCard: {
            title: m.applicationTitle,
          },
          status: 'draft',
          progress: 0.5,
          lifecycle: HalfYearLifeCycle,
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
        },
      },
      [States.DONE]: {
        meta: {
          name: 'Done',
          progress: 1,
          status: 'completed',
          lifecycle: HalfYearLifeCycle,

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
          status: 'inprogress',
          progress: 1,
          lifecycle: DayLifeCycle,
          onEntry: {
            apiModuleAction: ApiActions.assignElectedPerson,
            shouldPersistToExternalData: false,
            throwOnError: true,
          },
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
