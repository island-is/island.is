import { assign } from 'xstate'
import unset from 'lodash/unset'
import set from 'lodash/set'
import cloneDeep from 'lodash/cloneDeep'

import {
  ApplicationTemplate,
  ApplicationContext,
  ApplicationStateSchema,
  Application,
  ApplicationTypes,
  ApplicationConfigurations,
  ApplicationRole,
  DefaultEvents,
  InstitutionNationalIds,
  defineTemplateApi,
  UserProfileApi,
  NationalRegistryV3UserApi,
} from '@island.is/application/types'
import {
  coreMessages,
  pruneAfterDays,
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'

import {
  NationalRegistryCohabitantsV3Api,
  SocialInsuranceAdministrationApplicantApi,
  SocialInsuranceAdministrationIsApplicantEligibleApi,
} from '../dataProviders'
import {
  Actions,
  Events,
  Roles,
  States,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import {
  additionalSupportForTheElderyFormMessage,
  statesMessages,
} from './messages'
import {
  socialInsuranceAdministrationMessage,
  statesMessages as coreSIAStatesMessages,
} from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { dataSchema } from './dataSchema'
import {
  getApplicationAnswers,
  isEligible,
} from './additionalSupportForTheElderlyUtils'
import { CodeOwners } from '@island.is/shared/constants'

const AdditionalSupportForTheElderlyTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.ADDITIONAL_SUPPORT_FOR_THE_ELDERLY,
  name: additionalSupportForTheElderyFormMessage.shared.applicationTitle,
  codeOwner: CodeOwners.Deloitte,
  institution: socialInsuranceAdministrationMessage.shared.institution,
  translationNamespaces:
    ApplicationConfigurations.AdditionalSupportForTheElderly.translation,
  dataSchema,
  allowMultipleApplicationsInDraft: false,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: States.PREREQUISITES,
          status: 'draft',
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
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              write: 'all',
              api: [
                NationalRegistryV3UserApi,
                NationalRegistryCohabitantsV3Api,
                UserProfileApi.configure({
                  params: {
                    validateEmail: true,
                  },
                }),
                SocialInsuranceAdministrationApplicantApi,
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
        exit: ['clearTemp', 'restoreAnswersFromTemp'],
        meta: {
          name: States.DRAFT,
          status: 'draft',
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            description: coreSIAStatesMessages.draftDescription,
            historyLogs: {
              onEvent: DefaultEvents.SUBMIT,
              logMessage: coreSIAStatesMessages.applicationSent,
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
                import('../forms/AdditionalSupportForTheElderlyForm').then(
                  (val) =>
                    Promise.resolve(val.AdditionalSupportForTheElderlyForm),
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
        entry: ['assignOrganization'],
        exit: ['clearAssignees', 'createTempAnswers'],
        meta: {
          name: States.TRYGGINGASTOFNUN_SUBMITTED,
          status: 'inprogress',
          lifecycle: pruneAfterDays(365),
          actionCard: {
            tag: {
              label: coreSIAStatesMessages.pendingTag,
            },
            pendingAction: {
              title: coreSIAStatesMessages.tryggingastofnunSubmittedTitle,
              content: coreSIAStatesMessages.tryggingastofnunSubmittedContent,
              displayStatus: 'info',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.EDIT,
                logMessage: coreSIAStatesMessages.applicationEdited,
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
          INREVIEW: {
            target: States.TRYGGINGASTOFNUN_IN_REVIEW,
          },
          ADDITIONALDOCUMENTSREQUIRED: {
            target: States.ADDITIONAL_DOCUMENTS_REQUIRED,
          },
          DISMISS: { target: States.DISMISSED },
        },
      },
      [States.TRYGGINGASTOFNUN_IN_REVIEW]: {
        entry: ['assignOrganization'],
        exit: ['clearAssignees'],
        meta: {
          name: States.TRYGGINGASTOFNUN_IN_REVIEW,
          status: 'inprogress',
          lifecycle: pruneAfterDays(365),
          actionCard: {
            pendingAction: {
              title: coreSIAStatesMessages.tryggingastofnunInReviewTitle,
              content: coreSIAStatesMessages.tryggingastofnunInReviewContent,
              displayStatus: 'info',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: coreSIAStatesMessages.additionalDocumentsAdded,
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
          ADDITIONALDOCUMENTSREQUIRED: {
            target: States.ADDITIONAL_DOCUMENTS_REQUIRED,
          },
          DISMISS: { target: States.DISMISSED },
        },
      },
      [States.ADDITIONAL_DOCUMENTS_REQUIRED]: {
        entry: ['assignOrganization', 'moveAdditionalDocumentRequired'],
        exit: ['clearAssignees'],
        meta: {
          name: States.ADDITIONAL_DOCUMENTS_REQUIRED,
          status: 'inprogress',
          lifecycle: pruneAfterDays(90),
          actionCard: {
            tag: {
              label: coreMessages.tagsRequiresAction,
              variant: 'red',
            },
            pendingAction: {
              title: coreSIAStatesMessages.additionalDocumentRequired,
              content:
                coreSIAStatesMessages.additionalDocumentRequiredDescription,
              displayStatus: 'warning',
            },
          },
          onExit: defineTemplateApi({
            action: Actions.SEND_DOCUMENTS,
            namespace: 'SocialInsuranceAdministration',
            triggerEvent: DefaultEvents.SUBMIT,
            throwOnError: true,
          }),
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
          SUBMIT: [{ target: States.TRYGGINGASTOFNUN_IN_REVIEW }],
          DISMISS: { target: States.DISMISSED },
        },
      },
      [States.APPROVED]: {
        meta: {
          name: States.APPROVED,
          status: 'approved',
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            pendingAction: {
              title: coreSIAStatesMessages.applicationApproved,
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
          actionCard: {
            pendingAction: {
              title: coreSIAStatesMessages.applicationRejected,
              content: statesMessages.applicationRejectedDescription,
              displayStatus: 'error',
            },
            historyLogs: [
              {
                // TODO: Þurfum mögulega að breyta þessu þegar við vitum hvernig TR gerir stöðubreytingar
                onEvent: States.REJECTED,
                logMessage: coreSIAStatesMessages.applicationRejected,
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
      },
      [States.DISMISSED]: {
        meta: {
          name: States.DISMISSED,
          status: 'rejected',
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            tag: {
              label: coreSIAStatesMessages.dismissedTag,
            },
            pendingAction: {
              title: statesMessages.asfteDismissed,
              content: statesMessages.asfteDismissedDescription,
              displayStatus: 'error',
            },
            historyLogs: [
              {
                onEvent: States.DISMISSED,
                logMessage: statesMessages.asfteDismissed,
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
      },
    },
  },
  stateMachineOptions: {
    actions: {
      /**
       * Copy the current answers to temp. If the user cancels the edits,
       * we will restore the answers to their original state from temp.
       */
      createTempAnswers: assign((context, event) => {
        if (event.type !== DefaultEvents.EDIT) {
          return context
        }

        const { application } = context
        const { answers } = application

        set(answers, 'tempAnswers', cloneDeep(answers))

        return context
      }),
      /**
       * The user canceled the edits.
       * Restore the answers to their original state from temp.
       */
      restoreAnswersFromTemp: assign((context, event) => {
        if (event.type !== DefaultEvents.ABORT) {
          return context
        }

        const { application } = context
        const { answers } = application
        const { tempAnswers } = getApplicationAnswers(answers)

        if (answers.tempAnswers) {
          Object.assign(answers, tempAnswers)
          unset(answers, 'tempAnswers')
        }

        return context
      }),
      /**
       * The edits were submitted. Clear out temp.
       */
      clearTemp: assign((context, event) => {
        if (event.type !== DefaultEvents.SUBMIT) {
          return context
        }

        const { application } = context
        const { answers } = application

        unset(answers, 'tempAnswers')

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
      moveAdditionalDocumentRequired: assign((context) => {
        const { application } = context
        const { answers } = application
        const { additionalAttachmentsRequired, additionalAttachments } =
          getApplicationAnswers(answers)

        if (additionalAttachmentsRequired) {
          const mergedAdditionalDocumentRequired = [
            ...additionalAttachments,
            ...additionalAttachmentsRequired,
          ]

          set(
            answers,
            'fileUploadAdditionalFiles.additionalDocuments',
            mergedAdditionalDocumentRequired,
          )
          unset(answers, 'fileUploadAdditionalFilesRequired')
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

    const TR_ID = InstitutionNationalIds.TRYGGINGASTOFNUN
    if (id === TR_ID) {
      return Roles.ORGANIZATION_REVIEWER
    }

    return undefined
  },
}

export default AdditionalSupportForTheElderlyTemplate
