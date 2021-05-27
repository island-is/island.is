import { assign } from 'xstate'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  TagVariant,
} from '@island.is/application/core'
import { getSelectedChildrenFromExternalData } from '@island.is/application/templates/family-matters-core/utils'
import { dataSchema } from './dataSchema'
import { CRCApplication } from '../types'
import { Roles, ApplicationStates } from './constants'
import { application, stateDescriptions, stateLabels } from './messages'

type Events =
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.REJECT }

enum TemplateApiActions {
  submitApplication = 'submitApplication',
  sendNotificationToCounterParty = 'sendNotificationToCounterParty',
  rejectApplication = 'rejectApplication',
}

const applicationName = 'Umsókn um breytt lögheimili barns'

const oneYear = 24 * 3600 * 1000 * 365
const twentyEightDays = 24 * 3600 * 1000 * 28

const pruneAfter = (time: number) => {
  return {
    shouldBeListed: true,
    shouldBePruned: true,
    whenToPrune: time,
  }
}

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
          description: stateDescriptions.draft,
          lifecycle: pruneAfter(oneYear),
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
          description: stateDescriptions.inReview,
          lifecycle: pruneAfter(twentyEightDays),
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
                {
                  event: DefaultEvents.REJECT,
                  name: 'Hafna',
                  type: 'reject',
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
          REJECT: {
            target: ApplicationStates.REJECTEDBYPARENTB,
          },
        },
      },
      [ApplicationStates.SUBMITTED]: {
        meta: {
          name: applicationName,
          description: stateDescriptions.submitted,
          lifecycle: pruneAfter(oneYear),
          tag: { label: stateLabels.submitted },
          onEntry: {
            apiModuleAction: TemplateApiActions.submitApplication,
          },
          roles: [
            {
              id: Roles.ParentA,
              formLoader: () =>
                import('../forms/ApplicationConfirmation').then((module) =>
                  Promise.resolve(module.ApplicationConfirmation),
                ),
              read: 'all',
            },
            {
              id: Roles.ParentB,
              formLoader: () =>
                import(
                  '../forms/ParentBApplicationConfirmation'
                ).then((module) =>
                  Promise.resolve(module.ParentBApplicationConfirmation),
                ),
              read: 'all',
            },
          ],
        },
      },
      [ApplicationStates.REJECTEDBYPARENTB]: {
        meta: {
          name: applicationName,
          description: stateDescriptions.rejectedByParentB,
          lifecycle: pruneAfter(oneYear),
          tag: {
            variant: TagVariant.RED,
            label: stateLabels.rejectedByParentB,
          },
          onEntry: {
            apiModuleAction: TemplateApiActions.rejectApplication,
          },
          roles: [
            {
              id: Roles.ParentB,
              formLoader: () =>
                import('../forms/ContractRejected').then((module) =>
                  Promise.resolve(module.ParentBContractRejected),
                ),
            },
            {
              id: Roles.ParentA,
              formLoader: () =>
                import('../forms/ContractRejected').then((module) =>
                  Promise.resolve(module.ContractRejected),
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
