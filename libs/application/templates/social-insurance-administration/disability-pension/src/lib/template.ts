import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  FormModes,
  UserProfileApi,
  ApplicationConfigurations,
  NationalRegistrySpouseApi,
  NationalRegistryUserApi,
  defineTemplateApi,
  IdentityApi,
} from '@island.is/application/types'
import { CodeOwners } from '@island.is/shared/constants'
import { dataSchema } from './dataSchema'
import { socialInsuranceAdministrationMessage, statesMessages} from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
  YES,
  coreHistoryMessages,
  getValueViaPath,
} from '@island.is/application/core'
import { assign } from 'xstate'
import { disabilityPensionFormMessage } from './messages'
import { SocialInsuranceAdministrationCategorizedIncomeTypesApi, SocialInsuranceAdministrationCurrenciesApi, SocialInsuranceAdministrationWithholdingTaxApi, SocialInsuranceAdministrationLatestIncomePlan, SocialInsuranceAdministrationIncomePlanConditionsApi } from '../dataProviders'
import { Actions, Events, INCOME, RatioType, Roles, States, defaultIncomeTypes } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { ApiScope } from '@island.is/auth/scopes'
import set from 'lodash/set'
import unset from 'lodash/unset'
import { IncomePlanRow } from '@island.is/application/templates/social-insurance-administration-core/types'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.DISABILITY_PENSION,
  name: disabilityPensionFormMessage.shared.applicationTitle,
  codeOwner: CodeOwners.Hugsmidjan,
  institution: socialInsuranceAdministrationMessage.shared.institution,
  translationNamespaces: ApplicationConfigurations.DisabilityPension.translation,
  dataSchema,
  allowMultipleApplicationsInDraft: false,
  requiredScopes: [ApiScope.socialInsuranceAdministration],
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        exit: ['populateIncomeTable'],
        meta: {
          name: States.PREREQUISITES,
          status: FormModes.DRAFT,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/prerequisitesForm').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              api: [UserProfileApi, IdentityApi,NationalRegistryUserApi, NationalRegistrySpouseApi, SocialInsuranceAdministrationCategorizedIncomeTypesApi,
              SocialInsuranceAdministrationCurrenciesApi,
              SocialInsuranceAdministrationWithholdingTaxApi,
              SocialInsuranceAdministrationLatestIncomePlan,
              //SocialInsuranceAdministrationIsApplicantEligibleApi,
              SocialInsuranceAdministrationIncomePlanConditionsApi,],
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.DRAFT,
          },
        },
      },
      [States.DRAFT]: {
        exit: ['unsetIncomePlan'],
        meta: {
          name: 'Main form',
          progress: 0.8,
          status: FormModes.DRAFT,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            description: statesMessages.draftDescription,
            historyLogs: {
              onEvent: DefaultEvents.SUBMIT,
              logMessage: coreHistoryMessages.applicationSent,
            },
          },
          onExit: defineTemplateApi({
            action: Actions.SEND_APPLICATION,
            namespace: 'SocialInsuranceAdministration',
            triggerEvent: DefaultEvents.SUBMIT,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/mainForm').then((module) =>
                  Promise.resolve(module.MainForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.APPROVED,
          },
        },
      },
      [States.APPROVED]: {
        meta: {
          name: States.APPROVED,
          status: 'approved',
          actionCard: {
            pendingAction: {
              title: socialInsuranceAdministrationMessage.applicationApproved,
              content: statesMessages.applicationApproved,
              displayStatus: 'success',
            },
          },
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/completedForm').then((module) =>
                  Promise.resolve(module.completedForm),
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
      populateIncomeTable: assign((context) => {
        const { application } = context
        const { answers } = application

        set(answers, 'incomePlanTable', defaultIncomeTypes)

        return context
      }),
      unsetIncomePlan: assign((context) => {
        const { application } = context
        const { answers } = application
        const incomePlan = getValueViaPath<IncomePlanRow[]>(answers, 'incomePlan') ?? []

        incomePlan?.forEach((income, index) => {
          if (
            (income.income === RatioType.MONTHLY &&
              income.incomeCategory === INCOME &&
              income.unevenIncomePerYear?.[0] === YES) ||
            income.income === RatioType.YEARLY
          ) {
            unset(
              application.answers,
              `incomePlanTable[${index}].equalIncomePerMonth`,
            )
            unset(
              application.answers,
              `incomePlanTable[${index}].equalForeignIncomePerMonth`,
            )
          }
          if (
            (income.income === RatioType.MONTHLY &&
              income.unevenIncomePerYear?.[0] !== YES) ||
            income.income === RatioType.YEARLY ||
            income.incomeCategory !== INCOME
          ) {
            unset(application.answers, `incomePlanTable[${index}].january`)
            unset(application.answers, `incomePlanTable[${index}].february`)
            unset(application.answers, `incomePlanTable[${index}].march`)
            unset(application.answers, `incomePlanTable[${index}].april`)
            unset(application.answers, `incomePlanTable[${index}].may`)
            unset(application.answers, `incomePlanTable[${index}].june`)
            unset(application.answers, `incomePlanTable[${index}].july`)
            unset(application.answers, `incomePlanTable[${index}].august`)
            unset(application.answers, `incomePlanTable[${index}].september`)
            unset(application.answers, `incomePlanTable[${index}].october`)
            unset(application.answers, `incomePlanTable[${index}].november`)
            unset(application.answers, `incomePlanTable[${index}].december`)
          }
          if (
            income.income === RatioType.YEARLY ||
            income.incomeCategory !== INCOME
          ) {
            unset(
              application.answers,
              `incomePlanTable[${index}].unevenIncomePerYear`,
            )
          }
        })

        return context
      }),
      clearAssignees: assign((context) => ({
        ...context,
        application: {
          ...context.application,
          assignees: [],
        },
      })),
    },
  },
  mapUserToRole: (
    _nationalId: string,
    _application: Application,
  ): ApplicationRole | undefined => {
    return Roles.APPLICANT
  },
}

export default template
