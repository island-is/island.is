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
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'

const States = {
  prerequisites: 'prerequisites',
  draft: 'draft',
}
type ReferenceTemplateEvent = { type: DefaultEvents.APPROVE }

enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<ReferenceTemplateEvent>,
  ReferenceTemplateEvent
> = {
  type: ApplicationTypes.WORK_ACCIDENT_NOTIFICATION,
  name: '',
  institution: '',
  translationNamespaces: [],
  dataSchema: z.object({}),
  featureFlag: Features.exampleApplication,
  allowMultipleApplicationsInDraft: true,
  stateMachineConfig: {
    initial: States.prerequisites,
    states: {
      [States.prerequisites]: {
        meta: {
          name: 'Skilyrði',
          progress: 0,
          status: 'draft',
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              // formLoader: () =>
              //   import('../forms/Prerequisites').then((module) =>
              //     Promise.resolve(module.Prerequisites),
              //   ),
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
      },
      [States.draft]: {
        meta: {
          name: 'Umsókn um ....',
          progress: 0.25,
          status: 'draft',
          lifecycle: DefaultStateLifeCycle,
          roles: [],
        },
      },
    },
  },
  stateMachineOptions: {},
  mapUserToRole(): ApplicationRole | undefined {
    //nationalId: string,
    //application: Application,
    return Roles.APPLICANT
  },
}

export default template
