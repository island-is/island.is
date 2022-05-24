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

import {
  Roles,
  ApplicationStates,
  ONE_DAY,
  ONE_MONTH,
  ApiActions,
} from './constants'

import { application } from './messages'
import { dataSchema } from './dataSchema'
import {
  isMuncipalityNotRegistered,
  hasActiveCurrentApplication,
  hasSpouseCheck,
} from './utils'
import { FAApplication } from '..'

type Events = { type: DefaultEvents.SUBMIT } | { type: DefaultEvents.EDIT }

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
  readyForProduction: true,
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
                externalData: ['nationalRegistry', 'veita', 'taxDataFetch'],
              },
            },
          ],
        },
        on: {
          SUBMIT: [
            {
              target: ApplicationStates.MUNCIPALITYNOTREGISTERED,
              cond: isMuncipalityNotRegistered,
            },
            {
              target: ApplicationStates.SUBMITTED,
              cond: hasActiveCurrentApplication,
            },
            {
              target: ApplicationStates.DRAFT,
            },
          ],
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
              read: 'all',
              write: {
                answers: [
                  'spouse',
                  'relationshipStatus',
                  'homeCircumstances',
                  'student',
                  'employment',
                  'income',
                  'incomeFiles',
                  'taxReturnFiles',
                  'personalTaxCredit',
                  'bankInfo',
                  'contactInfo',
                  'formComment',
                ],
              },
            },
          ],
        },
        on: {
          SUBMIT: [
            {
              target: ApplicationStates.PREREQUISITESSPOUSE,
              cond: hasSpouseCheck,
            },
            { target: ApplicationStates.SUBMITTED },
          ],
        },
      },
      [ApplicationStates.PREREQUISITESSPOUSE]: {
        entry: 'assignToSpouse',
        meta: {
          name: application.name.defaultMessage,
          lifecycle: oneMonthLifeCycle,
          roles: [
            {
              id: Roles.SPOUSE,
              formLoader: () =>
                import('../forms/PrerequisitesSpouse').then((module) =>
                  Promise.resolve(module.PrerequisitesSpouse),
                ),
              read: 'all',
              write: {
                answers: ['approveExternalDataSpouse'],
                externalData: ['taxDataFetchSpouse'],
              },
            },
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ApplicantSubmitted').then((module) =>
                  Promise.resolve(module.ApplicantSubmitted),
                ),
              read: 'all',
            },
          ],
        },
        on: {
          SUBMIT: { target: ApplicationStates.SPOUSE },
        },
      },
      [ApplicationStates.SPOUSE]: {
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
                import('../forms/ApplicantSubmitted').then((module) =>
                  Promise.resolve(module.ApplicantSubmitted),
                ),
              read: 'all',
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
          onEntry: {
            apiModuleAction: ApiActions.CREATEAPPLICATION,
            shouldPersistToExternalData: true,
            externalDataId: 'veita',
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ApplicantSubmitted').then((module) =>
                  Promise.resolve(module.ApplicantSubmitted),
                ),
              read: 'all',
            },
            {
              id: Roles.SPOUSE,
              formLoader: () =>
                import('../forms/SpouseSubmitted').then((module) =>
                  Promise.resolve(module.SpouseSubmitted),
                ),
              read: 'all',
            },
          ],
        },
        on: {
          EDIT: { target: ApplicationStates.SUBMITTED },
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
