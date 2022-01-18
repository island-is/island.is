import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  DefaultEvents,
  ApplicationConfigurations,
} from '@island.is/application/core'

import { Roles, ApplicationStates, ONE_DAY, ONE_MONTH } from './constants'

import { application } from './messages'
import { dataSchema } from './dataSchema'

type Events = { type: DefaultEvents.SUBMIT }

const FinancialAidTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  readyForProduction: false,
  type: ApplicationTypes.FINANCIAL_AID,
  name: application.name,
  dataSchema,
  translationNamespaces: [ApplicationConfigurations.FinancialAid.translation],
  stateMachineConfig: {
    initial: ApplicationStates.PREREQUISITES,
    states: {
      [ApplicationStates.PREREQUISITES]: {
        meta: {
          name: application.name.defaultMessage,
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            whenToPrune: ONE_DAY,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Prerequisites').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              write: {
                answers: ['approveExternalData'],
                externalData: ['nationalRegistry', 'veita'],
              },
            },
          ],
        },
        on: {
          SUBMIT: [{ target: ApplicationStates.DRAFT, cond: () => true }],
          // TODO: Add other states here depending on data received from Veita and þjóðskrá
        },
      },
      [ApplicationStates.DRAFT]: {
        meta: {
          name: application.name.defaultMessage,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: ONE_MONTH,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Application').then((module) =>
                  Promise.resolve(module.Application),
                ),
              // TODO: Limit this
              read: 'all',
              write: 'all',
            },
          ],
        },
      },
    },
  },

  mapUserToRole() {
    return Roles.APPLICANT
  },
}

export default FinancialAidTemplate
