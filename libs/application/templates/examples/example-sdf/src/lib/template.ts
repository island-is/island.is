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
import { DefaultStateLifeCycle, defineWorkflow } from '@island.is/application/core'
import { MyPlotsApi } from '../dataProviders'
import { Features } from '@island.is/feature-flags'

const ExampleSdfWorkflow = defineWorkflow<Events>({
  initialPhase: States.PREREQUISITES,
  phases: {
    [States.PREREQUISITES]: {
      name: 'Prerequisites',
      status: 'draft',
      lifecycle: {
        shouldBeListed: true,
        shouldBePruned: true,
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
            { event: 'SUBMIT', name: 'Submit', type: 'primary' },
          ],
          write: 'all',
          read: 'all',
          api: [
            MyPlotsApi,
            UserProfileApi,
          ],
          delete: true,
        },
      ],
      transitions: {
        [DefaultEvents.SUBMIT]: States.DRAFT,
      },
    },
    [States.DRAFT]: {
      name: 'Garden Application',
      status: 'draft',
      lifecycle: DefaultStateLifeCycle,
      progress: 0.4,
      roles: [
        {
          id: Roles.APPLICANT,
          formLoader: () =>
            import('../forms/mainForm').then((module) =>
              Promise.resolve(module.MainForm),
            ),
          actions: [
            { event: 'SUBMIT', name: 'Submit', type: 'primary' },
          ],
          write: 'all',
          read: 'all',
          delete: true,
        },
      ],
      transitions: {
        [DefaultEvents.SUBMIT]: States.DONE,
      },
    },
    [States.DONE]: {
      name: 'Completed',
      status: 'completed',
      lifecycle: DefaultStateLifeCycle,
      progress: 1,
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
  type: ApplicationTypes.EXAMPLE_SDF,
  name: 'Example SDF',
  codeOwner: CodeOwners.NordaApplications,
  institution: 'Stafrænt Ísland',
  translationNamespaces: [
    ApplicationConfigurations.ExampleSdf.translation,
  ],
  dataSchema,
  featureFlag: Features.exampleApplication,
  allowMultipleApplicationsInDraft: true,
  ...ExampleSdfWorkflow,
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
