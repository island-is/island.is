import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationConfigurations,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'
import { ApiActions } from '../shared'
import { m } from './messages'
import { assign } from 'xstate'
import { dataSchema } from './dataSchema'

const States = {
  prerequisites: 'prerequisites',
  draft: 'draft',
  inReview: 'inReview',
  approved: 'approved',
  rejected: 'rejected',
  waitingToAssign: 'waitingToAssign',
}

type DrivingLearnersPermitTemplateEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.EDIT }

enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}
const DrivingLearnersPermitTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<DrivingLearnersPermitTemplateEvent>,
  DrivingLearnersPermitTemplateEvent
> = {
  type: ApplicationTypes.EXAMPLE,
  name: m.name,
  institution: m.institutionName,
  translationNamespaces: [ApplicationConfigurations.ExampleForm.translation],
  dataSchema: dataSchema,
  //TODO: set up a feature flag
  //featureFlag: Features.exampleApplication,
  stateMachineConfig: {
    initial: States.prerequisites,
    states: {
      [States.prerequisites]: {
        meta: {
          name: 'Prerequisities',
          progress: 0,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              //TODO: set up a feature flag for allowFakeData?
              formLoader: async () => {
                const getForm = await import('../forms/Prerequisites').then(
                  (val) => val.getForm,
                )

                return getForm({
                  allowFakeData: true,
                })
              },
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          SUBMIT: {
            target: States.approved,
          },
        },
      },
      [States.approved]: {
        meta: {
          name: 'Approved',
          progress: 1,
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            whenToPrune: 31 * 24 * 3600 * 1000,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Done').then((module) =>
                  Promise.resolve(module.Draft),
                ),
              write: 'all',
              delete: true,
            },
          ],
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      clearAssignees: assign((context) => ({
        ...context,
        application: {
          ...context.application,
          assignees: [],
        },
      })),
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (application.assignees.includes(nationalId)) {
      return Roles.ASSIGNEE
    }
    if (application.applicant === nationalId) {
      if (application.state === 'inReview') {
        return Roles.ASSIGNEE
      }

      return Roles.APPLICANT
    }
  },
}

export default DrivingLearnersPermitTemplate
