import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
  NO,
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
  NationalRegistryUserApi,
  UserProfileApi,
  defineTemplateApi,
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'
import { CodeOwners } from '@island.is/shared/constants'
import unset from 'lodash/unset'
import { assign } from 'xstate'
import { ChildrenApi } from '../dataProviders'
import {
  ApiModuleActions,
  Events,
  ReasonForApplicationOptions,
  Roles,
  SchoolType,
  States,
} from './constants'
import { dataSchema } from './dataSchema'
import { newPrimarySchoolMessages } from './messages'
import {
  determineNameFromApplicationAnswers,
  getApplicationAnswers,
  hasForeignLanguages,
} from './newPrimarySchoolUtils'

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
              order: 0,
            }),
            defineTemplateApi({
              action: ApiModuleActions.getCitizenship,
              externalDataId: 'citizenship',
              order: 1,
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
              delete: true,
              api: [NationalRegistryUserApi, UserProfileApi, ChildrenApi],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DRAFT },
        },
      },
      [States.DRAFT]: {
        exit: [
          'clearApplicationIfReasonForApplication',
          'clearPlaceOfResidence',
          'clearLanguages',
          'clearAllergiesAndIntolerances',
          'clearSupport',
          'clearExpectedEndDate',
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
          onExit: defineTemplateApi({
            action: ApiModuleActions.sendApplication,
            triggerEvent: DefaultEvents.SUBMIT,
            throwOnError: true,
          }),
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
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.SUBMITTED },
        },
      },
      [States.SUBMITTED]: {
        meta: {
          name: States.SUBMITTED,
          status: FormModes.COMPLETED,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            pendingAction: {
              title: corePendingActionMessages.applicationReceivedTitle,
              content: corePendingActionMessages.applicationReceivedDescription,
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
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: { target: States.DRAFT },
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      // Clear answers depending on what is selected as reason for application
      clearApplicationIfReasonForApplication: assign((context) => {
        const { application } = context
        const { reasonForApplication } = getApplicationAnswers(
          application.answers,
        )

        // Clear transferOfLegalDomicile if "Moving legal domicile" is not selected as reason for application
        if (
          reasonForApplication !==
          ReasonForApplicationOptions.MOVING_MUNICIPALITY
        ) {
          unset(
            application.answers,
            'reasonForApplication.transferOfLegalDomicile',
          )
        }

        // Clear siblings if "Siblings in the same school" is not selected as reason for application
        if (
          reasonForApplication !==
          ReasonForApplicationOptions.SIBLINGS_IN_SAME_SCHOOL
        ) {
          unset(application.answers, 'siblings')
        }
        return context
      }),
      clearPlaceOfResidence: assign((context) => {
        const { application } = context
        const { childInfo } = getApplicationAnswers(application.answers)
        if (childInfo?.differentPlaceOfResidence === NO) {
          unset(application.answers, 'childInfo.placeOfResidence')
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
        const { selectedSchoolType, temporaryStay } = getApplicationAnswers(
          application.answers,
        )

        if (selectedSchoolType !== SchoolType.INTERNATIONAL_SCHOOL) {
          unset(application.answers, 'startingSchool.temporaryStay')
          unset(application.answers, 'startingSchool.expectedEndDate')
        }
        if (
          selectedSchoolType === SchoolType.INTERNATIONAL_SCHOOL &&
          temporaryStay !== YES
        ) {
          unset(application.answers, 'startingSchool.expectedEndDate')
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

export default NewPrimarySchoolTemplate
