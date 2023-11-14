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
  NationalRegistryUserApi,
  UserProfileApi,
  defineTemplateApi,
} from '@island.is/application/types'

import { DataSchema } from './dataSchema'
import { carRecyclingMessages, statesMessages } from './messages'
import { ApiActions } from '../shared'
import { CurrentVehiclesApi } from '../dataProviders'
import { answerValidators } from './answerValidators'

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
  //requiredScopes: [ApiScope.recyclingFund],
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        exit: [],
        meta: {
          name: States.PREREQUISITES,
          status: 'draft',
          lifecycle: pruneAfterDays(1),
          progress: 0.25,
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationStarted,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
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
              api: [
                UserProfileApi,
                NationalRegistryUserApi,
                CurrentVehiclesApi,
              ],
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
          onEntry: defineTemplateApi({
            action: ApiActions.getVehicles,
            externalDataId: 'vehicles',
            throwOnError: false,
          }),
          progress: 0.25,
          /* onExit: defineTemplateApi({
            action: Actions.SEND_APPLICATION,
            throwOnError: true,
          }),*/
          actionCard: {
            description: statesMessages.draftDescription,
            historyLogs: {
              onEvent: DefaultEvents.SUBMIT,
              logMessage: coreHistoryMessages.applicationSent,
            },
          },
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
        on: {},
      },
    },
  },
  stateMachineOptions: {
    actions: {},
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
  answerValidators,
}

export default CarRecyclingTemplate
