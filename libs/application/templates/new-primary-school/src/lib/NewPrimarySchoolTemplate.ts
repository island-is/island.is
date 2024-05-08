import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
  pruneAfterDays,
} from '@island.is/application/core'
import {
  Application,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  IdentityApi,
} from '@island.is/application/types'

import { DataSchema } from './dataSchema'
import { newPrimarySchoolMessages, statesMessages } from './messages'

import { Events, Roles, States } from './constants'

const NewPrimarySchoolTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.NEW_PRIMARY_SCHOOL,
  name: newPrimarySchoolMessages.shared.applicationName,
  institution: newPrimarySchoolMessages.shared.institution,
  translationNamespaces: [
    ApplicationConfigurations.NewPrimarySchool.translation,
  ],
  dataSchema: DataSchema,
  allowMultipleApplicationsInDraft: true,
  // requiredScopes: [ApiScope.carRecycling], ?? do we need scope for the Primary school application ??
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: States.PREREQUISITES,
          status: 'draft',
          lifecycle: EphemeralStateLifeCycle,
          actionCard: {
            pendingAction: {
              title: '',
              displayStatus: 'success',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Prerequisites').then((val) =>
                  Promise.resolve(val.Prerequisites),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
              api: [IdentityApi],
            },
          ],
        },
        on: {
          SUBMIT: States.DRAFT,
        },
      },
      [States.DRAFT]: {
        meta: {
          name: States.DRAFT,
          status: 'draft',
          lifecycle: pruneAfterDays(30),
          /* onExit: defineTemplateApi({
            action: Actions.SEND_APPLICATION,
            throwOnError: true,
          }),*/
          actionCard: {
            pendingAction: {
              title: 'corePendingActionMessages.applicationReceivedTitle',
              displayStatus: 'success',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/NewPrimarySchool').then((val) =>
                  Promise.resolve(val.NewPrimarySchoolForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          SUBMIT: [{ target: States.SUBMITTED }],
        },
      },
      [States.SUBMITTED]: {
        meta: {
          name: States.SUBMITTED,
          status: 'completed',
          actionCard: {
            pendingAction: {
              title: statesMessages.applicationSent,
              content: statesMessages.applicationSentDescription,
              displayStatus: 'success',
            },
          },
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: { target: States.DRAFT },
        },
      },
    },
  },

  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (id === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default NewPrimarySchoolTemplate
