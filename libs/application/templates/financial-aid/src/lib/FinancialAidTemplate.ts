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
  isMunicipalityNotRegistered,
  hasActiveCurrentApplication,
  hasSpouseCheck,
} from './utils'
import { FinancialAidAnswers, FinancialAidExternalData } from '..'
import {
  CreateApplicationApi,
  CurrentApplicationApi,
  NationalRegistryUserApi,
  ChildrenCustodyInformationApi,
  NationalRegistrySpouseApi,
  MunicipalityApi,
  TaxDataApi,
  TaxDataSpouseApi,
  SendSpouseEmailApi,
} from '../dataProviders'

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
                import('../forms/PrerequisitesForm').then((module) =>
                  Promise.resolve(module.PrerequisitesForm),
                ),
              write: 'all',
              delete: true,
              api: [
                CurrentApplicationApi,
                NationalRegistryUserApi,
                NationalRegistrySpouseApi,
                ChildrenCustodyInformationApi,
                MunicipalityApi,
                TaxDataApi,
              ],
            },
          ],
        },
        on: {
          SUBMIT: [
            {
              target: ApplicationStates.MUNICIPALITYNOTREGISTERED,
              cond: isMunicipalityNotRegistered,
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
                import('../forms/PrerequisitesSpouseForm').then((module) =>
                  Promise.resolve(module.PrerequisitesSpouseForm),
                ),
              read: 'all',
              write: 'all',
              api: [CurrentApplicationApi, TaxDataSpouseApi],
            },
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ApplicantSubmittedForm').then((module) =>
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
              target: ApplicationStates.SPOUSE,
              cond: hasActiveCurrentApplication,
            },
          ],
          EDIT: { target: ApplicationStates.PREREQUISITESSPOUSE },
        },
      },
      [ApplicationStates.SPOUSE]: {
        meta: {
          name: application.name.defaultMessage,
          status: 'inprogress',
          lifecycle: oneMonthLifeCycle,
          actionCard: {
            description: stateDescriptions.spouse,
          },
          roles: [
            {
              id: Roles.SPOUSE,
              formLoader: () =>
                import('../forms/SpouseForm').then((module) =>
                  Promise.resolve(module.spouseForm),
                ),
              read: 'all',
              write: 'all',
            },
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ApplicantSubmittedForm').then((module) =>
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
                import('../forms/ApplicantSubmittedForm').then((module) =>
                  Promise.resolve(module.ApplicantSubmitted),
                ),
              read: 'all',
              write: 'all',
            },
            {
              id: Roles.SPOUSE,
              formLoader: () =>
                import('../forms/SpouseSubmittedForm').then((module) =>
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
      [ApplicationStates.MUNICIPALITYNOTREGISTERED]: {
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
                import(
                  '../forms/MunicipalityNotRegisteredForm/MunicipalityNotRegistered'
                ).then((module) =>
                  Promise.resolve(module.MunicipalityNotRegistered),
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
        const { externalData, answers } = context.application
        const answersSchema = answers as unknown as FinancialAidAnswers
        const externalDataSchema =
          externalData as unknown as FinancialAidExternalData
        const spouse =
          externalDataSchema.nationalRegistrySpouse.data?.nationalId ||
          answersSchema.relationshipStatus.spouseNationalId

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
