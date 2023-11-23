import {
  DefaultStateLifeCycle,
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

import { ApiScope } from '@island.is/auth/scopes'
import { AuthDelegationType } from '@island.is/shared/types'
import { CurrentVehiclesApi } from '../dataProviders'
import { ApiActions } from '../shared'
import { answerValidators } from './answerValidators'
import { DataSchema } from './dataSchema'
import { carRecyclingMessages, statesMessages } from './messages'

import { assign } from 'xstate'
import unset from 'lodash/unset'

const enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
}
type ReferenceTemplateEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.EDIT }

enum Roles {
  APPLICANT = 'applicant',
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
  allowedDelegations: [{ type: AuthDelegationType.ProcurationHolder }],
  allowMultipleApplicationsInDraft: true,
  requiredScopes: [ApiScope.recyclingFund],
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
            pendingAction: {
              title: 'corePendingActionMessages.applicationReceivedTitle2222',
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
        entry: ['clearCanceldVehicles'],
        meta: {
          name: States.DRAFT,
          status: 'draft',
          lifecycle: pruneAfterDays(30),
          onEntry: defineTemplateApi({
            action: ApiActions.CREATE_OWNER,
            shouldPersistToExternalData: false,
            throwOnError: false,
          }),
          progress: 0.5,
          onExit: defineTemplateApi({
            action: ApiActions.SEND_APPLICATION,
            throwOnError: true,
          }),
          actionCard: {
            pendingAction: {
              title: 'corePendingActionMessages.applicationReceivedTitle',
              displayStatus: 'success',
            },
            //  description: statesMessages.draftDescription,
            // historyLogs: {
            //  onEvent: DefaultEvents.SUBMIT,
            //  logMessage: coreHistoryMessages.applicationSent,
            // },
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
        on: {
          SUBMIT: [{ target: States.SUBMITTED }],
        },
      },
      [States.SUBMITTED]: {
        meta: {
          name: States.SUBMITTED,
          progress: 1,
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
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: { target: States.DRAFT },
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      clearCanceledVehicles: assign((context) => {
        const { application } = context
        unset(application.answers, 'vehicles.canceledVehicles')
        return context
      }),
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    return Roles.APPLICANT
  },
  answerValidators,
}

export default CarRecyclingTemplate
