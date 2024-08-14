import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
  pruneAfterDays,
} from '@island.is/application/core'
import {
  Events,
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
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import set from 'lodash/set'
import { assign } from 'xstate'
import {
  SocialInsuranceAdministrationCategorizedIncomeTypesApi,
  SocialInsuranceAdministrationCurrenciesApi,
  SocialInsuranceAdministrationIsApplicantEligibleApi,
  SocialInsuranceAdministrationLatestIncomePlan,
  SocialInsuranceAdministrationWithholdingTaxApi,
} from '../dataProviders'
import { statesMessages } from '../lib/messages'
import { dataSchema } from './dataSchema'
import { getApplicationExternalData, isEligible } from './incomePlanUtils'
import { historyMessages, incomePlanFormMessage } from './messages'

const IncomePlanTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.INCOME_PLAN,
  name: incomePlanFormMessage.shared.applicationTitle,
  institution: socialInsuranceAdministrationMessage.shared.institution,
  translationNamespaces: ApplicationConfigurations.IncomePlan.translation,
  dataSchema,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        exit: ['populateIncomeTable'],
        meta: {
          name: States.PREREQUISITES,
          status: 'draft',
          actionCard: {
            historyLogs: [
              {
                logMessage: historyMessages.incomePlanStarted,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Prerequisites').then((val) =>
                  Promise.resolve(val.PrerequisitesForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: statesMessages.externalDataSubmitButton,
                  type: 'primary',
                },
              ],
              write: 'all',
              api: [
                NationalRegistryUserApi,
                UserProfileApi.configure({
                  params: {
                    validateEmail: true,
                  },
                }),
                SocialInsuranceAdministrationCategorizedIncomeTypesApi,
                SocialInsuranceAdministrationCurrenciesApi,
                SocialInsuranceAdministrationWithholdingTaxApi,
                SocialInsuranceAdministrationLatestIncomePlan,
                SocialInsuranceAdministrationIsApplicantEligibleApi,
              ],
              delete: true,
            },
          ],
        },
        on: {
          SUBMIT: [
            {
              target: States.DRAFT,
              cond: (application) =>
                isEligible(application?.application?.externalData),
            },
            {
              actions: 'setApproveExternalData',
            },
          ],
        },
      },
      [States.DRAFT]: {
        meta: {
          name: States.DRAFT,
          status: 'draft',
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            tag: {
              label: coreSIAStatesMessages.inProgressTag,
            },
            historyLogs: {
              onEvent: DefaultEvents.SUBMIT,
              logMessage: historyMessages.incomePlanSent,
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/IncomePlanForm').then((val) =>
                  Promise.resolve(val.IncomePlanForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          SUBMIT: [{ target: States.TRYGGINGASTOFNUN_SUBMITTED }],
        },
      },
      [States.TRYGGINGASTOFNUN_SUBMITTED]: {
        meta: {
          name: States.TRYGGINGASTOFNUN_SUBMITTED,
          status: 'inprogress',
          lifecycle: pruneAfterDays(365),
          actionCard: {
            tag: {
              label: coreSIAStatesMessages.pendingTag,
            },
            pendingAction: {
              title: statesMessages.tryggingastofnunSubmittedTitle,
              content: statesMessages.tryggingastofnunSubmittedContent,
              displayStatus: 'info',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.EDIT,
                logMessage: statesMessages.incomePlanEdited,
              },
            ],
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              actions: [
                {
                  event: DefaultEvents.EDIT,
                  name: incomePlanFormMessage.confirm.buttonEdit,
                  type: 'primary',
                },
              ],
              read: 'all',
              write: 'all',
            },
            {
              id: Roles.ORGANIZATION_REVIEWER,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: { target: States.DRAFT },
          // INREVIEW: {
          //   target: States.TRYGGINGASTOFNUN_IN_REVIEW,
          // },
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      populateIncomeTable: assign((context) => {
        const { application } = context
        const { answers } = application
        const { withholdingTax, latestIncomePlan } = getApplicationExternalData(
          application.externalData,
        )

        if (latestIncomePlan && latestIncomePlan.status === 'Accepted') {
          latestIncomePlan.incomeTypeLines.map((income, i) => {
            set(
              answers,
              `incomePlanTable[${i}].incomeTypes`,
              income.incomeTypeName,
            )
            set(
              answers,
              `incomePlanTable[${i}].incomePerYear`,
              String(income.totalSum),
            )
            set(answers, `incomePlanTable[${i}].currency`, income.currency)
            set(answers, `incomePlanTable[${i}].income`, 'yearly')
            set(
              answers,
              `incomePlanTable[${i}].incomeCategories`,
              income.incomeCategoryName,
            )
          })
        } else {
          withholdingTax &&
            withholdingTax.incomeTypes?.map((income, i) => {
              set(
                answers,
                `incomePlanTable[${i}].incomeTypes`,
                income.incomeTypeName,
              )
              set(
                answers,
                `incomePlanTable[${i}].incomePerYear`,
                String(income.total),
              )
              set(answers, `incomePlanTable[${i}].currency`, 'IKR')
              set(answers, `incomePlanTable[${i}].income`, 'yearly')
              set(
                answers,
                `incomePlanTable[${i}].incomeCategories`,
                income.categoryName,
              )

              set(answers, `incomePlanTable[${i}].january`, income.january)
              set(answers, `incomePlanTable[${i}].february`, income.february)
              set(answers, `incomePlanTable[${i}].march`, income.march)
              set(answers, `incomePlanTable[${i}].april`, income.april)
              set(answers, `incomePlanTable[${i}].may`, income.may)
              set(answers, `incomePlanTable[${i}].june`, income.june)
              set(answers, `incomePlanTable[${i}].july`, income.july)
              set(answers, `incomePlanTable[${i}].august`, income.august)
              set(answers, `incomePlanTable[${i}].september`, income.september)
              set(answers, `incomePlanTable[${i}].october`, income.october)
              set(answers, `incomePlanTable[${i}].november`, income.november)
              set(answers, `incomePlanTable[${i}].december`, income.december)
            })
        }

        return context
      }),
    },
  },
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (id === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default IncomePlanTemplate
