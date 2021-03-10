import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
} from '@island.is/application/core'
import { extractParentFromApplication } from './utils'
import { assign } from 'xstate'
import { dataSchema } from './dataSchema'
import { CRCApplication } from '../types'

type Events = { type: DefaultEvents.ASSIGN } | { type: DefaultEvents.SUBMIT }

export enum ApplicationStates {
  DRAFT = 'draft',
  IN_REVIEW = 'inReview',
  SUBMITTED = 'submitted',
}

enum Roles {
  ParentA = 'parentA',
  ParentB = 'parentB',
}

const applicationName = 'Umsókn um breytt lögheimili barns'

const ChildrenResidenceChangeTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.CHILDREN_RESIDENCE_CHANGE,
  name: 'Children residence change application',
  dataSchema,
  stateMachineConfig: {
    initial: ApplicationStates.DRAFT,
    states: {
      [ApplicationStates.DRAFT]: {
        meta: {
          name: applicationName,
          progress: 0.25,
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
          onEntry: {
            apiModuleAction: 'submitApplication',
          },
          roles: [
            {
              id: Roles.ParentB,
              formLoader: () =>
                import('../forms/ApplicationConfirmation').then((module) =>
                  Promise.resolve(module.ApplicationConfirmation),
                ),
            },
            {
              id: Roles.ParentA,
              formLoader: () =>
                import('../forms/ApplicationConfirmation').then((module) =>
                  Promise.resolve(module.ApplicationConfirmation),
                ),
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
        const otherParent = extractParentFromApplication(
          (context.application as unknown) as CRCApplication,
        )

        return {
          ...context,
          application: {
            ...context.application,
            assignees: [otherParent.ssn],
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
