import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
  NO,
  pruneAfterDays,
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
  NationalRegistryUserApi,
  UserProfileApi,
  YES,
  defineTemplateApi,
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'
import unset from 'lodash/unset'
import { assign } from 'xstate'
import { ChildrenApi } from '../dataProviders'
import {
  ApiModuleActions,
  Events,
  ReasonForApplicationOptions,
  Roles,
  States,
} from './constants'
import { dataSchema } from './dataSchema'
import { newPrimarySchoolMessages, statesMessages } from './messages'
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
  institution: newPrimarySchoolMessages.shared.institution,
  translationNamespaces: ApplicationConfigurations.NewPrimarySchool.translation,
  dataSchema,
  allowMultipleApplicationsInDraft: true,
  featureFlag: Features.newPrimarySchool,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: States.PREREQUISITES,
          status: 'draft',
          lifecycle: EphemeralStateLifeCycle,
          actionCard: {
            pendingAction: {
              title: '',
              displayStatus: 'success',
            },
          },
          onExit: defineTemplateApi({
            action: ApiModuleActions.getChildInformation,
            externalDataId: 'childInformation',
            throwOnError: true,
          }),
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
                  name: 'Submit',
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
          SUBMIT: [{ target: States.DRAFT }],
        },
      },
      [States.DRAFT]: {
        exit: [
          'clearApplicationIfReasonForApplication',
          'clearPlaceOfResidence',
          'clearLanguages',
          'clearAllergiesAndIntolerances',
          'clearFreeSchoolMeal',
          'clearSupport',
        ],
        meta: {
          name: States.DRAFT,
          status: 'draft',
          lifecycle: pruneAfterDays(30),
          actionCard: {
            pendingAction: {
              title: 'corePendingActionMessages.applicationReceivedTitle',
              displayStatus: 'success',
            },
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
          SUBMIT: [{ target: States.SUBMITTED }],
        },
      },
      [States.SUBMITTED]: {
        meta: {
          name: States.SUBMITTED,
          status: 'completed',
          actionCard: {
            pendingAction: {
              title: statesMessages.applicationSent,
              content: statesMessages.applicationSentDescription,
              displayStatus: 'success',
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
          unset(application.answers, 'languages.language1')
          unset(application.answers, 'languages.language2')
          unset(application.answers, 'languages.language3')
          unset(application.answers, 'languages.language4')
          unset(application.answers, 'languages.childLanguage')
          unset(application.answers, 'languages.interpreter')
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
            'allergiesAndIntolerances.foodAllergiesOrIntolerances',
          )
        }
        if (!hasOtherAllergies?.includes(YES)) {
          unset(application.answers, 'allergiesAndIntolerances.otherAllergies')
        }
        if (
          !hasFoodAllergiesOrIntolerances?.includes(YES) &&
          !hasOtherAllergies?.includes(YES)
        ) {
          unset(application.answers, 'allergiesAndIntolerances.usesEpiPen')
        }
        return context
      }),
      clearFreeSchoolMeal: assign((context) => {
        const { application } = context
        const { acceptFreeSchoolLunch, hasSpecialNeeds } =
          getApplicationAnswers(application.answers)

        if (acceptFreeSchoolLunch !== YES) {
          unset(application.answers, 'freeSchoolMeal.hasSpecialNeeds')
          unset(application.answers, 'freeSchoolMeal.specialNeedsType')
        }
        if (hasSpecialNeeds !== YES) {
          unset(application.answers, 'freeSchoolMeal.specialNeedsType')
        }
        return context
      }),
      clearSupport: assign((context) => {
        const { application } = context
        const {
          developmentalAssessment,
          specialSupport,
          hasIntegratedServices,
          hasCaseManager,
        } = getApplicationAnswers(application.answers)

        if (developmentalAssessment !== YES && specialSupport !== YES) {
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
