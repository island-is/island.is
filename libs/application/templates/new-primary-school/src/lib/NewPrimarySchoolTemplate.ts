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
  ChildrenCustodyInformationApi,
  DefaultEvents,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import unset from 'lodash/unset'
import { assign } from 'xstate'
import { Events, ReasonForApplicationOptions, Roles, States } from './constants'
import { dataSchema } from './dataSchema'
import { newPrimarySchoolMessages, statesMessages } from './messages'
import {
  getApplicationAnswers,
  hasChildrenThatCanApply,
} from './newPrimarySchoolUtils'
import {
  GetAllKeyOptionsApi,
  GetHealthApi,
  GetTypesApi,
} from '../dataProviders'

const NewPrimarySchoolTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.NEW_PRIMARY_SCHOOL,
  name: newPrimarySchoolMessages.shared.applicationName,
  institution: newPrimarySchoolMessages.shared.institution,
  translationNamespaces: ApplicationConfigurations.NewPrimarySchool.translation,
  dataSchema,
  allowMultipleApplicationsInDraft: true,
  // requiredScopes: [ApiScope.carRecycling], ?? do we need scope for the Primary school application ??
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
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Prerequisites').then((val) =>
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
              api: [
                ChildrenCustodyInformationApi,
                NationalRegistryUserApi,
                UserProfileApi,
                GetTypesApi,
                GetAllKeyOptionsApi,
                GetHealthApi,
              ],
            },
          ],
        },
        on: {
          SUBMIT: [
            {
              target: States.DRAFT,
              cond: (application) =>
                hasChildrenThatCanApply(application?.application),
            },
            {
              actions: 'setApproveExternalData',
            },
          ],
        },
      },
      [States.DRAFT]: {
        exit: [
          'clearApplicationIfReasonForApplication',
          'clearLanguages',
          'clearAllergiesAndIntolerances',
          'clearPublication',
        ],
        meta: {
          name: States.DRAFT,
          status: 'draft',
          lifecycle: pruneAfterDays(30),
          /* onExit: defineTemplateApi({
            action: Actions.SEND_APPLICATION,
            throwOnError: true,
          }),*/
          actionCard: {
            pendingAction: {
              title: 'corePendingActionMessages.applicationReceivedTitle',
              displayStatus: 'success',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/NewPrimarySchoolForm').then((val) =>
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
      /**
       * Clear answers depending on what is selected as reason for application
       */
      clearApplicationIfReasonForApplication: assign((context) => {
        const { application } = context
        const { reasonForApplication } = getApplicationAnswers(
          application.answers,
        )

        // Clear answers if "Moving abroad" is selected as reason for application
        if (
          reasonForApplication === ReasonForApplicationOptions.MOVING_ABROAD
        ) {
          unset(application.answers, 'support')
          unset(application.answers, 'siblings')
          unset(application.answers, 'languages')
          unset(application.answers, 'startDate')
          unset(application.answers, 'photography')
          unset(application.answers, 'allergiesAndIntolerances')
        } else {
          // Clear movingAbroad if "Moving abroad" is not selected as reason for application
          unset(application.answers, 'reasonForApplication.movingAbroad')
        }

        // Clear transferOfLegalDomicile if "Transfer of legal domicile" is not selected as reason for application
        if (
          reasonForApplication !==
          ReasonForApplicationOptions.TRANSFER_OF_LEGAL_DOMICILE
        ) {
          unset(
            application.answers,
            'reasonForApplication.transferOfLegalDomicile',
          )
        }

        // Clear siblings if "Siblings in the same primary school" is not selected as reason for application
        if (
          reasonForApplication !==
          ReasonForApplicationOptions.SIBLINGS_IN_THE_SAME_PRIMARY_SCHOOL
        ) {
          unset(application.answers, 'siblings')
        }
        return context
      }),
      clearLanguages: assign((context) => {
        const { application } = context
        const { otherLanguagesSpokenDaily } = getApplicationAnswers(
          application.answers,
        )
        if (otherLanguagesSpokenDaily === NO) {
          unset(application.answers, 'languages.otherLanguages')
          unset(application.answers, 'languages.icelandicNotSpokenAroundChild')
        }
        return context
      }),
      /**
       * If the user changes his answers,
       * clear selected food allergies and intolerances.
       */
      clearAllergiesAndIntolerances: assign((context) => {
        const { application } = context
        const { hasFoodAllergies, hasFoodIntolerances } = getApplicationAnswers(
          application.answers,
        )

        if (hasFoodAllergies?.length === 0) {
          unset(application.answers, 'allergiesAndIntolerances.foodAllergies')
        }
        if (hasFoodIntolerances?.length === 0) {
          unset(
            application.answers,
            'allergiesAndIntolerances.foodIntolerances',
          )
        }
        return context
      }),
      clearPublication: assign((context) => {
        const { application } = context
        const { photographyConsent } = getApplicationAnswers(
          application.answers,
        )
        if (photographyConsent === NO) {
          unset(application.answers, 'photography.photoSchoolPublication')
          unset(application.answers, 'photography.photoMediaPublication')
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
