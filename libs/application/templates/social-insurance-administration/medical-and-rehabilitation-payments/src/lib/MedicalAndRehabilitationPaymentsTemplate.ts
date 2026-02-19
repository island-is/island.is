import {
  coreHistoryMessages,
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
  OAPEvents,
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
  InstitutionNationalIds,
  NationalRegistryV3SpouseApi,
  NationalRegistryV3UserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { ApiScope } from '@island.is/auth/scopes'
import { Features } from '@island.is/feature-flags'
import { CodeOwners } from '@island.is/shared/constants'
import { AuthDelegationType } from '@island.is/shared/types'
import set from 'lodash/set'
import unset from 'lodash/unset'
import { assign } from 'xstate'
import {
  SocialInsuranceAdministrationActivitiesOfProfessionsApi,
  SocialInsuranceAdministrationApplicantApi,
  SocialInsuranceAdministrationCategorizedIncomeTypesApi,
  SocialInsuranceAdministrationCurrenciesApi,
  SocialInsuranceAdministrationEctsUnitsApi,
  SocialInsuranceAdministrationEducationLevelsApi,
  SocialInsuranceAdministrationEmploymentStatusesApi,
  SocialInsuranceAdministrationIncomePlanConditionsApi,
  SocialInsuranceAdministrationIsApplicantEligibleApi,
  SocialInsuranceAdministrationMARPApplicationTypeApi,
  SocialInsuranceAdministrationMARPQuestionnairesApi,
  SocialInsuranceAdministrationProfessionsApi,
  SocialInsuranceAdministrationResidenceInformationApi,
} from '../dataProviders'
import {
  getApplicationAnswers,
  isEligible,
} from '../utils/medicalAndRehabilitationPaymentsUtils'
import { dataSchema } from './dataSchema'
import {
  medicalAndRehabilitationPaymentsFormMessage,
  statesMessages,
} from './messages'

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
                NationalRegistryV3UserApi,
                NationalRegistryV3SpouseApi,
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
                SocialInsuranceAdministrationMARPQuestionnairesApi,
                SocialInsuranceAdministrationEctsUnitsApi,
                SocialInsuranceAdministrationResidenceInformationApi,
                SocialInsuranceAdministrationMARPApplicationTypeApi,
                SocialInsuranceAdministrationEducationLevelsApi,
                SocialInsuranceAdministrationEmploymentStatusesApi,
                SocialInsuranceAdministrationProfessionsApi,
                SocialInsuranceAdministrationActivitiesOfProfessionsApi,
              ],
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: [
            {
              target: States.DRAFT,
              cond: (application) =>
                isEligible(application?.application?.externalData),
            },
            {
              target: States.NOT_ELIGIBLE,
            },
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
                import('../forms/NotEligible').then((module) =>
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
              title: coreSIAStatesMessages.tryggingastofnunSubmittedTitle,
              content: statesMessages.applicationSubmittedDescription,
              displayStatus: 'info',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage: coreHistoryMessages.applicationApproved,
              },
              {
                onEvent: DefaultEvents.REJECT,
                logMessage: coreHistoryMessages.applicationRejected,
              },
              {
                onEvent: OAPEvents.DISMISS,
                logMessage: coreSIAStatesMessages.applicationDismissed,
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
              title: statesMessages.applicationApproved,
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
      [States.REJECTED]: {
        meta: {
          name: States.REJECTED,
          status: FormModes.REJECTED,
          actionCard: {
            pendingAction: {
              title: statesMessages.applicationRejected,
              content: statesMessages.applicationRejectedDescription,
              displayStatus: 'error',
            },
          },
          lifecycle: DefaultStateLifeCycle,
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
      [States.DISMISSED]: {
        meta: {
          name: States.DISMISSED,
          status: FormModes.REJECTED,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            tag: {
              label: coreSIAStatesMessages.dismissedTag,
            },
            pendingAction: {
              title: statesMessages.applicationDismissed,
              content: statesMessages.applicationDismissedDescription,
              displayStatus: 'error',
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

export default MedicalAndRehabilitationPaymentsTemplate
