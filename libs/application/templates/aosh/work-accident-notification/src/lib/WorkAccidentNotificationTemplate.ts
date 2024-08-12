import { z } from 'zod'
import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  DefaultEvents,
  NationalRegistryUserApi,
  UserProfileApi,
  ApplicationConfigurations,
  Application,
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'
import { Roles, States, Events } from './constants'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.WORK_ACCIDENT_NOTIFICATION,
  name: '',
  institution: '',
  translationNamespaces: [
    ApplicationConfigurations.WorkAccidentNotification.translation,
  ],
  dataSchema: z.object({}),
  featureFlag: Features.exampleApplication,
  allowMultipleApplicationsInDraft: true,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Skilyrði',
          progress: 0,
          status: 'draft',
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Prerequisites').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
              api: [NationalRegistryUserApi, UserProfileApi],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DRAFT },
        },
      },
      [States.DRAFT]: {
        meta: {
          name: 'Umsókn um ....',
          progress: 0.25,
          status: 'draft',
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/WorkAccidentNotificationForm/index').then(
                  (module) =>
                    Promise.resolve(module.WorkAccidentNotificationForm),
                ),
              write: 'all',
              delete: true,
            },
          ],
        },
      },
    },
  },
  stateMachineOptions: {},
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    console.log('THE ID: ', application.applicant)

    if (id === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default template
