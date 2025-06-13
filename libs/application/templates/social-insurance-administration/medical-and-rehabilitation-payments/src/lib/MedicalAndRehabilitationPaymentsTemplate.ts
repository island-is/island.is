import {
  coreHistoryMessages,
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
  YES,
} from '@island.is/application/core'
import {
  defaultIncomeTypes,
  Actions,
  Events,
  INCOME,
  RatioType,
  Roles,
  States,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import {
  statesMessages as coreSIAStatesMessages,
  socialInsuranceAdministrationMessage,
} from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  Application,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  defineTemplateApi,
  FormModes,
  NationalRegistrySpouseApi,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { ApiScope } from '@island.is/auth/scopes'
import { CodeOwners } from '@island.is/shared/constants'
import set from 'lodash/set'
import unset from 'lodash/unset'
import { AuthDelegationType } from '@island.is/shared/types'
import { assign } from 'xstate'
import {
  SocialInsuranceAdministrationApplicantApi,
  SocialInsuranceAdministrationCategorizedIncomeTypesApi,
  SocialInsuranceAdministrationCurrenciesApi,
  SocialInsuranceAdministrationIncomePlanConditionsApi,
  SocialInsuranceAdministrationIsApplicantEligibleApi,
  SocialInsuranceAdministrationQuestionnairesApi,
} from '../dataProviders'
import { dataSchema } from './dataSchema'
import { getApplicationAnswers } from '../utils/medicalAndRehabilitationPaymentsUtils'
import {
  medicalAndRehabilitationPaymentsFormMessage,
  statesMessages,
} from './messages'
import { Features } from '@island.is/feature-flags'

const MedicalAndRehabilitationPaymentsTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.MEDICAL_AND_REHABILITATION_PAYMENTS,
  name: medicalAndRehabilitationPaymentsFormMessage.shared.applicationTitle,
  codeOwner: CodeOwners.Deloitte,
  institution: socialInsuranceAdministrationMessage.shared.institution,
  translationNamespaces:
    ApplicationConfigurations.MedicalAndRehabilitationPayments.translation,
  dataSchema,
  allowedDelegations: [
    {
      type: AuthDelegationType.Custom,
    },
  ],
  requiredScopes: [ApiScope.socialInsuranceAdministration],
  allowMultipleApplicationsInDraft: false,
  featureFlag: Features.medicalAndRehabilitationPayments,
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
                import('../forms/Prerequisites').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              api: [
                NationalRegistryUserApi,
                NationalRegistrySpouseApi,
                UserProfileApi.configure({
                  params: {
                    validateEmail: true,
                  },
                }),
                SocialInsuranceAdministrationApplicantApi,
                SocialInsuranceAdministrationIsApplicantEligibleApi,
                SocialInsuranceAdministrationCategorizedIncomeTypesApi,
                SocialInsuranceAdministrationCurrenciesApi,
                SocialInsuranceAdministrationIncomePlanConditionsApi,
                SocialInsuranceAdministrationQuestionnairesApi,
              ],
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
          name: States.DRAFT,
          status: FormModes.DRAFT,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            description: coreSIAStatesMessages.draftDescription,
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
                import(
                  '../forms/MedicalAndRehabilitationPaymentsForm/index'
                ).then((module) =>
                  Promise.resolve(module.MedicalAndRehabilitationPaymentsForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
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
              title: coreSIAStatesMessages.applicationApproved,
              content: statesMessages.applicationApprovedDescription,
              displayStatus: 'success',
            },
          },
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((module) =>
                  Promise.resolve(module.InReview),
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
        const { incomePlan } = getApplicationAnswers(answers)

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

export default MedicalAndRehabilitationPaymentsTemplate
