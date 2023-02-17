import { DefaultStateLifeCycle } from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  defineTemplateApi,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'
import { ApiModuleActions, States, Roles } from '../constants'
import { GeneralPetitionSchema } from './dataSchema'

type Events = { type: DefaultEvents.SUBMIT }

const GeneralPetitionTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.GENERAL_PETITION,
  name: '',
  dataSchema: GeneralPetitionSchema,
  readyForProduction: false,
  featureFlag: Features.generaPetition,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'draft',
          status: 'draft',
          progress: 0.5,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/createPetitionForm').then((module) =>
                  Promise.resolve(module.form),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: '',
                  type: 'primary',
                },
              ],
              write: 'all',
              api: [NationalRegistryUserApi],
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.DONE,
          },
        },
      },
      [States.DONE]: {
        meta: {
          name: 'Done',
          status: 'completed',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: ApiModuleActions.CreateEndorsementList,
            shouldPersistToExternalData: true,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/done').then((val) =>
                  Promise.resolve(val.done),
                ),
              read: 'all',
            },
            {
              id: Roles.SIGNATUREE,
              formLoader: () =>
                import('../forms/signPetitionForm').then((val) =>
                  Promise.resolve(val.signPetitionForm),
                ),
              read: {
                answers: ['documents', 'listName', 'aboutList', 'dates'],
                externalData: ['createEndorsementList'],
              },
            },
          ],
        },
      },
    },
  },
  mapUserToRole(nationalId: string, application: Application) {
    if (application.applicant === nationalId) {
      return Roles.APPLICANT
    } else if (application.state === States.DONE) {
      return Roles.SIGNATUREE
    }
  },
}

export default GeneralPetitionTemplate
