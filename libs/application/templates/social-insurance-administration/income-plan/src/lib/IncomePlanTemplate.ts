import {
  coreMessages,
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
  pruneAfterDays,
  YES,
} from '@island.is/application/core'
import {
  Actions,
  defaultIncomeTypes,
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
  UserProfileApi,
} from '@island.is/application/types'
import { CodeOwners } from '@island.is/shared/constants'
import isEmpty from 'lodash/isEmpty'
import set from 'lodash/set'
import unset from 'lodash/unset'
import { assign } from 'xstate'
import {
  SocialInsuranceAdministrationCategorizedIncomeTypesApi,
  SocialInsuranceAdministrationCurrenciesApi,
  SocialInsuranceAdministrationIncomePlanConditionsApi,
  SocialInsuranceAdministrationIsApplicantEligibleApi,
  SocialInsuranceAdministrationLatestIncomePlan,
  SocialInsuranceAdministrationWithholdingTaxApi,
} from '../dataProviders'
import { dataSchema } from './dataSchema'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  isEligible,
} from './incomePlanUtils'
import {
  historyMessages,
  incomePlanFormMessage,
  statesMessages,
} from './messages'
import { ApiScope } from '@island.is/auth/scopes'
import { AuthDelegationType } from '@island.is/shared/types'

const IncomePlanTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.INCOME_PLAN,
  name: incomePlanFormMessage.shared.applicationTitle,
  codeOwner: CodeOwners.Deloitte,
  institution: socialInsuranceAdministrationMessage.shared.institution,
  translationNamespaces: ApplicationConfigurations.IncomePlan.translation,
  dataSchema,
  requiredScopes: [ApiScope.socialInsuranceAdministration],
  allowedDelegations: [
    {
      type: AuthDelegationType.Custom,
    },
  ],
  allowMultipleApplicationsInDraft: false,
  newApplicationButtonLabel: historyMessages.newIncomePlanButtonLabel,
  applicationText: historyMessages.incomePlanPageTitle,
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
                SocialInsuranceAdministrationIncomePlanConditionsApi,
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
        exit: ['unsetIncomePlan'],
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
            historyButton: statesMessages.pendingActionButton,
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
          [DefaultEvents.ABORT]: { target: States.TRYGGINGASTOFNUN_SUBMITTED },
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
              button: statesMessages.pendingActionButton,
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
          INREVIEW: {
            target: States.TRYGGINGASTOFNUN_IN_REVIEW,
          },
        },
      },
      [States.TRYGGINGASTOFNUN_IN_REVIEW]: {
        meta: {
          name: States.TRYGGINGASTOFNUN_IN_REVIEW,
          status: 'inprogress',
          lifecycle: pruneAfterDays(365),
          actionCard: {
            tag: {
              label: coreMessages.tagsInProgress,
            },
            pendingAction: {
              title: statesMessages.tryggingastofnunInReviewTitle,
              content: statesMessages.tryggingastofnunInReviewContent,
              displayStatus: 'info',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              read: 'all',
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
          [DefaultEvents.APPROVE]: { target: States.COMPLETED },
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: States.COMPLETED,
          status: 'completed',
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            tag: {
              label: coreMessages.tagsDone,
            },
            pendingAction: {
              title: statesMessages.incomePlanProcessed,
              content: statesMessages.incomePlanProcessedDescription,
              displayStatus: 'success',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
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
        const { latestIncomePlan } = getApplicationExternalData(
          application.externalData,
        )

        if (isEmpty(latestIncomePlan)) {
          set(answers, 'incomePlanTable', defaultIncomeTypes)
        }

        if (latestIncomePlan && latestIncomePlan.status === 'Accepted') {
          latestIncomePlan.incomeTypeLines.forEach((income, i) => {
            set(
              answers,
              `incomePlanTable[${i}].incomeType`,
              income.incomeTypeName,
            )
            set(
              answers,
              `incomePlanTable[${i}].incomePerYear`,
              String(income.totalSum),
            )
            set(answers, `incomePlanTable[${i}].currency`, income.currency)
            set(answers, `incomePlanTable[${i}].income`, RatioType.YEARLY)
            set(
              answers,
              `incomePlanTable[${i}].incomeCategory`,
              income.incomeCategoryName,
            )
          })
        }
        //Temporarily removing this until withholdingTax endpoint provides more accurate info
        // } else {
        //   withholdingTax &&
        //     withholdingTax.incomeTypes?.forEach((income, i) => {
        //       set(
        //         answers,
        //         `incomePlanTable[${i}].incomeType`,
        //         income.incomeTypeName,
        //       )
        //       set(
        //         answers,
        //         `incomePlanTable[${i}].incomePerYear`,
        //         String(income.total),
        //       )
        //       set(answers, `incomePlanTable[${i}].currency`, ISK)
        //       set(answers, `incomePlanTable[${i}].income`, RatioType.YEARLY)
        //       set(
        //         answers,
        //         `incomePlanTable[${i}].incomeCategory`,
        //         income.categoryName,
        //       )

        //       set(
        //         answers,
        //         `incomePlanTable[${i}].january`,
        //         String(income.january),
        //       )
        //       set(
        //         answers,
        //         `incomePlanTable[${i}].february`,
        //         String(income.february),
        //       )
        //       set(answers, `incomePlanTable[${i}].march`, String(income.march))
        //       set(answers, `incomePlanTable[${i}].april`, String(income.april))
        //       set(answers, `incomePlanTable[${i}].may`, String(income.may))
        //       set(answers, `incomePlanTable[${i}].june`, String(income.june))
        //       set(answers, `incomePlanTable[${i}].july`, String(income.july))
        //       set(
        //         answers,
        //         `incomePlanTable[${i}].august`,
        //         String(income.august),
        //       )
        //       set(
        //         answers,
        //         `incomePlanTable[${i}].september`,
        //         String(income.september),
        //       )
        //       set(
        //         answers,
        //         `incomePlanTable[${i}].october`,
        //         String(income.october),
        //       )
        //       set(
        //         answers,
        //         `incomePlanTable[${i}].november`,
        //         String(income.november),
        //       )
        //       set(
        //         answers,
        //         `incomePlanTable[${i}].december`,
        //         String(income.december),
        //       )
        //     })
        // }

        return context
      }),
      unsetIncomePlan: assign((context) => {
        const { application } = context
        const { answers } = application
        const { incomePlan } = getApplicationAnswers(answers)

        incomePlan.forEach((income, index) => {
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
