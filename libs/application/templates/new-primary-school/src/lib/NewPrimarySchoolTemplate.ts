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
import { getApplicationAnswers } from './newPrimarySchoolUtils'

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

        // Clear answers if "Moving abroad" is selected as reason for application
        if (
          reasonForApplication === ReasonForApplicationOptions.MOVING_ABROAD
        ) {
          unset(application.answers, 'support')
          unset(application.answers, 'siblings')
          unset(application.answers, 'languages')
          unset(application.answers, 'startDate')
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
      clearPlaceOfResidence: assign((context) => {
        const { application } = context
        const { differentPlaceOfResidence } = getApplicationAnswers(
          application.answers,
        )
        if (differentPlaceOfResidence === NO) {
          unset(application.answers, 'childInfo.placeOfResidence')
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
