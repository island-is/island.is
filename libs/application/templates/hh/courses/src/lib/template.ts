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
import { Features } from '@island.is/feature-flags'
import { CodeOwners } from '@island.is/shared/constants'
import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import { UserProfileApi, NationalRegistryUserApi } from '../dataProviders'
import { ApiActions, Events, Roles, States } from '../utils/constants'
import { dataSchema } from './dataSchema'

import { m } from './messages'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.HEILSUGAESLA_HOFUDBORDARSVAEDISINS_NAMSKEID,
  name: m.general.applicationTitle,
  codeOwner: CodeOwners.Stefna,
  institution: m.general.institutionName,
  translationNamespaces:
    ApplicationConfigurations[
      ApplicationTypes.HEILSUGAESLA_HOFUDBORDARSVAEDISINS_NAMSKEID
    ].translation,
  dataSchema,
  allowMultipleApplicationsInDraft: true,
  initialQueryParameter: 'selection',
  featureFlag: Features.isHHCourseApplicationEnabled,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Prerequisites',
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
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.general.confirmButtonLabel,
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              api: [UserProfileApi, NationalRegistryUserApi],
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
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/mainForm').then((module) =>
                  Promise.resolve(module.MainForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.overview.submitTitle,
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              delete: true,
            },
          ],
          onExit: [
            defineTemplateApi({
              action: ApiActions.submitApplication,
              throwOnError: true,
            }),
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
