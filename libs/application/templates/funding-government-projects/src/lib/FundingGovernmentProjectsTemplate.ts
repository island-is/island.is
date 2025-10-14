import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import {
  ApplicationConfigurations,
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  defineTemplateApi,
} from '@island.is/application/types'
import { FundingGovernmentProjectsSchema } from './dataSchema'
import { application } from './messages'
import { CodeOwners } from '@island.is/shared/constants'

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

enum TemplateApiActions {
  // Has to match name of action in template API module
  // (will be refactored when state machine is a part of API module)
  sendApplication = 'sendApplication',
}

const FundingGovernmentProjectsTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<FundingGovernmentProjectsEvent>,
  FundingGovernmentProjectsEvent
> = {
  type: ApplicationTypes.FUNDING_GOVERNMENT_PROJECTS,
  name: application.name,
  codeOwner: CodeOwners.NordaApplications,
  institution: application.institutionName,
  translationNamespaces:
    ApplicationConfigurations.FundingGovernmentProjects.translation,
  dataSchema: FundingGovernmentProjectsSchema,
  stateMachineConfig: {
    initial: States.draft,
    states: {
      [States.draft]: {
        meta: {
          name: States.draft,
          status: 'draft',
          actionCard: {
            title: application.name,
            description: application.description,
          },
          progress: 0.5,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/FundingGovernmentProjectsForm').then(
                  (module) =>
                    Promise.resolve(module.FundingGovernmentProjectsForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              delete: true,
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
          status: 'completed',
          name: States.submitted,
          actionCard: {
            title: application.name,
            description: application.description,
          },
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: TemplateApiActions.sendApplication,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/FundingGovernmentProjectsFormSubmitted').then(
                  (module) =>
                    Promise.resolve(
                      module.FundingGovernmentProjectsFormSubmitted,
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
    if (id === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default FundingGovernmentProjectsTemplate
