import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  DefaultStateLifeCycle,
} from '@island.is/application/core'
import { application } from './messages'
import * as z from 'zod'

type Events = { type: DefaultEvents.SUBMIT }

const applicationName = 'Umsókn um sameiginlega forsjá'

enum ApplicationStates {
  DRAFT = 'draft',
}

enum Roles {
  ParentA = 'parentA',
}

const JointChildCustodyTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.JOINT_CHILD_CUSTODY,
  name: application.name,
  readyForProduction: true,
  dataSchema: z.object({}),
  stateMachineConfig: {
    initial: ApplicationStates.DRAFT,
    states: {
      [ApplicationStates.DRAFT]: {
        meta: {
          name: applicationName,
          progress: 0.25,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.ParentA,
              formLoader: () =>
                import('../forms/JointChildCustodyForm').then((module) =>
                  Promise.resolve(module.JointChildCustodyForm),
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
    return Roles.ParentA
  },
}

export default JointChildCustodyTemplate
