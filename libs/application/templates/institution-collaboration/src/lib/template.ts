import {
  Application,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  defineTemplateApi,
} from '@island.is/application/types'
import { DefaultStateLifeCycle } from '@island.is/application/core'

import { institutionApplicationMessages as m } from './messages'
import { dataSchema } from './dataSchema'
import { CodeOwners } from '@island.is/shared/constants'

type Events = { type: DefaultEvents.SUBMIT } | { type: DefaultEvents.ABORT }

enum States {
  DRAFT = 'draft',
  APPROVED = 'approved',
}

enum Roles {
  APPLICANT = 'applicant',
}

enum TemplateApiActions {
  // Has to match name of action in template API module
  // (will be refactored when state machine is a part of API module)
  sendApplication = 'sendApplication',
}
const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.INSTITUTION_COLLABORATION,
  name: m.application.applicationName,
  codeOwner: CodeOwners.NordaApplications,
  institution: m.application.institutionName,
  dataSchema,
  translationNamespaces:
    ApplicationConfigurations.InstitutionCollaboration.translation,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Umsókn um Umsokn',
          status: 'draft',
          progress: 0.43,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/application').then((val) =>
                  Promise.resolve(val.application),
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
          [DefaultEvents.SUBMIT]: {
            target: States.APPROVED,
          },
        },
      },
      [States.APPROVED]: {
        meta: {
          name: 'Approved',
          status: 'approved',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              read: 'all',
              formLoader: () =>
                import('../forms/approved').then((val) =>
                  Promise.resolve(val.approved),
                ),
            },
          ],
          onEntry: defineTemplateApi({
            action: TemplateApiActions.sendApplication,
          }),
        },
      },
    },
  },
  mapUserToRole(
    nationalRegistryIdOfAuthenticatedUser: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (nationalRegistryIdOfAuthenticatedUser === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default template
