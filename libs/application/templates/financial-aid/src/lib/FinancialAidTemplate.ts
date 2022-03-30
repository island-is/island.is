import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  DefaultEvents,
  ApplicationConfigurations,
  Application,
} from '@island.is/application/core'

import { assign } from 'xstate'

import { Roles, ApplicationStates, ONE_DAY, ONE_MONTH } from './constants'

import { application } from './messages'
import { dataSchema } from './dataSchema'
import {
  isMuncipalityNotRegistered,
  hasActiveCurrentApplication,
  hasSpouseCheck,
} from './utils'
import { FAApplication } from '..'

type Events = { type: DefaultEvents.SUBMIT }

const oneMonthLifeCycle = {
  shouldBeListed: true,
  shouldBePruned: true,
  whenToPrune: ONE_MONTH,
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
          SUBMIT: [
            //TODO check if works when national registry works
            {
              target: ApplicationStates.MUNCIPALITYNOTREGISTERED,
              cond: isMuncipalityNotRegistered,
            },
            {
              target: ApplicationStates.DRAFT,
              cond: hasActiveCurrentApplication,
            },
            {
              target: ApplicationStates.SUBMITTED,
            },
          ],
          // TODO: Add other states here depending on data received from Veita and þjóðskrá
        },
      },
      [ApplicationStates.DRAFT]: {
        meta: {
          name: application.name.defaultMessage,
          lifecycle: oneMonthLifeCycle,
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
        on: {
          SUBMIT: [
            { target: ApplicationStates.SPOUSE, cond: hasSpouseCheck },
            { target: ApplicationStates.SUBMITTED },
          ],
        },
      },
      [ApplicationStates.SPOUSE]: {
        entry: 'assignToSpouse',
        meta: {
          name: application.name.defaultMessage,
          lifecycle: oneMonthLifeCycle,
          roles: [
            {
              id: Roles.SPOUSE,
              formLoader: () =>
                import('../forms/Spouse').then((module) =>
                  Promise.resolve(module.Spouse),
                ),
              read: 'all',
              write: {
                answers: [
                  'spouseIncome',
                  'spouseIncomeFiles',
                  'spouseTaxReturnFiles',
                  'spouseContactInfo',
                  'spouseFormComment',
                ],
              },
            },
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/WaitingForSpouse').then((module) =>
                  Promise.resolve(module.WaitingForSpouse),
                ),
            },
          ],
        },
        on: {
          SUBMIT: { target: ApplicationStates.SUBMITTED },
        },
      },
      [ApplicationStates.SUBMITTED]: {
        meta: {
          name: application.name.defaultMessage,
          lifecycle: oneMonthLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Submitted').then((module) =>
                  Promise.resolve(module.Submitted),
                ),
              // TODO: Limit this
              read: 'all',
            },
            {
              id: Roles.SPOUSE,
              formLoader: () =>
                import('../forms/Submitted').then((module) =>
                  Promise.resolve(module.Submitted),
                ),
              // TODO: Limit this
              read: 'all',
            },
          ],
        },
      },
      [ApplicationStates.MUNCIPALITYNOTREGISTERED]: {
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
                import('../forms/MuncipalityNotRegistered').then((module) =>
                  Promise.resolve(module.MuncipalityNotRegistered),
                ),
              write: {
                externalData: ['nationalRegistry'],
              },
              read: {
                externalData: ['nationalRegistry'],
              },
            },
          ],
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      assignToSpouse: assign((context) => {
        const {
          externalData,
          answers,
        } = (context.application as unknown) as FAApplication
        const { applicant } = externalData.nationalRegistry.data
        const spouse =
          applicant.spouse?.nationalId ||
          answers.relationshipStatus.spouseNationalId

        if (spouse) {
          return {
            ...context,
            application: {
              ...context.application,
              assignees: [spouse],
            },
          }
        }
        return { ...context }
      }),
    },
  },

  mapUserToRole(id: string, application: Application) {
    if (id === application.applicant) {
      return Roles.APPLICANT
    }
    if (application.assignees.includes(id)) {
      return Roles.SPOUSE
    }
    return undefined
  },
}

export default FinancialAidTemplate
