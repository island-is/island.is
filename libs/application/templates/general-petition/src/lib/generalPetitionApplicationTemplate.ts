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
import { ApiModuleActions, States, Roles } from '../constants'
import { GeneralPetitionSchema } from './dataSchema'
import { assign } from 'xstate'

type Events = { type: DefaultEvents.SUBMIT }

const GeneralPetitionApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.GENERAL_PETITION,
  name: 'Meðmælendalisti',
  dataSchema: GeneralPetitionSchema,
  readyForProduction: true,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'draft',
          progress: 0.5,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ApplicationForm').then((module) =>
                  Promise.resolve(module.PetitionApplicationForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
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
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: ApiModuleActions.CreateEndorsementList,
            shouldPersistToExternalData: true,
            throwOnError: true,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/LetterApplicationApproved').then((val) =>
                  Promise.resolve(val.LetterApplicationApproved),
                ),
              read: 'all',
            },  
          ],
        },
        type: 'final' as const,
      }
    },
  },
  stateMachineOptions: {
    actions: {
      assignToMinistryOfJustice: assign((context) => {
        return {
          ...context,
          application: {
            ...context.application,
            assignees:
              process.env.PARTY_LETTER_ASSIGNED_ADMINS?.split(',') ?? [],
          },
        }
      }),
      clearAssignees: assign((context) => ({
        ...context,
        application: {
          ...context.application,
          assignees: [],
        },
      })),
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (application.applicant === nationalId) {
      return Roles.APPLICANT
    } else {
      return undefined
    }
  },
}

export default GeneralPetitionApplicationTemplate
