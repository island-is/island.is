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
  InstitutionNationalIds,
} from '@island.is/application/types'
import { CodeOwners } from '@island.is/shared/constants'
import { dataSchema } from './dataSchema'
import {
  socialInsuranceAdministrationMessage as sm,
  statesMessages,
} from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
  YES,
  coreHistoryMessages,
  getValueViaPath,
  pruneAfterDays,
} from '@island.is/application/core'
import { assign } from 'xstate'
import * as m from './messages'
import {
  SocialInsuranceAdministrationCategorizedIncomeTypesApi,
  SocialInsuranceAdministrationCurrenciesApi,
  SocialInsuranceAdministrationWithholdingTaxApi,
  SocialInsuranceAdministrationLatestIncomePlan,
  SocialInsuranceAdministrationIncomePlanConditionsApi,
  SocialInsuranceAdministrationEducationLevelsApi,
  SocialInsuranceAdministrationApplicantApi,
  SocialInsuranceAdministrationCountriesApi,
  SocialInsuranceAdministrationLanguagesApi,
  SocialInsuranceAdministrationSelfAssessmentQuestionsApi,
  SocialInsuranceAdministrationIsApplicantEligibleApi,
  SocialInsuranceAdministrationEmploymentStatusesApi,
  SocialInsuranceAdministrationMaritalStatusesApi,
  SocialInsuranceAdministrationResidenceApi,
  SocialInsuranceAdministrationProfessionActivitiesApi,
  SocialInsuranceAdministrationProfessionsApi,
} from '../dataProviders'
import {
  Actions,
  Events,
  INCOME,
  OAPEvents,
  RatioType,
  Roles,
  States,
  defaultIncomeTypes,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { ApiScope } from '@island.is/auth/scopes'
import set from 'lodash/set'
import unset from 'lodash/unset'
import {
  Eligible,
  IncomePlanRow,
} from '@island.is/application/templates/social-insurance-administration-core/types'
import { AuthDelegationType } from '@island.is/shared/types'
import { Features } from '@island.is/feature-flags'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.DISABILITY_PENSION,
  name: m.shared.applicationTitle,
  codeOwner: CodeOwners.Hugsmidjan,
  institution: sm.shared.institution,
  translationNamespaces:
    ApplicationConfigurations.DisabilityPension.translation,
  dataSchema,
  allowedDelegations: [
    {
      type: AuthDelegationType.Custom,
    },
  ],
  allowMultipleApplicationsInDraft: false,
  requiredScopes: [ApiScope.socialInsuranceAdministration],
  featureFlag: Features.disabilityPension,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        exit: ['populateIncomeTable'],
        meta: {
          name: States.PREREQUISITES,
          status: FormModes.DRAFT,
          lifecycle: EphemeralStateLifeCycle,
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationStarted,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/prerequisitesForm').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              api: [
                IdentityApi,
                UserProfileApi.configure({
                  params: {
                    validateEmail: true,
                  },
                }),
                NationalRegistryUserApi,
                NationalRegistrySpouseApi,
                SocialInsuranceAdministrationApplicantApi,
                SocialInsuranceAdministrationCategorizedIncomeTypesApi,
                SocialInsuranceAdministrationCurrenciesApi,
                SocialInsuranceAdministrationWithholdingTaxApi,
                SocialInsuranceAdministrationLatestIncomePlan,
                SocialInsuranceAdministrationEducationLevelsApi,
                SocialInsuranceAdministrationSelfAssessmentQuestionsApi,
                SocialInsuranceAdministrationCountriesApi,
                SocialInsuranceAdministrationLanguagesApi,
                SocialInsuranceAdministrationEmploymentStatusesApi,
                SocialInsuranceAdministrationMaritalStatusesApi,
                SocialInsuranceAdministrationProfessionActivitiesApi,
                SocialInsuranceAdministrationProfessionsApi,
                SocialInsuranceAdministrationIsApplicantEligibleApi,
                SocialInsuranceAdministrationIncomePlanConditionsApi,
                SocialInsuranceAdministrationResidenceApi,
              ],
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: [
            {
              target: States.DRAFT,
              cond: (application) => {
                const eligible = getValueViaPath<Eligible>(
                  application?.application?.externalData,
                  'socialInsuranceAdministrationIsApplicantEligible.data',
                )
                return !!eligible?.isEligible && eligible.isEligible
              },
            },
            { target: States.NOT_ELIGIBLE },
          ],
        },
      },
      [States.NOT_ELIGIBLE]: {
        meta: {
          name: States.NOT_ELIGIBLE,
          status: FormModes.DRAFT,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/notEligibleForm').then((module) =>
                  Promise.resolve(module.NotEligible),
                ),
              read: 'all',
            },
          ],
        },
      },
      [States.DRAFT]: {
        exit: ['unsetIncomePlan'],
        meta: {
          name: States.DRAFT,
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
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
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
            target: States.TRYGGINGASTOFNUN_SUBMITTED,
          },
        },
      },
      [States.TRYGGINGASTOFNUN_SUBMITTED]: {
        entry: ['assignOrganization'],
        exit: ['clearAssignees'],
        meta: {
          name: States.TRYGGINGASTOFNUN_SUBMITTED,
          status: FormModes.IN_PROGRESS,
          lifecycle: pruneAfterDays(365),
          actionCard: {
            pendingAction: {
              title: statesMessages.tryggingastofnunSubmittedTitle,
              content: m.states.applicationSubmittedDescription,
              displayStatus: 'info',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage: statesMessages.applicationApproved,
              },
              {
                onEvent: DefaultEvents.REJECT,
                logMessage: statesMessages.applicationRejected,
              },
              {
                onEvent: OAPEvents.DISMISS,
                logMessage: statesMessages.applicationDismissed,
              },
            ],
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/inReviewForm').then((module) =>
                  Promise.resolve(module.InReviewForm),
                ),
              read: 'all',
            },
            {
              id: Roles.ORGANIZATION_REVIEWER,
              formLoader: () =>
                import('../forms/inReviewForm').then((module) =>
                  Promise.resolve(module.InReviewForm),
                ),
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: { target: States.APPROVED },
          [DefaultEvents.REJECT]: { target: States.REJECTED },
          DISMISS: { target: States.DISMISSED },
        },
      },
      [States.APPROVED]: {
        meta: {
          name: States.APPROVED,
          status: FormModes.APPROVED,
          actionCard: {
            pendingAction: {
              title: sm.applicationApproved,
              content: statesMessages.applicationApproved,
              displayStatus: 'success',
            },
          },
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/inReviewForm').then((module) =>
                  Promise.resolve(module.InReviewForm),
                ),
              read: 'all',
            },
          ],
        },
      },
      [States.REJECTED]: {
        meta: {
          name: States.REJECTED,
          status: FormModes.REJECTED,
          actionCard: {
            pendingAction: {
              title: sm.applicationRejected,
              content: m.states.applicationRejectedDescription,
              displayStatus: 'error',
            },
          },
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/inReviewForm').then((val) =>
                  Promise.resolve(val.InReviewForm),
                ),
              read: 'all',
            },
          ],
        },
      },
      [States.DISMISSED]: {
        meta: {
          name: States.DISMISSED,
          status: FormModes.REJECTED,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            tag: {
              label: sm.dismissedTag,
            },
            pendingAction: {
              title: m.states.applicationDismissed,
              content: m.states.applicationDismissedDescription,
              displayStatus: 'error',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/inReviewForm').then((val) =>
                  Promise.resolve(val.InReviewForm),
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

        set(answers, 'incomePlan', defaultIncomeTypes)

        return context
      }),
      unsetIncomePlan: assign((context) => {
        const { application } = context
        const { answers } = application
        const incomePlan =
          getValueViaPath<IncomePlanRow[]>(answers, 'incomePlan') ?? []
        incomePlan?.forEach((income, index) => {
          if (
            (income.income === RatioType.MONTHLY &&
              income.incomeCategory === INCOME &&
              income.unevenIncomePerYear?.[0] === YES) ||
            income.income === RatioType.YEARLY
          ) {
            unset(
              application.answers,
              `incomePlan[${index}].equalIncomePerMonth`,
            )
            unset(
              application.answers,
              `incomePlan[${index}].equalForeignIncomePerMonth`,
            )
          }
          if (
            (income.income === RatioType.MONTHLY &&
              income.unevenIncomePerYear?.[0] !== YES) ||
            income.income === RatioType.YEARLY ||
            income.incomeCategory !== INCOME
          ) {
            unset(application.answers, `incomePlan[${index}].january`)
            unset(application.answers, `incomePlan[${index}].february`)
            unset(application.answers, `incomePlan[${index}].march`)
            unset(application.answers, `incomePlan[${index}].april`)
            unset(application.answers, `incomePlan[${index}].may`)
            unset(application.answers, `incomePlan[${index}].june`)
            unset(application.answers, `incomePlan[${index}].july`)
            unset(application.answers, `incomePlan[${index}].august`)
            unset(application.answers, `incomePlan[${index}].september`)
            unset(application.answers, `incomePlan[${index}].october`)
            unset(application.answers, `incomePlan[${index}].november`)
            unset(application.answers, `incomePlan[${index}].december`)
          }
          if (
            income.income === RatioType.YEARLY ||
            income.incomeCategory !== INCOME
          ) {
            unset(
              application.answers,
              `incomePlan[${index}].unevenIncomePerYear`,
            )
          }
        })

        return context
      }),
      assignOrganization: assign((context) => {
        const { application } = context
        const TR_ID = InstitutionNationalIds.TRYGGINGASTOFNUN ?? ''

        const assignees = application.assignees
        if (TR_ID) {
          if (Array.isArray(assignees) && !assignees.includes(TR_ID)) {
            assignees.push(TR_ID)
            set(application, 'assignees', assignees)
          } else {
            set(application, 'assignees', [TR_ID])
          }
        }

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
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined => {
    if (nationalId === application.applicant) {
      return Roles.APPLICANT
    }

    const TR_ID = InstitutionNationalIds.TRYGGINGASTOFNUN
    if (nationalId === TR_ID) {
      return Roles.ORGANIZATION_REVIEWER
    }

    return undefined
  },
}

export default template
