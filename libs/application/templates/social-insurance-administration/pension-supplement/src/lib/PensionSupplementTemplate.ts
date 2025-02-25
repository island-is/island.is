import { assign } from 'xstate'
import set from 'lodash/set'
import unset from 'lodash/unset'
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
  NationalRegistryUserApi,
  defineTemplateApi,
  InstitutionNationalIds,
  UserProfileApi,
} from '@island.is/application/types'
import {
  coreMessages,
  pruneAfterDays,
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import { dataSchema } from './dataSchema'
import { pensionSupplementFormMessage, statesMessages } from './messages'
import {
  SocialInsuranceAdministrationApplicantApi,
  SocialInsuranceAdministrationCurrenciesApi,
  SocialInsuranceAdministrationIsApplicantEligibleApi,
} from '../dataProviders'
import { getApplicationAnswers, isEligible } from './pensionSupplementUtils'
import {
  BankAccountType,
  Events,
  Roles,
  States,
  Actions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import {
  socialInsuranceAdministrationMessage,
  statesMessages as coreSIAStatesMessages,
} from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { CodeOwners } from '@island.is/shared/constants'

const PensionSupplementTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.PENSION_SUPPLEMENT,
  name: pensionSupplementFormMessage.shared.applicationTitle,
  codeOwner: CodeOwners.Deloitte,
  institution: socialInsuranceAdministrationMessage.shared.institution,
  translationNamespaces:
    ApplicationConfigurations.PensionSupplement.translation,
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
                NationalRegistryUserApi,
                UserProfileApi.configure({
                  params: {
                    validateEmail: true,
                  },
                }),
                SocialInsuranceAdministrationApplicantApi,
                SocialInsuranceAdministrationCurrenciesApi,
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
        exit: ['clearBankAccountInfo', 'clearTemp', 'restoreAnswersFromTemp'],
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
                import('../forms/PensionSupplementForm').then((val) =>
                  Promise.resolve(val.PensionSupplementForm),
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
        exit: ['createTempAnswers'],
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
        },
      },
      [States.TRYGGINGASTOFNUN_IN_REVIEW]: {
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
        },
      },
      [States.ADDITIONAL_DOCUMENTS_REQUIRED]: {
        entry: ['moveAdditionalDocumentRequired'],
        meta: {
          status: 'inprogress',
          name: States.ADDITIONAL_DOCUMENTS_REQUIRED,
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
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: coreSIAStatesMessages.additionalDocumentsAdded,
              },
            ],
          },
          lifecycle: pruneAfterDays(90),
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
        },
      },
      [States.APPROVED]: {
        meta: {
          name: States.APPROVED,
          status: 'approved',
          actionCard: {
            pendingAction: {
              title: coreSIAStatesMessages.applicationApproved,
              content: statesMessages.applicationApprovedDescription,
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
              read: 'all',
            },
          ],
        },
      },
      [States.REJECTED]: {
        meta: {
          name: States.REJECTED,
          status: 'rejected',
          actionCard: {
            historyLogs: [
              {
                // TODO: Þurfum mögulega að breyta þessu þegar við vitum hvernig TR gerir stöðubreytingar
                onEvent: States.REJECTED,
                logMessage: coreSIAStatesMessages.applicationRejected,
              },
            ],
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
      clearBankAccountInfo: assign((context) => {
        const { application } = context
        const { bankAccountType } = getApplicationAnswers(application.answers)

        if (bankAccountType === BankAccountType.ICELANDIC) {
          unset(application.answers, 'paymentInfo.iban')
          unset(application.answers, 'paymentInfo.swift')
          unset(application.answers, 'paymentInfo.bankName')
          unset(application.answers, 'paymentInfo.bankAddress')
          unset(application.answers, 'paymentInfo.currency')
        }

        if (bankAccountType === BankAccountType.FOREIGN) {
          unset(application.answers, 'paymentInfo.bank')
        }
        return context
      }),
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

export default PensionSupplementTemplate
