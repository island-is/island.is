import { DefaultStateLifeCycle } from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
} from '@island.is/application/types'
import { ApiModuleActions, States, Roles } from '../constants'
import { GeneralPetitionSchema } from './dataSchema'

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
                import('../forms/PetitionApplicationApproved').then((val) =>
                  Promise.resolve(val.PetitionApplicationApproved),
                ),
              read: 'all',
            },
            {
              id: Roles.SIGNATUREE,
              formLoader: () =>
                import('../forms/EndorsementForm').then((val) =>
                  Promise.resolve(val.EndorsementForm),
                ),
              read: {
                answers: ['documents', 'listName', 'aboutList', 'dates'],
                externalData: ['createEndorsementList'],
              },
            },
          ],
        },
        type: 'final' as const,
      },
    },
  },
  mapUserToRole(nationalId: string, application: Application) {
    if (application.applicant === nationalId) {
      return Roles.APPLICANT
    } else if (application.state === States.APPROVED) {
      return Roles.SIGNATUREE
    }
  },
}

export default GeneralPetitionApplicationTemplate
