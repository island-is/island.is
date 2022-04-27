import {
  Application,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  DefaultStateLifeCycle,
} from '@island.is/application/core'
import { ApiActions } from '../shared'
import { ComplaintsToAlthingiOmbudsmanSchema } from './dataSchema'

const States = {
  draft: 'draft',
  submitted: 'submitted',
}

type ComplaintsToAlthingiOmbudsmanEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }

enum Roles {
  APPLICANT = 'applicant',
}

const ComplaintsToAlthingiOmbudsmanTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<ComplaintsToAlthingiOmbudsmanEvent>,
  ComplaintsToAlthingiOmbudsmanEvent
> = {
  type: ApplicationTypes.COMPLAINTS_TO_ALTHINGI_OMBUDSMAN,
  name: 'Kvörtun til umboðsmanns Alþingis',
  translationNamespaces: [
    ApplicationConfigurations.ComplaintsToAlthingiOmbudsman.translation,
  ],
  dataSchema: ComplaintsToAlthingiOmbudsmanSchema,
  stateMachineConfig: {
    initial: States.draft,
    states: {
      [States.draft]: {
        meta: {
          name: States.draft,
          progress: 0.5,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import(
                  '../forms/ComplaintsToAlthingiOmbudsmanApplication'
                ).then((val) =>
                  Promise.resolve(val.ComplaintsToAlthingiOmbudsmanApplication),
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
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: ApiActions.submitApplication,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import(
                  '../forms/ComplaintsToAlthingiOmbudsmanSubmitted'
                ).then((val) =>
                  Promise.resolve(val.ComplaintsToAlthingiOmbudsmanSubmitted),
                ),
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

export default ComplaintsToAlthingiOmbudsmanTemplate
