import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  FormModes,
  UserProfileApi,
  ApplicationConfigurations,
} from '@island.is/application/types'
import { Events, Roles, States } from '../utils/constants'
import { CodeOwners } from '@island.is/shared/constants'
import { dataSchema } from './dataSchema'
import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import { AuthDelegationType } from '@island.is/shared/types'
import { NationalRegistryV3UserApi, IdentityApi } from '../dataProviders'
import { isCompany } from 'kennitala'
import { Features } from '@island.is/feature-flags'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.EXAMPLE_AUTH_DELEGATION,
  name: 'example-auth-delegation template',
  codeOwner: CodeOwners.NordaApplications,
  institution: 'Stafrænt Ísland',
  translationNamespaces: [
    ApplicationConfigurations.ExampleAuthDelegation.translation,
  ],
  dataSchema,
  featureFlag: Features.exampleApplication,
  allowedDelegations: [
    {
      type: AuthDelegationType.ProcurationHolder, // Procure for a company or an entity
    },
    // Those next 5 AuthDelegationTypes revolve around persons and the different reasons a user might
    // have the power of attorney (umboð) for another person
    // If the login doesn't match the type of delegation, an error screen will be shown and the
    // user can't start the application
    {
      type: AuthDelegationType.GeneralMandate, // Allsherjarumboð, every user has this for it's own account but can have this for other users as well
    },
    {
      type: AuthDelegationType.LegalGuardian,
    },
    {
      type: AuthDelegationType.LegalGuardianMinor,
    },
    {
      type: AuthDelegationType.LegalRepresentative,
    },
    {
      type: AuthDelegationType.PersonalRepresentative,
    },
    // Custom delegation, has to have the requiredScopes set in the template to be able to work
    // {
    //   type: AuthDelegationType.Custom,
    // },
  ],
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Skilyrði',
          progress: 0,
          status: FormModes.DRAFT,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            // Load the correct form for the role
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/prerequisitesForm/regularLoginForm').then(
                  (module) => Promise.resolve(module.Prerequisites),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              api: [UserProfileApi, NationalRegistryV3UserApi],
              delete: true,
            },
            {
              id: Roles.PROCURER,
              formLoader: () =>
                import('../forms/prerequisitesForm/procureForm').then(
                  (module) => Promise.resolve(module.Prerequisites),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              api: [UserProfileApi, IdentityApi],
              delete: true,
            },
            {
              id: Roles.POWER_OF_ATTORNEY,
              formLoader: () =>
                import('../forms/prerequisitesForm/powerOfAttorneyForm').then(
                  (module) => Promise.resolve(module.Prerequisites),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              api: [UserProfileApi, NationalRegistryV3UserApi],
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.DRAFT,
          },
        },
      },
      [States.DRAFT]: {
        meta: {
          name: 'Main form',
          progress: 0.4,
          status: FormModes.DRAFT,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            // Load the correct form for the role
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/mainForms/regularLoginForm').then((module) =>
                  Promise.resolve(module.RegularLoginForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              delete: true,
            },
            {
              id: Roles.PROCURER,
              formLoader: () =>
                import('../forms/mainForms/procureForm').then((module) =>
                  Promise.resolve(module.ProcureForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              delete: true,
            },
            {
              id: Roles.POWER_OF_ATTORNEY,
              formLoader: () =>
                import('../forms/mainForms/powerOfAttorneyForm').then(
                  (module) => Promise.resolve(module.PowerOfAttorneyForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.COMPLETED,
          },
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: 'Completed form',
          progress: 1,
          status: FormModes.COMPLETED,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            // Here the same form is loaded for all roles
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/completedForm').then((module) =>
                  Promise.resolve(module.completedForm),
                ),
              read: 'all',
              delete: true,
            },
            {
              id: Roles.PROCURER,
              formLoader: () =>
                import('../forms/completedForm').then((module) =>
                  Promise.resolve(module.completedForm),
                ),
              read: 'all',
              delete: true,
            },
            {
              id: Roles.POWER_OF_ATTORNEY,
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
    },
  },
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    const { applicant, applicantActors } = application

    if (id !== applicant) {
      return undefined
    }

    if (!applicantActors.length) {
      return Roles.APPLICANT
    }

    if (isCompany(id)) {
      return Roles.PROCURER
    }

    return Roles.POWER_OF_ATTORNEY
  },
}

export default template
