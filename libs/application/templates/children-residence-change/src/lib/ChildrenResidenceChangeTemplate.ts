import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  DefaultStateLifeCycle,
} from '@island.is/application/core'
import { assign } from 'xstate'
import { dataSchema } from './dataSchema'
import { CRCApplication } from '../types'
import { getSelectedChildrenFromExternalData } from './utils'
import { Roles, ApplicationStates } from './constants'
import { application } from './messages'

type Events = { type: DefaultEvents.ASSIGN } | { type: DefaultEvents.SUBMIT }

enum TemplateApiActions {
  submitApplication = 'submitApplication',
  sendNotificationToCounterParty = 'sendNotificationToCounterParty',
}

const applicationName = 'Umsókn um breytt lögheimili barns'

const ChildrenResidenceChangeTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.CHILDREN_RESIDENCE_CHANGE,
  name: application.name,
  readyForProduction: true,
  dataSchema,
  stateMachineConfig: {
    initial: ApplicationStates.DRAFT,
    states: {
      [ApplicationStates.DRAFT]: {
        meta: {
          name: applicationName,
          progress: 0.25,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.ParentA,
              formLoader: () =>
                import('../forms/ChildrenResidenceChangeForm').then((module) =>
                  Promise.resolve(module.ChildrenResidenceChangeForm),
                ),
              actions: [
                {
                  event: DefaultEvents.ASSIGN,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          ASSIGN: {
            target: ApplicationStates.IN_REVIEW,
          },
        },
      },
      [ApplicationStates.IN_REVIEW]: {
        entry: 'assignToOtherParent',
        meta: {
          name: applicationName,
          progress: 0.5,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: TemplateApiActions.sendNotificationToCounterParty,
          },
          roles: [
            {
              id: Roles.ParentB,
              formLoader: () =>
                import('../forms/ParentBForm').then((module) =>
                  Promise.resolve(module.ParentBForm),
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
            {
              id: Roles.ParentA,
              formLoader: () =>
                import('../forms/ApplicationConfirmation').then((module) =>
                  Promise.resolve(module.ApplicationConfirmation),
                ),
              read: 'all',
            },
          ],
        },
        on: {
          SUBMIT: {
            target: ApplicationStates.SUBMITTED,
          },
        },
      },
      [ApplicationStates.SUBMITTED]: {
        meta: {
          name: applicationName,
          progress: 0.75,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: TemplateApiActions.submitApplication,
          },
          roles: [
            {
              id: Roles.ParentA || Roles.ParentB,
              formLoader: () =>
                import('../forms/ApplicationConfirmation').then((module) =>
                  Promise.resolve(module.ApplicationConfirmation),
                ),
              read: 'all',
            },
          ],
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      assignToOtherParent: assign((context) => {
        // TODO: fix this..
        const {
          externalData,
          answers,
        } = (context.application as unknown) as CRCApplication
        const applicant = externalData.nationalRegistry.data
        const selectedChildren = getSelectedChildrenFromExternalData(
          applicant.children,
          answers.selectedChildren,
        )
        const otherParent = selectedChildren[0].otherParent

        return {
          ...context,
          application: {
            ...context.application,
            assignees: [otherParent.nationalId],
          },
        }
      }),
    },
  },

  mapUserToRole(
    id: string,
    // TODO: Somehow use CRCApplication here
    application: Application,
  ): ApplicationRole | undefined {
    if (
      application.assignees.includes(id) &&
      application.answers.useMocks === 'yes' &&
      application.state === ApplicationStates.IN_REVIEW
    ) {
      return Roles.ParentB
    }
    if (id === application.applicant) {
      return Roles.ParentA
    }
    if (application.assignees.includes(id)) {
      return Roles.ParentB
    }
    return undefined
  },
}

export default ChildrenResidenceChangeTemplate
