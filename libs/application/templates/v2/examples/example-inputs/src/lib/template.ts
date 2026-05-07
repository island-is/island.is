import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  UserProfileApi,
  ApplicationConfigurations,
} from '@island.is/application/types'
import { Events, Roles, States } from '../utils/constants'
import { CodeOwners } from '@island.is/shared/constants'
import { dataSchema } from './dataSchema'
import {
  DefaultStateLifeCycle,
  defineWorkflow,
} from '@island.is/application/core'
import { NationalRegistryApi, ReferenceDataApi } from '../dataProviders'
import { Features } from '@island.is/feature-flags'

const ExampleInputsWorkflow = defineWorkflow<Events>({
  initialPhase: States.PREREQUISITES,
  phases: {
    [States.PREREQUISITES]: {
      name: 'Skilyrði',
      progress: 0,
      status: 'draft',
      lifecycle: {
        shouldBeListed: true,
        shouldBePruned: true,
        // Applications that stay in this state for 24 hours will be pruned automatically
        whenToPrune: 24 * 3600 * 1000,
      },
      roles: [
        {
          id: Roles.APPLICANT,
          formLoader: () =>
            import('../forms/prerequisitesForm').then((module) =>
              Promise.resolve(module.Prerequisites),
            ),
          actions: [
            { event: DefaultEvents.SUBMIT, name: 'Staðfesta', type: 'primary' },
          ],
          write: 'all',
          read: 'all',
          api: [
            ReferenceDataApi.configure({
              params: {
                id: 1986,
              },
            }),
            NationalRegistryApi.configure({
              params: {
                ageToValidate: 18,
              },
            }),
            UserProfileApi,
          ],
          delete: true,
        },
      ],
      transitions: {
        [DefaultEvents.SUBMIT]: {
          target: States.DRAFT,
        },
      },
    },
    [States.DRAFT]: {
      name: 'Main form',
      progress: 0.4,
      status: 'draft',
      lifecycle: DefaultStateLifeCycle,
      roles: [
        {
          id: Roles.APPLICANT,
          formLoader: () =>
            import('../forms/mainForm').then((module) =>
              Promise.resolve(module.MainForm),
            ),
          actions: [
            { event: DefaultEvents.SUBMIT, name: 'Staðfesta', type: 'primary' },
          ],
          write: 'all',
          read: 'all',
          delete: true,
        },
      ],
      transitions: {
        [DefaultEvents.SUBMIT]: {
          target: States.COMPLETED,
        },
      },
    },
    [States.COMPLETED]: {
      name: 'Completed',
      progress: 1,
      status: 'completed',
      lifecycle: DefaultStateLifeCycle,
      roles: [
        {
          id: Roles.APPLICANT,
          formLoader: () =>
            import('../forms/completedForm').then((module) =>
              Promise.resolve(module.completedForm),
            ),
          read: 'all',
          delete: true,
        },
      ],
    },
  },
})

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.EXAMPLE_INPUTS,
  name: 'Example Inputs SDF',
  codeOwner: CodeOwners.NordaApplications,
  institution: 'Stafrænt Ísland',
  translationNamespaces: ApplicationConfigurations.ExampleInputs.translation,
  dataSchema,
  featureFlag: Features.exampleApplication,
  allowMultipleApplicationsInDraft: true,
  ...ExampleInputsWorkflow,
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (nationalId === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default template
