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
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Draft',
          status: 'draft',
          actionCard: {
            tag: {
              label: m.actionCardDraft,
              variant: 'blue',
            },
          },
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/DraftForm').then((module) =>
                  Promise.resolve(module.DraftForm),
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
