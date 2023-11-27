import {
  ApplicationTemplate,
  ApplicationContext,
  ApplicationStateSchema,
  Application,
  ApplicationTypes,
  ApplicationConfigurations,
  ApplicationRole,
  DefaultEvents,
  NationalRegistryUserApi,
  UserProfileApi,
  NationalRegistrySpouseApi,
} from '@island.is/application/types'
import {
  coreMessages,
  pruneAfterDays,
  DefaultStateLifeCycle,
} from '@island.is/application/core'
import { Events, Roles, States } from './constants'
import { dataSchema } from './dataSchema'
import { answerValidators } from './answerValidators'
import { householdSupplementFormMessage, statesMessages } from './messages'
import { NationalRegistryCohabitantsApi } from '../dataProviders'
import { assign } from 'xstate'
import set from 'lodash/set'
import unset from 'lodash/unset'
import { getApplicationAnswers } from './householdSupplementUtils'

const HouseholdSupplementTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.HOUSEHOLD_SUPPLEMENT,
  name: householdSupplementFormMessage.shared.applicationTitle,
  institution: householdSupplementFormMessage.shared.institution,
  readyForProduction: false, // hafa þetta svona atm?
  translationNamespaces: [
    ApplicationConfigurations.HouseholdSupplement.translation,
  ],
  dataSchema,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: States.PREREQUISITES,
          status: 'draft',
          lifecycle: pruneAfterDays(1),
          progress: 0.25,
          //onExit: defineTemplateApi - kalla á TR
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
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              write: 'all',
              api: [
                NationalRegistryUserApi,
                UserProfileApi,
                NationalRegistrySpouseApi,
                NationalRegistryCohabitantsApi,
              ],
              delete: true,
            },
          ],
        },
        on: {
          SUBMIT: States.DRAFT,
        },
      },
      [States.DRAFT]: {
        meta: {
          name: States.DRAFT,
          status: 'draft',
          lifecycle: pruneAfterDays(30),
          progress: 0.25,
          actionCard: {
            description: statesMessages.draftDescription,
            historyLogs: {
              onEvent: DefaultEvents.SUBMIT,
              logMessage: statesMessages.applicationSent,
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/HouseholdSupplementForm').then((val) =>
                  Promise.resolve(val.HouseholdSupplementForm),
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
          lifecycle: DefaultStateLifeCycle,
          progress: 0.75,
          actionCard: {
            tag: {
              label: statesMessages.pendingTag,
            },
            pendingAction: {
              title: statesMessages.tryggingastofnunSubmittedTitle,
              content: statesMessages.tryggingastofnunSubmittedContent,
              displayStatus: 'info',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.EDIT,
                logMessage: statesMessages.applicationEdited,
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
                  name: 'Breyta umsókn',
                  type: 'primary',
                },
              ],
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: { target: States.DRAFT },
        },
      },
      [States.TRYGGINGASTOFNUN_IN_REVIEW]: {
        meta: {
          name: States.TRYGGINGASTOFNUN_IN_REVIEW,
          status: 'inprogress',
          lifecycle: DefaultStateLifeCycle,
          progress: 0.75,
          actionCard: {
            pendingAction: {
              title: statesMessages.tryggingastofnunInReviewTitle,
              content: statesMessages.tryggingastofnunInReviewContent,
              displayStatus: 'info',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage: statesMessages.additionalDocumentsAdded,
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
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: { target: States.APPROVED },
          [DefaultEvents.REJECT]: { target: States.REJECTED },
          ADDITIONALDOCUMENTSREQUIRED: {
            target: States.ADDITIONAL_DOCUMENTS_REQUIRED,
          },
        },
      },
      [States.ADDITIONAL_DOCUMENTS_REQUIRED]: {
        entry: ['moveAdditionalDocumentRequired'],
        meta: {
          name: States.ADDITIONAL_DOCUMENTS_REQUIRED,
          status: 'inprogress',
          lifecycle: pruneAfterDays(970),
          progress: 0.5,
          actionCard: {
            tag: {
              label: coreMessages.tagsRequiresAction,
              variant: 'red',
            },
            pendingAction: {
              title: statesMessages.additionalDocumentRequired,
              content: statesMessages.additionalDocumentRequiredDescription,
              displayStatus: 'warning',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/AdditionalDocumentsRequired').then((val) =>
                  Promise.resolve(val.AdditionalDocumentsRequired),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: {
            target: States.TRYGGINGASTOFNUN_IN_REVIEW,
          },
        },
      },
      [States.APPROVED]: {
        meta: {
          name: States.APPROVED,
          status: 'approved',
          lifecycle: DefaultStateLifeCycle,
          progress: 1,
          actionCard: {
            pendingAction: {
              title: statesMessages.applicationApproved,
              content: statesMessages.applicationApprovedDescription,
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
      [States.REJECTED]: {
        meta: {
          name: States.REJECTED,
          status: 'rejected',
          lifecycle: DefaultStateLifeCycle,
          progress: 1,
          actionCard: {
            historyLogs: [
              {
                // TODO: Þurfum mögulega að breyta þessu þegar við vitum hvernig TR gerir stöðubreytingar
                onEvent: States.REJECTED,
                logMessage: statesMessages.applicationRejected,
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
            },
          ],
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      moveAdditionalDocumentRequired: assign((context) => {
        const { application } = context
        const { answers } = application
        const { additionalAttachmentsRequired, additionalAttachments } =
          getApplicationAnswers(answers)
        console.log('additionalAttachments: ', additionalAttachments)
        console.log(
          'additionalAttachmentsRequired: ',
          additionalAttachmentsRequired,
        )
        const mergedAdditionalDocumentRequired = [
          ...additionalAttachments,
          ...additionalAttachmentsRequired,
        ]

        set(
          answers,
          'fileUploadAdditionalFiles.additionalDocuments',
          mergedAdditionalDocumentRequired,
        )
        unset(answers, 'fileUploadAdditionalFiles.additionalDocumentsRequired')

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
  answerValidators,
}

export default HouseholdSupplementTemplate
