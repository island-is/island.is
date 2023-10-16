import { assign } from 'xstate'
import unset from 'lodash/unset'
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
  ChildrenCustodyInformationApi,
  NationalRegistrySpouseApi,
} from '@island.is/application/types'

import {
  DefaultStateLifeCycle,
  coreHistoryMessages,
  coreMessages,
  pruneAfterDays,
} from '@island.is/application/core'

import { Events, Roles, States, NO, ChildPensionReason } from './constants'
import { dataSchema } from './dataSchema'
import { childPensionFormMessage, statesMessages } from './messages'
import { answerValidators } from './answerValidators'
import {
  childCustodyLivesWithApplicant,
  getApplicationAnswers,
} from './childPensionUtils'
import { NationalRegistryResidenceHistoryApi } from '../dataProviders'

const ChildPensionTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.CHILD_PENSION,
  name: childPensionFormMessage.shared.applicationTitle,
  institution: childPensionFormMessage.shared.institution,
  translationNamespaces: [ApplicationConfigurations.childPension.translation],
  dataSchema,
  stateMachineConfig: {
    initial: States.PREREQUESITES,
    states: {
      [States.PREREQUESITES]: {
        meta: {
          name: States.PREREQUESITES,
          status: 'draft',
          lifecycle: pruneAfterDays(1),
          progress: 0.25,
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationStarted,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
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
                ChildrenCustodyInformationApi,
                NationalRegistryResidenceHistoryApi,
                NationalRegistrySpouseApi,
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
        exit: [
          'clearChildPensionAddChild',
          'clearParentIsDead',
          'clearParentsPenitentiary',
          'clearChildPensionNotLivesWithApplicant',
          'clearSelectedChildren',
        ],
        meta: {
          name: States.DRAFT,
          status: 'draft',
          lifecycle: pruneAfterDays(30),
          progress: 0.25,
          actionCard: {
            historyLogs: {
              onEvent: DefaultEvents.SUBMIT,
              logMessage: coreHistoryMessages.applicationSent,
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ChildPensionForm').then((val) =>
                  Promise.resolve(val.ChildPensionForm),
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
          progress: 0.75,
          status: 'inprogress',
          lifecycle: DefaultStateLifeCycle,
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
              // TODO: Bæta við 'INREVIEW' history? ('Umsókn tekin í yfirferð / Umsókn úthlutað yfirferðaraðila')
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
              id: Roles.ORGINISATION_REVIEWER,
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
          progress: 0.75,
          status: 'inprogress',
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            pendingAction: {
              title: statesMessages.tryggingastofnunInReviewTitle,
              content: statesMessages.tryggingastofnunInReviewContent,
              displayStatus: 'info',
            },
            historyLogs: [
              // TODO: Þarf ehv history hérna? (allt með pending action sem er lýsandi, mögulega óþarfi að hafa líka history?)
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
            {
              id: Roles.ORGINISATION_REVIEWER,
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
          PENDING: { target: States.PENDING },
          // DISMISSED: { target: States.DISMISSED },
        },
      },
      [States.ADDITIONAL_DOCUMENTS_REQUIRED]: {
        meta: {
          status: 'inprogress',
          name: States.ADDITIONAL_DOCUMENTS_REQUIRED,
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
            // TODO: Bæta við 'SUBMIT' history?
          },
          lifecycle: pruneAfterDays(970),
          progress: 0.5,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/AdditionalDocumentsRequired').then((val) =>
                  Promise.resolve(val.AdditionalDocumentsRequired),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: childPensionFormMessage.fileUpload
                    .additionalDocumentRequiredSubmit,
                  type: 'primary',
                },
              ],
              read: 'all',
              write: 'all',
            },
            {
              id: Roles.ORGINISATION_REVIEWER,
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
      [States.PENDING]: {
        meta: {
          name: States.PENDING,
          progress: 1,
          status: 'inprogress',
          actionCard: {
            tag: {
              label: statesMessages.pendingTag,
            },
            pendingAction: {
              title: statesMessages.applicationPending,
              content: statesMessages.applicationPendingDescription,
              displayStatus: 'info',
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
      // // TODO: Not implemented in Smári yet
      // [States.DISMISSED]: {
      //   meta: {
      //     name: States.DISMISSED,
      //     progress: 1,
      //     status: 'rejected',
      //     actionCard: {
      //       pendingAction: {
      //         title: statesMessages.applicationDismissed,
      //         content: statesMessages.applicationDismissedDescription,
      //         displayStatus: 'error',
      //       },
      //     },
      //     lifecycle: DefaultStateLifeCycle,
      //     roles: [
      //       {
      //         id: Roles.APPLICANT,
      //         formLoader: () =>
      //           import('../forms/InReview').then((val) =>
      //             Promise.resolve(val.InReview),
      //           ),
      //         read: 'all',
      //       },
      //     ],
      //   },
      // },
      [States.APPROVED]: {
        meta: {
          name: States.APPROVED,
          progress: 1,
          status: 'approved',
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
          progress: 1,
          status: 'rejected',
          actionCard: {
            historyLogs: [
              {
                // TODO: Þurfum mögulega að breyta þessu þegar við vitum hvernig TR gerir stöðubreytingar
                onEvent: States.REJECTED,
                logMessage: statesMessages.applicationRejected,
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
            },
          ],
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      clearChildPensionAddChild: assign((context) => {
        const { application } = context
        const { childPensionAddChild } = getApplicationAnswers(
          application.answers,
        )

        if (childPensionAddChild === NO) {
          unset(application.answers, 'registerChildRepeater')
          unset(application.answers, 'fileUpload.maintenance')
        }

        return context
      }),
      clearParentIsDead: assign((context) => {
        const { application } = context
        const { registeredChildren, selectedChildrenInCustody } =
          getApplicationAnswers(application.answers)

        for (const [index, child] of selectedChildrenInCustody.entries()) {
          if (
            child.parentIsDead &&
            !child.reason?.includes(ChildPensionReason.PARENT_IS_DEAD)
          ) {
            unset(
              application.answers,
              `chooseChildren.selectedChildrenInCustody[${index}].parentIsDead`,
            )
          }
        }

        for (const [index, child] of registeredChildren.entries()) {
          if (
            child.parentIsDead &&
            !child.reason?.includes(ChildPensionReason.PARENT_IS_DEAD)
          ) {
            unset(
              application.answers,
              `registerChildRepeater[${index}].parentIsDead`,
            )
          }
        }

        return context
      }),
      clearParentsPenitentiary: assign((context) => {
        const { application } = context
        const { registeredChildren, selectedChildrenInCustody } =
          getApplicationAnswers(application.answers)

        for (const [index, child] of selectedChildrenInCustody.entries()) {
          if (
            child.parentsPenitentiary &&
            !child.reason?.includes(ChildPensionReason.PARENTS_PENITENTIARY)
          ) {
            unset(
              application.answers,
              `chooseChildren.selectedChildrenInCustody[${index}].parentsPenitentiary`,
            )
          }
        }

        for (const [index, child] of registeredChildren.entries()) {
          if (
            child.parentsPenitentiary &&
            !child.reason?.includes(ChildPensionReason.PARENTS_PENITENTIARY)
          ) {
            unset(
              application.answers,
              `registerChildRepeater[${index}].parentsPenitentiary`,
            )
          }
        }

        return context
      }),
      clearChildPensionNotLivesWithApplicant: assign((context) => {
        const { application } = context

        const doesNotLiveWithApplicant = childCustodyLivesWithApplicant(
          application.answers,
          application.externalData,
        )

        if (!doesNotLiveWithApplicant)
          unset(application.answers, 'fileUpload.notLivesWithApplicant')

        return context
      }),
      clearSelectedChildren: assign((context) => {
        const { application } = context

        const { selectedCustodyKids } = getApplicationAnswers(
          application.answers,
        )

        if (selectedCustodyKids.length === 0) {
          unset(application.answers, 'chooseChildren')
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
  answerValidators,
}

export default ChildPensionTemplate
