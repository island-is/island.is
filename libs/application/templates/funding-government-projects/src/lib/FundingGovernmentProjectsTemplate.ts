import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultStateLifeCycle,
} from '@island.is/application/core'
import * as z from 'zod'

type Events = { type: 'SUBMIT' }

const ExampleSchema = z.object({})

const FundingGovernmentProjectsTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.APPLICATION_FOR_FUNDING_GOVERNMENT_PROJECTS,
  name: 'Umsókn um fjármögnun vegna ríkisverkefnis',
  dataSchema: ExampleSchema,
  stateMachineConfig: {
    initial: 'draft',
    states: {
      draft: {
        meta: {
          name: 'Umsókn',
          progress: 0.5,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/ExampleForm').then((module) =>
                  Promise.resolve(module.ExampleForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          SUBMIT: {
            target: 'approved',
          },
        },
      },
      approved: {
        meta: {
          name: 'Samþykkt',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/Approved').then((val) =>
                  Promise.resolve(val.Approved),
                ),
            },
          ],
        },
        type: 'final' as const,
      },
    },
  },
  mapUserToRole(id: string, application: Application): ApplicationRole {
    if (application.state === 'inReview') {
      // TODO
      return 'reviewer'
    }
    return 'applicant'
  },
}

export default FundingGovernmentProjectsTemplate
