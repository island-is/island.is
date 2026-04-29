import {
  Application,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  UserProfileApi,
} from '@island.is/application/types'
import { DefaultStateLifeCycle, defineWorkflow } from '@island.is/application/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Features } from '@island.is/feature-flags'

import { GetPropertyInfoApi, SearchAddressesApi } from '../dataProviders'
import { application } from './messages'
import { answerValidators } from './answerValidators'
import { dataSchema } from './dataSchema'
import { Events, Roles, States } from '../utils/constants'

const RentalAgreementSdfWorkflow = defineWorkflow<Events>({
  initialPhase: States.PREREQUISITES,
  phases: {
    [States.PREREQUISITES]: {
      name: 'Prerequisites',
      status: 'draft',
      lifecycle: DefaultStateLifeCycle,
      roles: [
        {
          id: Roles.APPLICANT,
          formLoader: () =>
            import('../forms/prerequisitesForm').then((module) =>
              Promise.resolve(module.PrerequisitesForm),
            ),
          actions: [
            { event: DefaultEvents.SUBMIT, name: 'Staðfesta', type: 'primary' },
          ],
          write: 'all',
          read: 'all',
          api: [SearchAddressesApi, UserProfileApi],
          delete: true,
        },
      ],
      transitions: {
        [DefaultEvents.SUBMIT]: States.DRAFT,
      },
    },
    [States.DRAFT]: {
      name: 'Draft',
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
            { event: DefaultEvents.SUBMIT, name: 'Senda inn', type: 'primary' },
          ],
          write: 'all',
          read: 'all',
          api: [SearchAddressesApi, GetPropertyInfoApi, UserProfileApi],
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
  type: ApplicationTypes.RENTAL_AGREEMENT_SDF,
  name: application.name,
  institution: application.institutionName,
  codeOwner: CodeOwners.NordaApplications,
  translationNamespaces: ['application.system'],
  dataSchema,
  answerValidators,
  featureFlag: Features.exampleApplication,
  allowMultipleApplicationsInDraft: true,
  ...RentalAgreementSdfWorkflow,
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
