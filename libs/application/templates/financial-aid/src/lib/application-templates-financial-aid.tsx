import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  DefaultEvents,
  ApplicationConfigurations,
} from '@island.is/application/core'

import { Roles, ApplicationStates } from './constants'

import * as z from 'zod'
import { application } from './messages'
import { dataSchema } from './dataSchema'

type Events = { type: DefaultEvents.SUBMIT }

const applicationName = 'Umsókn um fjárhagsaðstoð'

const oneYear = 24 * 3600 * 1000 * 365

const pruneAfter = (time: number) => {
  return {
    shouldBeListed: true,
    shouldBePruned: true,
    whenToPrune: time,
  }
}

const ApplicationTemplatesFinancialAid: ApplicationTemplate<
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
    initial: ApplicationStates.DRAFT,
    states: {
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

export default ApplicationTemplatesFinancialAid
