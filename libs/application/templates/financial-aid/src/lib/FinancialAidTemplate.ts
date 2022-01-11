import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  DefaultEvents,
  ApplicationConfigurations,
} from '@island.is/application/core'

import { Roles, ApplicationStates } from './constants'

import { application } from './messages'
import { dataSchema } from './dataSchema'
import { Application } from '../forms/Application'

type Events = { type: DefaultEvents.SUBMIT }

const oneYear = 24 * 3600 * 1000 * 365
const oneDay = 24 * 3600 * 1000

const pruneAfter = (time: number) => {
  return {
    shouldBeListed: true,
    shouldBePruned: true,
    whenToPrune: time,
  }
}

const FinancialAidTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  readyForProduction: false,
  type: ApplicationTypes.FINANCIAL_AID,
  name: application.name,
  dataSchema,
  translationNamespaces: [ApplicationConfigurations.ExampleForm.translation],
  stateMachineConfig: {
    initial: ApplicationStates.PREREQUESITES,
    states: {
      [ApplicationStates.PREREQUESITES]: {
        meta: {
          name: application.name.defaultMessage,
          lifecycle: pruneAfter(oneDay),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Prerequesites').then((module) =>
                  Promise.resolve(module.Prerequesites),
                ),
              externalData: ['nationalRegistry'],
            },
          ],
        },
        on: {
          SUBMIT: [{ target: ApplicationStates.DRAFT, cond: true }],
          // TODO: Add other states here depending on data received from Veita and þjóðskrá
        },
      },
      [ApplicationStates.DRAFT]: {
        meta: {
          name: application.name.defaultMessage,
          lifecycle: pruneAfter(oneYear),
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
