import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  FormModes,
  ApplicationConfigurations,
  defineTemplateApi,
} from '@island.is/application/types'
import { Events, Roles, States } from '../utils/constants'
import { CodeOwners } from '@island.is/shared/constants'
import { dataSchema } from './dataSchema'
import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import { VehiclesApi } from '../dataProviders'
import { AuthDelegationType } from '@island.is/shared/types'
import { ApiScope } from '@island.is/auth/scopes'
import { m } from './messages'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.CAR_EXPORT_IMPORT,
  name: m.application.name,
  codeOwner: CodeOwners.NordaApplications,
  institution: m.application.institution,
  translationNamespaces:
    ApplicationConfigurations.CarExportImport.translation,
  dataSchema,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: States.PREREQUISITES,
          progress: 0,
          status: FormModes.DRAFT,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/prerequisitesForm').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              api: [VehiclesApi],
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
          name: States.DRAFT,
          progress: 0.5,
          status: FormModes.DRAFT,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/mainForm').then((module) =>
                  Promise.resolve(module.MainForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              delete: true,
            },
          ],
          onExit: defineTemplateApi({
            action: 'submitApplication',
          }),
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.COMPLETED,
          },
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: States.COMPLETED,
          progress: 1,
          status: FormModes.COMPLETED,
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
    },
  },
  allowedDelegations: [
    {
      type: AuthDelegationType.ProcurationHolder,
    },
    {
      type: AuthDelegationType.Custom,
    },
  ],
  requiredScopes: [ApiScope.rsk],
  mapUserToRole(
    _nationalId: string,
    _application: Application,
  ): ApplicationRole | undefined {
    return Roles.APPLICANT
  },
}

export default template
