import {
  ApplicationConfigurations,
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  DefaultEvents,
  Application,
} from '@island.is/application/types'

import { assign } from 'xstate'

import { Roles, ApplicationStates, ONE_DAY, ONE_MONTH } from './constants'

import { application, stateDescriptions } from './messages'
import { dataSchema } from './dataSchema'
import {
  isMuncipalityNotRegistered,
  hasActiveCurrentApplication,
  hasSpouseCheck,
} from './utils'
import { FAApplication } from '..'
import {
  CreateApplicationApi,
  CurrentApplicationApi,
  NationalRegistryV3UserApi,
  ChildrenCustodyInformationApiV3,
  NationalRegistryV3SpouseApi,
  MunicipalityApi,
  TaxDataApi,
  TaxDataSpouseApi,
  SendSpouseEmailApi,
} from '../dataProviders'
import { CodeOwners } from '@island.is/shared/constants'
import {
  coreHistoryMessages,
  corePendingActionMessages,
} from '@island.is/application/core'

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
  type: ApplicationTypes.FINANCIAL_AID,
  name: application.name,
  codeOwner: CodeOwners.NordaApplications,
  dataSchema,
  translationNamespaces: [ApplicationConfigurations.FinancialAid.translation],
  stateMachineConfig: {
    initial: ApplicationStates.PREREQUISITES,
    states: {
      [ApplicationStates.PREREQUISITES]: {
        meta: {
          name: application.name.defaultMessage,
          status: 'draft',
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
              write: 'all',
              delete: true,
              api: [
                CurrentApplicationApi,
                NationalRegistryV3UserApi,
                NationalRegistryV3SpouseApi,
                ChildrenCustodyInformationApiV3,
                MunicipalityApi,
                TaxDataApi,
              ],
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
          status: 'draft',
          lifecycle: oneMonthLifeCycle,
          actionCard: {
            description: stateDescriptions.draft,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ApplicationForm').then((module) =>
                  Promise.resolve(module.ApplicationForm),
                ),
              read: 'all',
              write: 'all',
              delete: true,
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
          status: 'inprogress',
          lifecycle: oneMonthLifeCycle,
          actionCard: {
            description: stateDescriptions.spouse,
          },
          onEntry: SendSpouseEmailApi,
          roles: [
            {
              id: Roles.SPOUSE,
              formLoader: () =>
                import('../forms/prerequisitesSpouseForm').then((module) =>
                  Promise.resolve(module.PrerequisitesSpouse),
                ),
              read: 'all',
              write: 'all',
              api: [CurrentApplicationApi, TaxDataSpouseApi],
            },
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ApplicantSubmitted').then((module) =>
                  Promise.resolve(module.ApplicantSubmitted),
                ),
              read: 'all',
              delete: true,
            },
          ],
        },
        on: {
          SUBMIT: [
            {
              target: ApplicationStates.SUBMITTED,
              cond: hasActiveCurrentApplication,
            },
            { target: ApplicationStates.SPOUSE },
          ],
        },
      },
      [ApplicationStates.SPOUSE]: {
        meta: {
          name: application.name.defaultMessage,
          status: 'inprogress',
          lifecycle: oneMonthLifeCycle,
          actionCard: {
            description: stateDescriptions.spouse,
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: coreHistoryMessages.applicationApproved,
                includeSubjectAndActor: true,
              },
            ],
            pendingAction: (_, role) => {
              return role === Roles.SPOUSE
                ? {
                    title: corePendingActionMessages.waitingForReviewTitle,
                    content:
                      corePendingActionMessages.youNeedToReviewDescription,
                    displayStatus: 'warning',
                  }
                : {
                    title: corePendingActionMessages.waitingForReviewTitle,
                    content:
                      corePendingActionMessages.waitingForReviewFromSpouseDescription,
                    displayStatus: 'info',
                  }
            },
          },
          roles: [
            {
              id: Roles.SPOUSE,
              formLoader: () =>
                import('../forms/spouseForm').then((module) =>
                  Promise.resolve(module.Spouse),
                ),
              read: 'all',
              write: 'all',
            },
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ApplicantSubmitted').then((module) =>
                  Promise.resolve(module.ApplicantSubmitted),
                ),
              read: 'all',
              delete: true,
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
          status: 'completed',
          lifecycle: oneMonthLifeCycle,
          actionCard: {
            description: stateDescriptions.submitted,
          },
          onEntry: CreateApplicationApi,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ApplicantSubmitted').then((module) =>
                  Promise.resolve(module.ApplicantSubmitted),
                ),
              read: 'all',
              write: 'all',
            },
            {
              id: Roles.SPOUSE,
              formLoader: () =>
                import('../forms/SpouseSubmitted').then((module) =>
                  Promise.resolve(module.SpouseSubmitted),
                ),
              read: 'all',
              write: 'all',
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
          status: 'rejected',
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
              read: 'all',
            },
          ],
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      assignToSpouse: assign((context) => {
        const { externalData, answers } =
          context.application as unknown as FAApplication
        const spouse =
          externalData.nationalRegistrySpouse.data?.nationalId ||
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
