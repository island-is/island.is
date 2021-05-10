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

const JointCustodyAgreementTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.JOINT_CUSTODY_AGREEMENT,
  name: application.name,
  readyForProduction: false,
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
                import('../forms/JointCustodyAgreementForm').then((module) =>
                  Promise.resolve(module.JointCustodyAgreementForm),
                ),
              actions: [
                {
                  event: DefaultEvents.ASSIGN,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
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

export default JointCustodyAgreementTemplate
