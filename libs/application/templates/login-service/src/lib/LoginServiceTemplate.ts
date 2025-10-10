import { DefaultStateLifeCycle } from '@island.is/application/core'
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
import { LoginServiceSchema } from './dataSchema'
import { application } from './messages'
import { CodeOwners } from '@island.is/shared/constants'

const States = {
  draft: 'draft',
  submitted: 'submitted',
}

type LoginServiceEvent =
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

const ReferenceApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<LoginServiceEvent>,
  LoginServiceEvent
> = {
  type: ApplicationTypes.LOGIN_SERVICE,
  name: application.name,
  codeOwner: CodeOwners.NordaApplications,
  institution: application.institutionName,
  translationNamespaces: ApplicationConfigurations.LoginService.translation,
  dataSchema: LoginServiceSchema,
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
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/LoginServiceForm').then((module) =>
                  Promise.resolve(module.LoginServiceForm),
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
          status: 'completed',
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
                import('../forms/LoginServiceFormSubmitted').then((module) =>
                  Promise.resolve(module.LoginServiceFormSubmitted),
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

export default ReferenceApplicationTemplate
