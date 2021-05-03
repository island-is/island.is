import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  DefaultStateLifeCycle,
  ApplicationConfigurations,
} from '@island.is/application/core'
import { FundingGovernmentProjectsSchema } from './dataSchema'
import { application } from './messages'

const States = {
  draft: 'draft',
  submitted: 'submitted',
}

type FundingGovernmentProjectsEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }

enum Roles {
  APPLICANT = 'applicant',
}

const FundingGovernmentProjectsTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<FundingGovernmentProjectsEvent>,
  FundingGovernmentProjectsEvent
> = {
  type: ApplicationTypes.FUNDING_GOVERNMENT_PROJECTS,
  name: 'Umsókn um fjármögnun ríkisverkefnis',
  translationNamespaces: [
    ApplicationConfigurations.FundingGovernmentProjects.translation,
  ],
  dataSchema: FundingGovernmentProjectsSchema,
  stateMachineConfig: {
    initial: States.draft,
    states: {
      [States.draft]: {
        meta: {
          name: States.draft,
          title: application.name,
          description: application.description,
          progress: 0.5,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import(
                  '../forms/FundingGovernmentProjectsForm'
                ).then((module) =>
                  Promise.resolve(module.FundingGovernmentProjectsForm),
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
            target: States.submitted,
          },
        },
      },
      [States.submitted]: {
        meta: {
          name: States.submitted,
          title: application.name,
          description: application.description,
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/FundingGovernmentProjectsFormInReview').then(
                  (module) =>
                    // TODO: Rename this once we start work on it
                    Promise.resolve(
                      module.FundingGovernmentProjectsFormInReview,
                    ),
                ),
              write: 'all',
            },
          ],
        },
      },
    },
  },
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    // TODO: Handle this correctly
    return Roles.APPLICANT
  },
}

export default FundingGovernmentProjectsTemplate
