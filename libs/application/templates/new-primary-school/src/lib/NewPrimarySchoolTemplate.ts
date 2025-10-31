import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
  YES,
  coreHistoryMessages,
  corePendingActionMessages,
} from '@island.is/application/core'
import {
  Application,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  FormModes,
  InstitutionNationalIds,
  NationalRegistryUserApi,
  UserProfileApi,
  defineTemplateApi,
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'
import { CodeOwners } from '@island.is/shared/constants'
import { AuthDelegationType } from '@island.is/shared/types'
import set from 'lodash/set'
import unset from 'lodash/unset'
import { assign } from 'xstate'
import { ChildrenApi, SchoolsApi } from '../dataProviders'
import {
  hasForeignLanguages,
  hasOtherPayer,
  needsPayerApproval,
} from '../utils/conditionUtils'
import {
  ApiModuleActions,
  Events,
  OrganizationSubType,
  ReasonForApplicationOptions,
  Roles,
  States,
} from '../utils/constants'
import {
  determineNameFromApplicationAnswers,
  getApplicationAnswers,
  getApplicationType,
  getSelectedSchoolSubType,
  payerApprovalStatePendingAction,
} from '../utils/newPrimarySchoolUtils'
import { dataSchema } from './dataSchema'
import {
  historyMessages,
  newPrimarySchoolMessages,
  payerApprovalMessages,
  payerRejectedMessages,
  pendingActionMessages,
  statesMessages,
} from './messages'

const NewPrimarySchoolTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.NEW_PRIMARY_SCHOOL,
  name: determineNameFromApplicationAnswers,
  codeOwner: CodeOwners.Deloitte,
  institution: newPrimarySchoolMessages.shared.institution,
  translationNamespaces: ApplicationConfigurations.NewPrimarySchool.translation,
  dataSchema,
  allowedDelegations: [
    {
      type: AuthDelegationType.ProcurationHolder,
    },
  ],
  featureFlag: Features.newPrimarySchool,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
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
          onExit: [
            defineTemplateApi({
              action: ApiModuleActions.getChildInformation,
              externalDataId: 'childInformation',
              throwOnError: true,
            }),
            defineTemplateApi({
              action: ApiModuleActions.getPreferredSchool,
              externalDataId: 'preferredSchool',
              throwOnError: true,
            }),
          ],
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Prerequisites/index').then((val) =>
                  Promise.resolve(val.Prerequisites),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: newPrimarySchoolMessages.pre.startApplication,
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              delete: true,
              api: [
                NationalRegistryUserApi,
                UserProfileApi,
                ChildrenApi,
                SchoolsApi,
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DRAFT },
        },
      },
      [States.DRAFT]: {
        entry: ['setApplicationType'],
        exit: [
          'clearApplicationIfReasonForApplication',
          'clearLanguages',
          'clearAllergiesAndIntolerances',
          'clearSupport',
          'clearExpectedEndDate',
          'clearPayer',
        ],
        meta: {
          name: States.DRAFT,
          status: FormModes.DRAFT,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationSent,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/NewPrimarySchoolForm/index').then((val) =>
                  Promise.resolve(val.NewPrimarySchoolForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: newPrimarySchoolMessages.overview.submitButton,
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
          [DefaultEvents.SUBMIT]: [
            {
              target: States.PAYER_APPROVAL,
              cond: (context) => needsPayerApproval(context?.application),
            },
            {
              target: States.SUBMITTED,
            },
          ],
        },
      },
      [States.PAYER_APPROVAL]: {
        entry: ['assignPayer'],
        exit: ['clearAssignees'],
        meta: {
          name: States.PAYER_APPROVAL,
          status: FormModes.IN_PROGRESS,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            pendingAction: payerApprovalStatePendingAction,
            historyLogs: [
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage: historyMessages.payerApprovalApproved,
              },
              {
                onEvent: DefaultEvents.REJECT,
                logMessage: historyMessages.payerApprovalRejected,
              },
            ],
          },
          onEntry: defineTemplateApi({
            action: ApiModuleActions.assignPayer,
            throwOnError: true,
          }),
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
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/PayerApproval').then((val) =>
                  Promise.resolve(val.PayerApproval),
                ),
              actions: [
                {
                  event: DefaultEvents.REJECT,
                  name: payerApprovalMessages.reject,
                  type: 'reject',
                },
                {
                  event: DefaultEvents.APPROVE,
                  name: payerApprovalMessages.confirm,
                  type: 'primary',
                },
              ],
              read: {
                answers: ['childInfo', 'newSchool'],
                externalData: ['schools'],
              },
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: { target: States.SUBMITTED },
          [DefaultEvents.REJECT]: { target: States.PAYER_REJECTED },
        },
      },
      [States.PAYER_REJECTED]: {
        meta: {
          name: States.PAYER_REJECTED,
          status: FormModes.IN_PROGRESS,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            pendingAction: {
              title: pendingActionMessages.payerRejectedTitle,
              content: pendingActionMessages.payerRejectedDescription,
              displayStatus: 'warning',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.EDIT,
                logMessage: historyMessages.payerRejectedEdit,
              },
            ],
          },
          onEntry: defineTemplateApi({
            action: ApiModuleActions.notifyApplicantOfRejectionFromPayer,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/PayerRejected').then((val) =>
                  Promise.resolve(val.PayerRejected),
                ),
              actions: [
                {
                  event: DefaultEvents.EDIT,
                  name: payerRejectedMessages.edit,
                  type: 'primary',
                },
              ],
              read: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: { target: States.DRAFT },
        },
      },
      [States.SUBMITTED]: {
        entry: ['assignOrganization'],
        exit: ['clearAssignees'],
        meta: {
          name: States.SUBMITTED,
          status: FormModes.IN_PROGRESS,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            tag: {
              label: statesMessages.applicationReceivedTag,
            },
            pendingAction: {
              title: corePendingActionMessages.applicationReceivedTitle,
              content: corePendingActionMessages.applicationReceivedDescription,
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
            ],
          },
          onEntry: defineTemplateApi({
            action: ApiModuleActions.sendApplication,
            throwOnError: true,
          }),
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
        },
      },
      [States.APPROVED]: {
        meta: {
          name: States.APPROVED,
          status: FormModes.APPROVED,
          actionCard: {
            pendingAction: {
              title: coreHistoryMessages.applicationApproved,
              content: pendingActionMessages.applicationApprovedDescription,
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
              title: coreHistoryMessages.applicationRejected,
              content: pendingActionMessages.applicationRejectedDescription,
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
    },
  },
  stateMachineOptions: {
    actions: {
      setApplicationType: assign((context) => {
        const { application } = context

        set(
          application.answers,
          'applicationType',
          getApplicationType(application.answers, application.externalData),
        )

        return context
      }),
      // Clear answers depending on what is selected as reason for application
      clearApplicationIfReasonForApplication: assign((context) => {
        const { application } = context
        const { reasonForApplication } = getApplicationAnswers(
          application.answers,
        )

        // Clear siblings if "Siblings in the same school" is not selected as reason for application
        if (
          reasonForApplication !==
          ReasonForApplicationOptions.SIBLINGS_IN_SAME_SCHOOL
        ) {
          unset(application.answers, 'siblings')
        }
        return context
      }),
      clearLanguages: assign((context) => {
        const { application } = context

        if (!hasForeignLanguages(application.answers)) {
          unset(application.answers, 'languages.selectedLanguages')
          unset(application.answers, 'languages.preferredLanguage')
        }
        return context
      }),
      clearAllergiesAndIntolerances: assign((context) => {
        const { application } = context
        const { hasFoodAllergiesOrIntolerances, hasOtherAllergies } =
          getApplicationAnswers(application.answers)

        if (!hasFoodAllergiesOrIntolerances?.includes(YES)) {
          unset(
            application.answers,
            'healthProtection.foodAllergiesOrIntolerances',
          )
        }
        if (!hasOtherAllergies?.includes(YES)) {
          unset(application.answers, 'healthProtection.otherAllergies')
        }
        if (
          !hasFoodAllergiesOrIntolerances?.includes(YES) &&
          !hasOtherAllergies?.includes(YES)
        ) {
          unset(application.answers, 'healthProtection.usesEpiPen')
        }
        return context
      }),
      clearSupport: assign((context) => {
        const { application } = context
        const {
          hasDiagnoses,
          hasHadSupport,
          hasIntegratedServices,
          hasCaseManager,
        } = getApplicationAnswers(application.answers)

        if (hasDiagnoses !== YES && hasHadSupport !== YES) {
          unset(application.answers, 'support.hasIntegratedServices')
          unset(application.answers, 'support.hasCaseManager')
          unset(application.answers, 'support.caseManager')
        }
        if (hasIntegratedServices !== YES) {
          unset(application.answers, 'support.hasCaseManager')
          unset(application.answers, 'support.caseManager')
        }
        if (hasCaseManager !== YES) {
          unset(application.answers, 'support.caseManager')
        }
        return context
      }),
      clearExpectedEndDate: assign((context) => {
        const { application } = context
        const { temporaryStay } = getApplicationAnswers(application.answers)

        const selectedSchoolSubType = getSelectedSchoolSubType(
          application.answers,
          application.externalData,
        )

        if (
          selectedSchoolSubType !== OrganizationSubType.INTERNATIONAL_SCHOOL &&
          selectedSchoolSubType !==
            OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_SCHOOL &&
          selectedSchoolSubType !==
            OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT
        ) {
          unset(application.answers, 'startingSchool.temporaryStay')
          unset(application.answers, 'startingSchool.expectedEndDate')
        }
        if (
          (selectedSchoolSubType === OrganizationSubType.INTERNATIONAL_SCHOOL ||
          selectedSchoolSubType ===
            OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_SCHOOL ||
          selectedSchoolSubType ===
            OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT) &&
            temporaryStay !== YES
        ) {
          unset(application.answers, 'startingSchool.expectedEndDate')
        }
        return context
      }),
      clearPayer: assign((context) => {
        const { application } = context

        if (!hasOtherPayer(application.answers)) {
          unset(application.answers, 'payer.other')
        }

        return context
      }),
      assignOrganization: assign((context) => {
        const { application } = context
        const MMS_ID =
          InstitutionNationalIds.MIDSTOD_MENNTUNAR_SKOLATHJONUSTU ?? ''

        const assignees = application.assignees
        if (MMS_ID) {
          if (Array.isArray(assignees) && !assignees.includes(MMS_ID)) {
            assignees.push(MMS_ID)
            set(application, 'assignees', assignees)
          } else {
            set(application, 'assignees', [MMS_ID])
          }
        }

        return context
      }),
      assignPayer: assign((context) => {
        const { application } = context
        const { payerNationalId } = getApplicationAnswers(application.answers)

        if (payerNationalId !== undefined && payerNationalId !== '') {
          set(application, 'assignees', [payerNationalId])
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

  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    const { applicant, assignees } = application

    if (nationalId === applicant) {
      return Roles.APPLICANT
    }

    if (
      nationalId === InstitutionNationalIds.MIDSTOD_MENNTUNAR_SKOLATHJONUSTU
    ) {
      return Roles.ORGANIZATION_REVIEWER
    }

    if (assignees.includes(nationalId)) {
      return Roles.ASSIGNEE
    }

    return undefined
  },
}

export default NewPrimarySchoolTemplate
