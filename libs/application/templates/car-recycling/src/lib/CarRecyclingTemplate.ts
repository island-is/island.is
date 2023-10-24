import {
  coreHistoryMessages,
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
  UserProfileApi,
  defineTemplateApi,
} from '@island.is/application/types'

import { assign } from 'xstate'
import { ApiActions } from '../shared'
import { DataSchema } from './dataSchema'
import { carRecyclingMessages } from './messages'

const enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  IN_REVIEW = 'inReview',
}

type ReferenceTemplateEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.EDIT }

enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}

const determineMessageFromApplicationAnswers = (application: Application) => {
  return carRecyclingMessages.name
}

const CarRecyclingTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<ReferenceTemplateEvent>,
  ReferenceTemplateEvent
> = {
  type: ApplicationTypes.CAR_RECYCLING,
  name: determineMessageFromApplicationAnswers,
  institution: carRecyclingMessages.institutionName,
  translationNamespaces: [ApplicationConfigurations.CarRecycling.translation],
  dataSchema: DataSchema,
  allowMultipleApplicationsInDraft: true,

  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      // [States.PREREQUISITES]: {
      //   exit: [],
      //   meta: {
      //     name: States.PREREQUISITES,
      //     status: 'draft',
      //     actionCard: {
      //       historyLogs: [
      //         {
      //           logMessage: coreHistoryMessages.applicationStarted,
      //           onEvent: DefaultEvents.SUBMIT,
      //         },
      //       ],
      //     },
      //     lifecycle: pruneAfterDays(9),
      //     progress: 0.25,
      //     roles: [
      //       {
      //         id: Roles.APPLICANT,
      //         formLoader: () =>
      //           import('../forms/Prerequisites').then((val) =>
      //             Promise.resolve(val.Prerequisites),
      //           ),
      //         actions: [
      //           {
      //             event: DefaultEvents.SUBMIT,
      //             name: 'Submit',
      //             type: 'primary',
      //           },
      //         ],
      //         write: 'all',
      //         delete: true,
      //         api: [UserProfileApi],
      //       },
      //     ],
      //   },
      //   on: {
      //     SUBMIT: States.DRAFT,
      //   },
      // },
      [States.DRAFT]: {
        exit: [],
        meta: {
          name: States.DRAFT,
          status: 'draft',
          lifecycle: pruneAfterDays(30),
          actionCard: {
            description: 'XXX- statesMessages.draftDescription',
            historyLogs: {
              onEvent: DefaultEvents.SUBMIT,
              logMessage: coreHistoryMessages.applicationSent,
            },
          },
          progress: 0.25,
          
          onEntry: defineTemplateApi({
            action: ApiActions.getVehicles,
            externalDataId: 'vehicles',
            throwOnError: false,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/CarRecyclingForm').then((val) =>
                  Promise.resolve(val.CarRecyclingForm),
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
          SUBMIT: [{ target: States.IN_REVIEW }],
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

export default CarRecyclingTemplate
