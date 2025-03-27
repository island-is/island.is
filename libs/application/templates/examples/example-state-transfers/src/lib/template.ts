/*
 ***
 *** The simplest applications follow this state machine:
 ***
 ***
 *** Prerequisites --> Draft --> Completed
 ***
 ***
 ***
 *** Another common pattern is to have someone approve or reject the application
 ***
 ***                                          /--> Approved
 *** Prerequisites --> Draft  --> In review --
 ***                                          \--> Rejected
 ***
 ***
 ***
 *** The state machine is for this template is as follows:
 ***
 ***                           /--> Completed
 *** Prerequisites --> Draft --                                       /--> Approved
 ***                     Λ     \--> Waiting to assign --> In review --
 ***                     |_____________|                              \--> Rejected
 ***
 */

import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  FormModes,
} from '@island.is/application/types'
import { Events, Roles, States } from '../utils/types'
import { CodeOwners } from '@island.is/shared/constants'
import { exampleSchema } from './dataSchema'
import { Features } from '@island.is/feature-flags'
import { prerequisitesState } from './templateSplit/prerequisitesState'
import { completedState } from './templateSplit/completedState'
import {
  approveApplication,
  assignUser,
  rejectApplication,
  unAssignUser,
} from './templateSplit/stateMachineOptions'
import { approvedState } from './templateSplit/approvedState'
import { rejectedState } from './templateSplit/rejectedState'
import { DefaultStateLifeCycle } from '@island.is/application/core'
import { inReviewState } from './templateSplit/inReviewState'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
  name: 'Example state transfers',
  codeOwner: CodeOwners.NordaApplications,
  institution: 'Stafrænt Ísland',
  dataSchema: exampleSchema,
  featureFlag: Features.exampleApplication,
  allowMultipleApplicationsInDraft: true,
  // The stateMachineConfig defines the states and the state transitions
  // Each state has a "roles" object that defines what form to display
  // for the state and the role of the user
  // Another key piece of each state is the "on" object. The "on" object
  // defines what events trigger what state transitions and possibly what function
  // runs on the state transition
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: prerequisitesState,
      [States.DRAFT]: {
        meta: {
          name: 'Main form',
          progress: 0.4,
          status: FormModes.DRAFT,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            // Here we only define one form to display in this state because
            // the assignee role is set after this state
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
        },
        // Here you can have different events sending the applications into different
        // states depending on what is triggered
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.COMPLETED,
          },
          [DefaultEvents.ASSIGN]: {
            target: States.IN_REVIEW,
            actions: 'assignUser',
          },
        },
      },
      [States.IN_REVIEW]: inReviewState,
      [States.COMPLETED]: completedState,
      [States.APPROVED]: approvedState,
      [States.REJECTED]: rejectedState,
    },
  },
  // The stateMachineOptions define functions that can be used like functions in the
  // template-api-modules. The actions here can be run when an event is triggered or
  // they can run on state entry.
  stateMachineOptions: {
    actions: {
      approveApplication,
      rejectApplication,
      assignUser,
      unAssignUser,
    },
  },
  mapUserToRole: (
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined => {
    const { applicant, assignees } = application

    if (nationalId === applicant) {
      return Roles.APPLICANT
    }

    if (assignees.includes(nationalId)) {
      return Roles.ASSIGNEE
    }

    return undefined
  },
}

export default template
