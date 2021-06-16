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
import * as z from 'zod'

const States = {
  draft: 'draft',
  submitted: 'submitted',
}

type ComplaintsToAlthingiOmbudsmanEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }

const dataSchema = z.object({})

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
  dataSchema,
  stateMachineConfig: {
    initial: States.draft,
    states: {
      [States.draft]: {
        meta: {
          name: 'hello',
          progress: 0.33,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/TestApplication').then((val) =>
                  Promise.resolve(val.TestApplication),
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
    },
  },
  mapUserToRole(id: string, application: Application): ApplicationRole {
    if (application.state === 'inReview') {
      return 'reviewer'
    }
    return 'applicant'
  },
}

export default ComplaintsToAlthingiOmbudsmanTemplate
