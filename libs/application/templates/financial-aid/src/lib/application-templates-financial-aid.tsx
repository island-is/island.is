import './application-templates-financial-aid.module.scss'

import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  DefaultEvents,
  ApplicationConfigurations,
} from '@island.is/application/core'

import * as z from 'zod'

const States = {
  apply: 'apply',
}

type Events = { type: DefaultEvents.SUBMIT }

const applicationName = 'Umsókn um fjárhagsaðstoð'

enum Roles {
  APPLICANT = 'applicant',
}

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
  name: applicationName,
  translationNamespaces: [ApplicationConfigurations.ExampleForm.translation],
  dataSchema: z.object({}),
  stateMachineConfig: {
    initial: States.apply,
    states: {
      [States.apply]: {
        meta: {
          name: applicationName,
          lifecycle: pruneAfter(oneYear),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Apply').then((module) =>
                  Promise.resolve(module.Apply),
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
