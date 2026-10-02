import {
  Application,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
} from '@island.is/application/types'
import { EphemeralStateLifeCycle } from '@island.is/application/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Events, Roles, States } from './constants'
import { dataSchema } from './dataSchema'
import { m } from './messages'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.TRANSLATION_WORKSPACE_SMOKE_TEST,
  name: m.name,
  codeOwner: CodeOwners.NordaApplications,
  translationNamespaces: [
    ApplicationConfigurations.TranslationWorkspaceSmokeTest.translation,
  ],
  dataSchema,
  stateMachineConfig: {
    initial: States.PREREQUISITE,
    states: {
      [States.PREREQUISITE]: {
        meta: {
          name: 'Prerequisite',
          status: 'draft',
          actionCard: {
            tag: {
              label: m.actionCardPrerequisite,
              variant: 'blue',
            },
          },
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/PrerequisiteForm').then((module) =>
                  Promise.resolve(module.PrerequisiteForm),
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
          [DefaultEvents.SUBMIT]: { target: States.MAIN },
        },
      },
      [States.MAIN]: {
        meta: {
          name: 'Main',
          status: 'draft',
          actionCard: {
            tag: {
              label: m.actionCardMain,
              variant: 'blue',
            },
          },
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/MainForm').then((module) =>
                  Promise.resolve(module.MainForm),
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
          [DefaultEvents.SUBMIT]: { target: States.COMPLETED },
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: 'Completed',
          status: 'completed',
          actionCard: {
            tag: {
              label: m.actionCardDone,
              variant: 'blueberry',
            },
          },
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/CompletedForm').then((module) =>
                  Promise.resolve(module.CompletedForm),
                ),
              read: 'all',
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
