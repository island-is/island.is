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
import { Actions } from '../shared'
import { answerValidators } from './answerValidators'
import { DataSchema } from './dataSchema'
import { carRecyclingMessages, statesMessages } from './messages'

import { assign } from 'xstate'
import unset from 'lodash/unset'
import { Features } from '@island.is/feature-flags'

const enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
}
type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.EDIT }

enum Roles {
  APPLICANT = 'applicant',
}

const CarRecyclingTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.CAR_RECYCLING,
  name: carRecyclingMessages.shared.applicationName,
  institution: carRecyclingMessages.shared.institution,
  translationNamespaces: [ApplicationConfigurations.CarRecycling.translation],
  dataSchema: DataSchema,
  featureFlag: Features.carRecyclingApplication,
  allowedDelegations: [{ type: AuthDelegationType.ProcurationHolder }],
  allowMultipleApplicationsInDraft: true,
  requiredScopes: [ApiScope.carRecycling],
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: States.PREREQUISITES,
          status: 'draft',
          lifecycle: pruneAfterDays(1),
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
        entry: ['clearCanceledVehicles'],
        meta: {
          name: States.DRAFT,
          status: 'draft',
          lifecycle: pruneAfterDays(30),
          onEntry: defineTemplateApi({
            action: Actions.CREATE_OWNER,
            shouldPersistToExternalData: false,
            throwOnError: true,
          }),
          onExit: defineTemplateApi({
            action: Actions.SEND_APPLICATION,
            throwOnError: true,
          }),
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
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (id === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
  answerValidators,
}

export default CarRecyclingTemplate
