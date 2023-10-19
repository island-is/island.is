import { assign } from 'xstate'
import set from 'lodash/set'
import unset from 'lodash/unset'
import cloneDeep from 'lodash/cloneDeep'

import {
  coreMessages,
  EphemeralStateLifeCycle,
  pruneAfterDays,
  coreHistoryMessages,
} from '@island.is/application/core'
import {
  ApplicationContext,
  ApplicationConfigurations,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTypes,
  ApplicationTemplate,
  Application,
  DefaultEvents,
  defineTemplateApi,
  UserProfileApi,
  PendingAction,
} from '@island.is/application/types'

import {
  YES,
  ApiModuleActions,
  States,
  ParentalRelations,
  NO,
  MANUAL,
  SPOUSE,
  NO_PRIVATE_PENSION_FUND,
  NO_UNION,
  TransferRightsOption,
  SINGLE,
  FileType,
} from '../constants'
import { dataSchema } from './dataSchema'
import { answerValidators } from './answerValidators'
import { parentalLeaveFormMessages, statesMessages } from './messages'
import {
  allEmployersHaveApproved,
  findActionName,
  goToState,
  hasDateOfBirth,
  hasEmployer,
  needsOtherParentApproval,
} from './parentalLeaveTemplateUtils'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getApprovedEmployers,
  getMaxMultipleBirthsDays,
  getMultipleBirthRequestDays,
  getOtherParentId,
  getSelectedChild,
  isParentalGrant,
  isParentWithoutBirthParent,
} from '../lib/parentalLeaveUtils'
import { ChildrenApi, GetPersonInformation } from '../dataProviders'

export enum PLEvents {
  MODIFY = 'MODIFY',
  CLOSED = 'CLOSED',
  ADDITIONALDOCUMENTSREQUIRED = 'ADDITIONALDOCUMENTSREQUIRED',
}

type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ABORT }
  | { type: DefaultEvents.EDIT }
  | { type: 'MODIFY' } // Ex: The user might modify their 'edits'.
  | { type: 'CLOSED' } // Ex: Close application
  | { type: 'ADDITIONALDOCUMENTSREQUIRED' } // Ex: VMST ask for more documents

enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
  ORGINISATION_REVIEWER = 'vmst',
}
const determineNameFromApplicationAnswers = (application: Application) => {
  if (isParentalGrant(application)) {
    return parentalLeaveFormMessages.shared.nameGrant
  }

  return parentalLeaveFormMessages.shared.name
}

const otherParentApprovalStatePendingAction = (
  application: Application,
  role: string,
): PendingAction => {
  if (role === Roles.ASSIGNEE) {
    return {
      title: statesMessages.otherParentRequestApprovalTitle,
      content: statesMessages.otherParentRequestApprovalDescription,
      displayStatus: 'warning',
    }
  } else {
    const applicationAnswers = getApplicationAnswers(application.answers)

    const { isRequestingRights, usePersonalAllowanceFromSpouse } =
      applicationAnswers

    const description =
      isRequestingRights === YES && usePersonalAllowanceFromSpouse === YES
        ? parentalLeaveFormMessages.reviewScreen.otherParentDescRequestingBoth
        : isRequestingRights === YES
        ? parentalLeaveFormMessages.reviewScreen.otherParentDescRequestingRights
        : parentalLeaveFormMessages.reviewScreen
            .otherParentDescRequestingPersonalDiscount

    return {
      title: statesMessages.otherParentApprovalDescription,
      content: description,
      displayStatus: 'info',
    }
  }
}

const employerApprovalStatePendingAction = (
  _: Application,
  role: string,
): PendingAction => {
  if (role === Roles.ASSIGNEE) {
    return {
      title: statesMessages.employerApprovalPendingActionTitle,
      content: statesMessages.employerApprovalPendingActionDescription,
      displayStatus: 'info',
    }
  } else {
    return {
      title: statesMessages.employerWaitingToAssignDescription,
      content: parentalLeaveFormMessages.reviewScreen.employerDesc,
      displayStatus: 'info',
    }
  }
}

const ParentalLeaveTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.PARENTAL_LEAVE,
  name: determineNameFromApplicationAnswers,
  institution: parentalLeaveFormMessages.shared.institution,
  translationNamespaces: [ApplicationConfigurations.ParentalLeave.translation],
  dataSchema,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    entry: (context, event) => {
      // TODO: Configure all old answers objects to the new structure
    },
    states: {
      [States.PREREQUISITES]: {
        exit: [
          'attemptToSetPrimaryParentAsOtherParent',
          'setRightsToOtherParent',
          'setAllowanceToOtherParent',
        ],
        meta: {
          name: States.PREREQUISITES,
          status: 'draft',
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationStarted,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
          lifecycle: pruneAfterDays(9),
          progress: 0.25,
          onExit: defineTemplateApi({
            action: ApiModuleActions.setChildrenInformation,
            externalDataId: 'children',
            throwOnError: true,
          }),
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
              delete: true,
              api: [UserProfileApi, GetPersonInformation, ChildrenApi],
            },
          ],
        },
        on: {
          SUBMIT: States.DRAFT,
        },
      },
      [States.DRAFT]: {
        entry: 'clearAssignees',
        exit: [
          'clearOtherParentDataIfSelectedNo',
          'setOtherParentIdIfSelectedSpouse',
          'setPrivatePensionValuesIfUsePrivatePensionFundIsNO',
          'setUnionValuesIfUseUnionIsNO',
          'clearPersonalAllowanceIfUsePersonalAllowanceIsNo',
          'clearSpouseAllowanceIfUseSpouseAllowanceIsNo',
          'setPersonalUsageToHundredIfUseAsMuchAsPossibleIsYes',
          'setSpouseUsageToHundredIfUseAsMuchAsPossibleIsYes',
          'removeNullPeriod',
          'setNavId',
          'correctTransferRights',
          'clearEmployers',
        ],
        meta: {
          name: States.DRAFT,
          status: 'draft',
          actionCard: {
            description: statesMessages.draftDescription,
            historyLogs: {
              onEvent: DefaultEvents.SUBMIT,
              logMessage: coreHistoryMessages.applicationSent,
            },
          },
          lifecycle: pruneAfterDays(970),
          progress: 0.25,
          onExit: defineTemplateApi({
            action: ApiModuleActions.validateApplication,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ParentalLeaveForm').then((val) =>
                  Promise.resolve(val.ParentalLeaveForm),
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
          SUBMIT: [
            {
              target: States.OTHER_PARENT_APPROVAL,
              cond: needsOtherParentApproval,
            },
            { target: States.EMPLOYER_WAITING_TO_ASSIGN, cond: hasEmployer },
            {
              target: States.VINNUMALASTOFNUN_APPROVAL,
            },
          ],
        },
      },
      [States.OTHER_PARENT_APPROVAL]: {
        entry: ['assignToOtherParent'],
        exit: ['clearAssignees'],
        meta: {
          name: States.OTHER_PARENT_APPROVAL,
          status: 'inprogress',
          actionCard: {
            pendingAction: otherParentApprovalStatePendingAction,
            historyLogs: [
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage: statesMessages.otherParentApproveHistoryLogMessage,
              },
              {
                onEvent: DefaultEvents.EDIT,
                logMessage: statesMessages.editHistoryLogMessage,
              },
              {
                onEvent: DefaultEvents.REJECT,
                logMessage:
                  parentalLeaveFormMessages.draftFlow
                    .draftNotApprovedOtherParentDesc,
              },
            ],
          },
          lifecycle: pruneAfterDays(970),
          progress: 0.4,
          onEntry: defineTemplateApi({
            action: ApiModuleActions.assignOtherParent,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/OtherParentApproval').then((val) =>
                  Promise.resolve(val.OtherParentApproval),
                ),
              actions: [
                {
                  event: DefaultEvents.APPROVE,
                  name: 'Approve',
                  type: 'primary',
                },
                { event: DefaultEvents.REJECT, name: 'Reject', type: 'reject' },
              ],
              read: {
                answers: [
                  'requestRights',
                  'usePersonalAllowanceFromSpouse',
                  'personalAllowanceFromSpouse',
                  'periods',
                ],
              },
              write: {
                answers: [
                  'requestRights',
                  'usePersonalAllowanceFromSpouse',
                  'personalAllowanceFromSpouse',
                  'periods',
                ],
              },
            },
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              read: 'all',
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: [
            {
              target: States.EMPLOYER_WAITING_TO_ASSIGN,
              cond: hasEmployer,
            },
            {
              target: States.VINNUMALASTOFNUN_APPROVAL,
            },
          ],
          [DefaultEvents.EDIT]: { target: States.DRAFT },
          [DefaultEvents.REJECT]: { target: States.OTHER_PARENT_ACTION },
        },
      },
      [States.OTHER_PARENT_ACTION]: {
        entry: 'removePeriodsOrAllowanceOnSpouseRejection',
        meta: {
          name: States.OTHER_PARENT_ACTION,
          status: 'inprogress',
          actionCard: {
            pendingAction: {
              title: statesMessages.otherParentActionPendingActionTitle,
              content: statesMessages.otherParentActionPendingActionContent,
              displayStatus: 'warning',
            },
            historyLogs: {
              onEvent: DefaultEvents.EDIT,
              logMessage: statesMessages.editHistoryLogMessage,
            },
          },
          lifecycle: pruneAfterDays(970),
          progress: 0.4,
          onEntry: defineTemplateApi({
            action: ApiModuleActions.notifyApplicantOfRejectionFromOtherParent,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/DraftRequiresAction').then((val) =>
                  Promise.resolve(val.DraftRequiresAction),
                ),
              read: 'all',
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: { target: States.DRAFT },
        },
      },
      [States.EMPLOYER_WAITING_TO_ASSIGN]: {
        entry: ['clearEmployerNationalRegistryId'],
        exit: 'setEmployerReviewerNationalRegistryId',
        meta: {
          name: States.EMPLOYER_WAITING_TO_ASSIGN,
          status: 'inprogress',
          actionCard: {
            pendingAction: employerApprovalStatePendingAction,
            historyLogs: [
              {
                onEvent: DefaultEvents.EDIT,
                logMessage: statesMessages.editHistoryLogMessage,
              },
            ],
          },
          lifecycle: pruneAfterDays(970),
          progress: 0.4,
          onEntry: defineTemplateApi({
            action: ApiModuleActions.assignEmployer,
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
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.ASSIGN]: { target: States.EMPLOYER_APPROVAL },
          [DefaultEvents.EDIT]: { target: States.DRAFT },
        },
      },
      [States.EMPLOYER_APPROVAL]: {
        entry: ['removeNullPeriod'],
        exit: ['clearAssignees', 'setIsApprovedOnEmployer'],
        meta: {
          name: States.EMPLOYER_APPROVAL,
          status: 'inprogress',
          actionCard: {
            pendingAction: employerApprovalStatePendingAction,
            historyLogs: [
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage:
                  statesMessages.employerApprovalApproveHistoryLogMessage,
              },
              {
                onEvent: DefaultEvents.REJECT,
                logMessage:
                  parentalLeaveFormMessages.draftFlow
                    .draftNotApprovedEmployerDesc,
              },
              {
                onEvent: DefaultEvents.EDIT,
                logMessage: statesMessages.editHistoryLogMessage,
              },
            ],
          },
          lifecycle: pruneAfterDays(970),
          progress: 0.5,
          roles: [
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/EmployerApproval').then((val) =>
                  Promise.resolve(val.EmployerApproval),
                ),
              read: {
                answers: [
                  'periods',
                  'selectedChild',
                  'payments',
                  'firstPeriodStart',
                  'employers',
                  'fileUpload',
                  'noPrimaryParent',
                  'noChildrenFound',
                ],
                externalData: ['children', 'navId', 'sendApplication'],
              },
              write: {
                answers: [
                  'employerNationalRegistryId',
                  'periods',
                  'selectedChild',
                  'payments',
                  'employers',
                ],
              },
              actions: [
                {
                  event: DefaultEvents.APPROVE,
                  name: 'Approve',
                  type: 'primary',
                },
                { event: DefaultEvents.REJECT, name: 'Reject', type: 'reject' },
              ],
            },
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              read: 'all',
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: [
            {
              target: States.VINNUMALASTOFNUN_APPROVAL,
              cond: allEmployersHaveApproved,
            },
            {
              target: States.EMPLOYER_WAITING_TO_ASSIGN,
            },
          ],
          [DefaultEvents.REJECT]: { target: States.EMPLOYER_ACTION },
          [DefaultEvents.EDIT]: { target: States.DRAFT },
        },
      },
      [States.EMPLOYER_ACTION]: {
        meta: {
          name: States.EMPLOYER_ACTION,
          status: 'inprogress',
          actionCard: {
            pendingAction: {
              title: statesMessages.employerActionDescription,
              content: parentalLeaveFormMessages.draftFlow.modifyDraftDesc,
              displayStatus: 'warning',
            },
            historyLogs: {
              onEvent: DefaultEvents.EDIT,
              logMessage: statesMessages.editHistoryLogMessage,
            },
          },
          lifecycle: pruneAfterDays(970),
          progress: 0.5,
          onEntry: defineTemplateApi({
            action: ApiModuleActions.notifyApplicantOfRejectionFromEmployer,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/DraftRequiresAction').then((val) =>
                  Promise.resolve(val.DraftRequiresAction),
                ),
              read: 'all',
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: { target: States.DRAFT },
        },
      },
      [States.VINNUMALASTOFNUN_APPROVAL]: {
        entry: ['assignToVMST', 'setNavId', 'removeNullPeriod'],
        exit: [
          'clearAssignees',
          'setNavId',
          'resetAdditionalDocumentsArray',
          'setPreviousState',
        ],
        meta: {
          name: States.VINNUMALASTOFNUN_APPROVAL,
          status: 'inprogress',
          actionCard: {
            pendingAction: {
              title: statesMessages.vinnumalastofnunApprovalDescription,
              content: parentalLeaveFormMessages.reviewScreen.deptDesc,
              displayStatus: 'info',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage:
                  statesMessages.vinnumalastofnunApprovalApproveHistoryLogMessage,
              },
              {
                onEvent: PLEvents.ADDITIONALDOCUMENTSREQUIRED,
                logMessage:
                  statesMessages.additionalDocumentRequiredDescription,
              },
              {
                onEvent: DefaultEvents.REJECT,
                logMessage:
                  parentalLeaveFormMessages.draftFlow.draftNotApprovedVMLSTDesc,
              },
              {
                onEvent: DefaultEvents.EDIT,
                logMessage: statesMessages.editHistoryLogMessage,
              },
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage:
                  statesMessages.vinnumalastofnunApprovalSubmitHistoryLogMessage,
              },
            ],
          },
          lifecycle: pruneAfterDays(970),
          progress: 0.75,
          onEntry: defineTemplateApi({
            action: ApiModuleActions.sendApplication,
            shouldPersistToExternalData: true,
            throwOnError: true,
          }),
          onExit: defineTemplateApi({
            action: ApiModuleActions.setBirthDate,
            externalDataId: 'dateOfBirth',
            throwOnError: false,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
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
          [DefaultEvents.APPROVE]: { target: States.APPROVED },
          ADDITIONALDOCUMENTSREQUIRED: {
            target: States.ADDITIONAL_DOCUMENTS_REQUIRED,
          },
          [DefaultEvents.REJECT]: { target: States.VINNUMALASTOFNUN_ACTION },
          [DefaultEvents.EDIT]: {
            target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
          },
          SUBMIT: [
            {
              cond: hasDateOfBirth,
              target: States.RESIDENCE_GRAND_APPLICATION,
            },
            {
              target: States.RESIDENCE_GRAND_APPLICATION_NO_BIRTH_DATE,
            },
          ],
        },
      },
      [States.VINNUMALASTOFNUN_APPROVAL_ABORT_CHANGE]: {
        entry: ['assignToVMST', 'removeNullPeriod'],
        exit: ['clearAssignees', 'setPreviousState'],
        meta: {
          name: States.VINNUMALASTOFNUN_APPROVAL_ABORT_CHANGE,
          status: 'inprogress',
          actionCard: {
            pendingAction: {
              title: statesMessages.vinnumalastofnunApprovalDescription,
              content: parentalLeaveFormMessages.reviewScreen.deptDesc,
              displayStatus: 'info',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage:
                  statesMessages.vinnumalastofnunApprovalApproveHistoryLogMessage,
              },
              {
                onEvent: PLEvents.ADDITIONALDOCUMENTSREQUIRED,
                logMessage:
                  statesMessages.additionalDocumentRequiredDescription,
              },
              {
                onEvent: DefaultEvents.REJECT,
                logMessage:
                  parentalLeaveFormMessages.draftFlow.draftNotApprovedVMLSTDesc,
              },
              {
                onEvent: DefaultEvents.EDIT,
                logMessage: statesMessages.editHistoryLogMessage,
              },
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage:
                  statesMessages.vinnumalastofnunApprovalSubmitHistoryLogMessage,
              },
            ],
          },
          lifecycle: pruneAfterDays(970),
          progress: 0.75,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
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
          [DefaultEvents.APPROVE]: { target: States.APPROVED },
          ADDITIONALDOCUMENTSREQUIRED: {
            target: States.ADDITIONAL_DOCUMENTS_REQUIRED,
          },
          [DefaultEvents.REJECT]: { target: States.VINNUMALASTOFNUN_ACTION },
          [DefaultEvents.EDIT]: {
            target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
          },
          SUBMIT: [
            {
              cond: hasDateOfBirth,
              target: States.RESIDENCE_GRAND_APPLICATION,
            },
            {
              target: States.RESIDENCE_GRAND_APPLICATION_NO_BIRTH_DATE,
            },
          ],
        },
      },
      [States.VINNUMALASTOFNUN_ACTION]: {
        meta: {
          name: States.VINNUMALASTOFNUN_ACTION,
          status: 'inprogress',
          actionCard: {
            pendingAction: {
              title: statesMessages.vinnumalastofnunActionDescription,
              content: parentalLeaveFormMessages.draftFlow.modifyDraftDesc,
              displayStatus: 'warning',
            },
            historyLogs: {
              onEvent: DefaultEvents.EDIT,
              logMessage: statesMessages.editHistoryLogMessage,
            },
          },
          lifecycle: pruneAfterDays(970),
          progress: 0.5,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/DraftRequiresAction').then((val) =>
                  Promise.resolve(val.DraftRequiresAction),
                ),
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
        },
      },
      // [States.INREVIEW_ADDITIONAL_DOCUMENTS_REQUIRED]: {
      //   entry: 'assignToVMST',
      //   meta: {
      //     status: 'inprogress',
      //     name: States.INREVIEW_ADDITIONAL_DOCUMENTS_REQUIRED,
      //     actionCard: {
      //       description: statesMessages.additionalDocumentRequiredDescription,
      //     },
      //     lifecycle: pruneAfterDays(970),
      //     progress: 0.5,
      //     roles: [
      //       {
      //         id: Roles.APPLICANT,
      //         formLoader: () =>
      //           import('../forms/InReviewAdditionalDocumentsRequired').then(
      //             (val) =>
      //               Promise.resolve(val.InReviewAdditionalDocumentsRequired),
      //           ),
      //         read: 'all',
      //         write: 'all',
      //       },
      //       {
      //         id: Roles.ORGINISATION_REVIEWER,
      //         formLoader: () =>
      //           import('../forms/InReview').then((val) =>
      //             Promise.resolve(val.InReview),
      //           ),
      //         write: 'all',
      //       },
      //     ],
      //   },
      //   on: {
      //     [DefaultEvents.EDIT]: {
      //       target: States.ADDITIONAL_DOCUMENTS_REQUIRED,
      //     },
      //   },
      // },
      [States.ADDITIONAL_DOCUMENTS_REQUIRED]: {
        entry: 'assignToVMST',
        exit: 'setActionName',
        meta: {
          status: 'inprogress',
          name: States.ADDITIONAL_DOCUMENTS_REQUIRED,
          actionCard: {
            tag: {
              label: coreMessages.tagsRequiresAction,
              variant: 'red',
            },
            pendingAction: {
              title:
                parentalLeaveFormMessages.reviewScreen
                  .additionalDocumentRequiredTitle,
              content: statesMessages.additionalDocumentRequiredDescription,
              displayStatus: 'warning',
            },
            historyLogs: {
              onEvent: DefaultEvents.APPROVE,
              logMessage:
                statesMessages.additionalDocumentRequiredApproveHistoryLogMessage,
            },
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
          [DefaultEvents.APPROVE]: {
            target: States.VINNUMALASTOFNUN_APPROVE_EDITS,
          },
        },
      },
      [States.RESIDENCE_GRAND_APPLICATION_NO_BIRTH_DATE]: {
        entry: ['setPreviousState', 'assignToVMST'],
        exit: 'setPreviousState',
        meta: {
          status: 'inprogress',
          name: States.RESIDENCE_GRAND_APPLICATION_NO_BIRTH_DATE,
          actionCard: {
            pendingAction: {
              title: statesMessages.residenceGrantInProgress,
              content:
                parentalLeaveFormMessages.residenceGrantMessage
                  .residenceGrantClosedDescription,
              displayStatus: 'warning',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.REJECT,
                logMessage: statesMessages.editHistoryLogMessage,
              },
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage: statesMessages.editHistoryLogMessage,
              },
            ],
          },
          lifecycle: pruneAfterDays(970),
          onEntry: defineTemplateApi({
            action: ApiModuleActions.setBirthDate,
            externalDataId: 'dateOfBirth',
            throwOnError: true,
          }),
          progress: 1,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ResidenceGrantNoBirthDate').then((val) =>
                  Promise.resolve(val.ResidenceGrantNoBirthDate),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.REJECT]: [
            {
              cond: (application) => goToState(application, States.APPROVED),
              target: States.APPROVED,
            },
            {
              cond: (application) =>
                goToState(application, States.VINNUMALASTOFNUN_APPROVAL) ||
                goToState(
                  application,
                  States.VINNUMALASTOFNUN_APPROVAL_ABORT_CHANGE,
                ),
              target: States.VINNUMALASTOFNUN_APPROVAL_ABORT_CHANGE,
            },
            {
              target: States.VINNUMALASTOFNUN_APPROVE_EDITS_ABORT,
            },
          ],
          APPROVE: {
            target: States.RESIDENCE_GRAND_APPLICATION,
          },
        },
      },
      [States.RESIDENCE_GRAND_APPLICATION]: {
        entry: ['assignToVMST', 'setResidenceGrant'],
        exit: [
          'setParam',
          'setResidenceGrantPeriod',
          'setPreviousState',
          'setHasAppliedForReidenceGrant',
        ],
        meta: {
          status: 'inprogress',
          name: States.RESIDENCE_GRAND_APPLICATION,

          actionCard: {
            pendingAction: {
              title: statesMessages.residenceGrantInProgress,
              content:
                parentalLeaveFormMessages.residenceGrantMessage
                  .residenceGrantClosedDescription,
              displayStatus: 'warning',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.REJECT,
                logMessage: statesMessages.editHistoryLogMessage,
              },
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage: statesMessages.editHistoryLogMessage,
              },
            ],
          },
          lifecycle: pruneAfterDays(970),
          progress: 1,
          onExit: defineTemplateApi({
            action: ApiModuleActions.validateApplication,
            params: FileType.DOCUMENTPERIOD,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ResidenceGrant').then((val) =>
                  Promise.resolve(val.ResidenceGrant),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          APPROVE: [
            {
              target: States.VINNUMALASTOFNUN_APPROVE_EDITS,
            },
          ],
          REJECT: [
            {
              cond: (application) => goToState(application, States.APPROVED),
              target: States.APPROVED,
            },
            {
              cond: (application) =>
                goToState(application, States.VINNUMALASTOFNUN_APPROVAL) ||
                goToState(
                  application,
                  States.VINNUMALASTOFNUN_APPROVAL_ABORT_CHANGE,
                ),
              target: States.VINNUMALASTOFNUN_APPROVAL_ABORT_CHANGE,
            },
            {
              target: States.VINNUMALASTOFNUN_APPROVE_EDITS_ABORT,
            },
          ],
        },
      },
      // [States.RECEIVED]: {
      //   meta: {
      //     name: States.RECEIVED,
      //     actionCard: {
      //       description: statesMessages.receivedDescription,
      //     },
      //     lifecycle: DEPRECATED_DefaultStateLifeCycle,
      //     progress: 0.8,
      //     roles: [
      //       {
      //         id: Roles.APPLICANT,
      //         formLoader: () =>
      //         import('../forms/InReview').then((val) =>
      //         Promise.resolve(val.InReview),
      //         ),
      //         read: 'all',
      //       },
      //       {
      //         id: Roles.ORGINISATION_REVIEWER,
      //         formLoader: () =>
      //         import('../forms/InReview').then((val) =>
      //         Promise.resolve(val.InReview),
      //         ),
      //         write: 'all',
      //       },
      //     ],
      //   },
      //   on: {
      //     ADDITIONALDOCUMENTSREQUIRED: { target: States.ADDITIONAL_DOCUMENTS_REQUIRED },
      //     [DefaultEvents.APPROVE]: { target: States.APPROVED },
      //     [DefaultEvents.REJECT]: { target: States.VINNUMALASTOFNUN_ACTION },
      //     [DefaultEvents.EDIT]: { target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS },
      //   },
      // },
      [States.APPROVED]: {
        entry: ['assignToVMST', 'removePreviousState'],
        exit: 'setPreviousState',
        meta: {
          name: States.APPROVED,
          status: 'inprogress',
          actionCard: {
            pendingAction: {
              title: statesMessages.approvedDescription,
              content:
                statesMessages.vinnumalastofnunApprovalApproveHistoryLogMessage,
              displayStatus: 'info',
            },
            historyLogs: [
              {
                onEvent: PLEvents.CLOSED,
                logMessage: statesMessages.approvedClosedHistoryLogMessage,
              },
              {
                onEvent: DefaultEvents.EDIT,
                logMessage: statesMessages.editHistoryLogMessage,
              },
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage:
                  statesMessages.vinnumalastofnunApprovalSubmitHistoryLogMessage,
              },
            ],
          },
          lifecycle: pruneAfterDays(970),
          progress: 1,
          onExit: defineTemplateApi({
            action: ApiModuleActions.setBirthDate,
            externalDataId: 'dateOfBirth',
            throwOnError: false,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
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
          CLOSED: { target: States.CLOSED },
          [DefaultEvents.EDIT]: {
            target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
          },
          SUBMIT: [
            {
              target: States.RESIDENCE_GRAND_APPLICATION,
              cond: hasDateOfBirth,
            },
            {
              target: States.RESIDENCE_GRAND_APPLICATION_NO_BIRTH_DATE,
            },
          ],
        },
      },
      [States.CLOSED]: {
        entry: 'clearAssignees',
        meta: {
          name: States.CLOSED,
          status: 'completed',
          actionCard: {
            description: statesMessages.closedDescription,
          },
          lifecycle: EphemeralStateLifeCycle,
          progress: 1,
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
      // Edit Flow States
      [States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS]: {
        entry: [
          'createTempPeriods',
          'removeNullPeriod',
          'setNavId',
          'createTempEmployers',
        ],
        exit: [
          'removeAddedEmployers',
          'removeAddedPeriods',
          'restorePeriodsFromTemp',
          'removeNullPeriod',
          'setNavId',
          'setActionName',
          'clearEmployers',
          'restoreEmployersFromTemp',
        ],
        meta: {
          name: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
          status: 'inprogress',
          actionCard: {
            pendingAction: {
              title: statesMessages.editOrAddPeriodsTitle,
              content: statesMessages.editOrAddPeriodsDescription,
              displayStatus: 'warning',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage:
                  statesMessages.editOrAddPeriodsSubmitHistoryLogMessage,
              },
              {
                onEvent: DefaultEvents.ABORT,
                logMessage:
                  statesMessages.editOrAddPeriodsAbortHistoryLogMessage,
              },
            ],
          },
          lifecycle: pruneAfterDays(970),
          progress: 0.25,
          onExit: defineTemplateApi({
            action: ApiModuleActions.validateApplication,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/EditOrAddEmployersAndPeriods').then((val) =>
                  Promise.resolve(val.EditOrAddEmployersAndPeriods),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          SUBMIT: [
            {
              target: States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
              cond: hasEmployer,
            },
            {
              target: States.VINNUMALASTOFNUN_APPROVE_EDITS,
            },
          ],
          [DefaultEvents.ABORT]: [
            {
              cond: (application) => goToState(application, States.APPROVED),
              target: States.APPROVED,
            },
            {
              cond: (application) =>
                goToState(application, States.VINNUMALASTOFNUN_APPROVAL) ||
                goToState(
                  application,
                  States.VINNUMALASTOFNUN_APPROVAL_ABORT_CHANGE,
                ),
              target: States.VINNUMALASTOFNUN_APPROVAL_ABORT_CHANGE,
            },
            {
              target: States.VINNUMALASTOFNUN_APPROVE_EDITS_ABORT,
            },
          ],
        },
      },
      [States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS]: {
        entry: ['clearEmployerNationalRegistryId'],
        exit: [
          'setEmployerReviewerNationalRegistryId',
          'restorePeriodsFromTemp',
          'restoreEmployersFromTemp',
        ],
        meta: {
          name: States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
          status: 'inprogress',
          actionCard: {
            pendingAction: employerApprovalStatePendingAction,
            historyLogs: [
              {
                onEvent: DefaultEvents.EDIT,
                logMessage: statesMessages.editHistoryLogMessage,
              },
            ],
          },
          lifecycle: pruneAfterDays(970),
          progress: 0.5,
          onEntry: defineTemplateApi({
            action: ApiModuleActions.assignEmployer,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/EditsInReview').then((val) =>
                  Promise.resolve(val.EditsInReview),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.ASSIGN]: { target: States.EMPLOYER_APPROVE_EDITS },
          [DefaultEvents.EDIT]: {
            target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
          },
        },
      },
      [States.EMPLOYER_APPROVE_EDITS]: {
        entry: ['assignToVMST', 'removeNullPeriod'],
        exit: [
          'clearAssignees',
          'setIsApprovedOnEmployer',
          'restorePeriodsFromTemp',
          'restoreEmployersFromTemp',
        ],
        meta: {
          name: States.EMPLOYER_APPROVE_EDITS,
          status: 'inprogress',
          actionCard: {
            pendingAction: employerApprovalStatePendingAction,
            historyLogs: [
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage:
                  statesMessages.employerApprovalApproveHistoryLogMessage,
              },
              {
                onEvent: DefaultEvents.REJECT,
                logMessage:
                  parentalLeaveFormMessages.draftFlow
                    .draftNotApprovedEmployerDesc,
              },
              {
                onEvent: DefaultEvents.EDIT,
                logMessage: statesMessages.editHistoryLogMessage,
              },
            ],
          },
          lifecycle: pruneAfterDays(970),
          progress: 0.5,
          roles: [
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/EmployerApproveEdits').then((val) =>
                  Promise.resolve(val.EmployerApproveEdits),
                ),
              read: {
                answers: [
                  'periods',
                  'selectedChild',
                  'payments',
                  'firstPeriodStart',
                  'employers',
                  'fileUpload',
                  'noPrimaryParent',
                  'noChildrenFound',
                ],
                externalData: ['children', 'navId', 'sendApplication'],
              },
              write: {
                answers: [
                  'employerNationalRegistryId',
                  'periods',
                  'selectedChild',
                  'payments',
                  'employers',
                ],
              },
              actions: [
                {
                  event: DefaultEvents.APPROVE,
                  name: 'Approve',
                  type: 'primary',
                },
                { event: DefaultEvents.REJECT, name: 'Reject', type: 'reject' },
              ],
            },
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/EditsInReview').then((val) =>
                  Promise.resolve(val.EditsInReview),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: [
            {
              target: States.VINNUMALASTOFNUN_APPROVE_EDITS,
              cond: allEmployersHaveApproved,
            },
            {
              target: States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
            },
          ],
          [DefaultEvents.EDIT]: {
            target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
          },
          [DefaultEvents.REJECT]: { target: States.EMPLOYER_EDITS_ACTION },
        },
      },
      [States.EMPLOYER_EDITS_ACTION]: {
        exit: ['restorePeriodsFromTemp', 'restoreEmployersFromTemp'],
        meta: {
          name: States.EMPLOYER_EDITS_ACTION,
          status: 'inprogress',
          actionCard: {
            pendingAction: {
              title: statesMessages.employerEditsActionDescription,
              content:
                parentalLeaveFormMessages.editFlow.editsNotApprovedEmployerDesc,
              displayStatus: 'warning',
            },
            historyLogs: [
              {
                onEvent: PLEvents.MODIFY,
                logMessage: statesMessages.editHistoryLogMessage,
              },
              {
                onEvent: DefaultEvents.ABORT,
                logMessage:
                  statesMessages.editOrAddPeriodsAbortHistoryLogMessage,
              },
            ],
          },
          lifecycle: pruneAfterDays(970),
          progress: 0.5,
          onEntry: defineTemplateApi({
            action: ApiModuleActions.notifyApplicantOfRejectionFromEmployer,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/EditsRequireAction').then((val) =>
                  Promise.resolve(val.EditsRequireAction),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          MODIFY: {
            target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
          },
          [DefaultEvents.ABORT]: { target: States.APPROVED },
        },
      },
      [States.VINNUMALASTOFNUN_APPROVE_EDITS]: {
        entry: [
          'assignToVMST',
          'removeNullPeriod',
          'setHasAppliedForReidenceGrant',
          'setNavId',
        ],
        exit: [
          'clearTemp',
          'resetAdditionalDocumentsArray',
          'clearAssignees',
          'setPreviousState',
          'setNavId',
        ],
        meta: {
          name: States.VINNUMALASTOFNUN_APPROVE_EDITS,
          status: 'inprogress',
          actionCard: {
            pendingAction: {
              title: statesMessages.vinnumalastofnunApprovalDescription,
              content: statesMessages.vinnumalastofnunApproveEditsDescription,
              displayStatus: 'info',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage:
                  statesMessages.vinnumalastofnunApprovalApproveHistoryLogMessage,
              },
              {
                onEvent: PLEvents.ADDITIONALDOCUMENTSREQUIRED,
                logMessage:
                  statesMessages.additionalDocumentRequiredDescription,
              },
              {
                onEvent: DefaultEvents.REJECT,
                logMessage:
                  statesMessages.vinnumalastofnunApproveEditsRejectHistoryLogMessage,
              },
              {
                onEvent: DefaultEvents.EDIT,
                logMessage: statesMessages.editHistoryLogMessage,
              },
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage:
                  statesMessages.vinnumalastofnunApprovalSubmitHistoryLogMessage,
              },
            ],
          },
          lifecycle: pruneAfterDays(970),
          progress: 0.75,

          onEntry: [
            defineTemplateApi({
              action: ApiModuleActions.sendApplication,
              params: FileType.DOCUMENTPERIOD,
              shouldPersistToExternalData: true,
              throwOnError: true,
            }),
          ],
          onExit: defineTemplateApi({
            action: ApiModuleActions.setBirthDate,
            externalDataId: 'dateOfBirth',
            throwOnError: false,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/EditsInReview').then((val) =>
                  Promise.resolve(val.EditsInReview),
                ),
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
          [DefaultEvents.APPROVE]: { target: States.APPROVED },
          ADDITIONALDOCUMENTSREQUIRED: {
            target: States.ADDITIONAL_DOCUMENTS_REQUIRED,
          },
          [DefaultEvents.EDIT]: {
            target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
          },
          [DefaultEvents.REJECT]: {
            target: States.VINNUMALASTOFNUN_EDITS_ACTION,
          },
          SUBMIT: [
            {
              cond: hasDateOfBirth,
              target: States.RESIDENCE_GRAND_APPLICATION,
            },
            {
              target: States.RESIDENCE_GRAND_APPLICATION_NO_BIRTH_DATE,
            },
          ],
        },
      },
      [States.VINNUMALASTOFNUN_APPROVE_EDITS_ABORT]: {
        entry: [
          'assignToVMST',
          'removeNullPeriod',
          'setHasAppliedForReidenceGrant',
        ],
        exit: [
          'resetAdditionalDocumentsArray',
          'clearAssignees',
          'setPreviousState',
        ],
        meta: {
          name: States.VINNUMALASTOFNUN_APPROVE_EDITS,
          status: 'inprogress',
          actionCard: {
            pendingAction: {
              title: statesMessages.vinnumalastofnunApprovalDescription,
              content: statesMessages.vinnumalastofnunApproveEditsDescription,
              displayStatus: 'info',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage:
                  statesMessages.vinnumalastofnunApprovalApproveHistoryLogMessage,
              },
              {
                onEvent: PLEvents.ADDITIONALDOCUMENTSREQUIRED,
                logMessage:
                  statesMessages.additionalDocumentRequiredDescription,
              },
              {
                onEvent: DefaultEvents.REJECT,
                logMessage:
                  statesMessages.vinnumalastofnunApproveEditsRejectHistoryLogMessage,
              },
              {
                onEvent: DefaultEvents.EDIT,
                logMessage: statesMessages.editHistoryLogMessage,
              },
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage:
                  statesMessages.vinnumalastofnunApprovalSubmitHistoryLogMessage,
              },
            ],
          },
          lifecycle: pruneAfterDays(970),
          progress: 0.75,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/EditsInReview').then((val) =>
                  Promise.resolve(val.EditsInReview),
                ),
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
          [DefaultEvents.APPROVE]: { target: States.APPROVED },
          ADDITIONALDOCUMENTSREQUIRED: {
            target: States.ADDITIONAL_DOCUMENTS_REQUIRED,
          },
          [DefaultEvents.EDIT]: {
            target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
          },
          [DefaultEvents.REJECT]: {
            target: States.VINNUMALASTOFNUN_EDITS_ACTION,
          },
          SUBMIT: [
            {
              cond: hasDateOfBirth,
              target: States.RESIDENCE_GRAND_APPLICATION,
            },
            {
              target: States.RESIDENCE_GRAND_APPLICATION_NO_BIRTH_DATE,
            },
          ],
        },
      },
      [States.VINNUMALASTOFNUN_EDITS_ACTION]: {
        exit: ['restorePeriodsFromTemp', 'restoreEmployersFromTemp'],
        meta: {
          name: States.VINNUMALASTOFNUN_EDITS_ACTION,
          status: 'inprogress',
          actionCard: {
            pendingAction: {
              title:
                statesMessages.vinnumalastofnunApproveEditsRejectHistoryLogMessage,
              content:
                parentalLeaveFormMessages.editFlow.editsNotApprovedVMLSTDesc,
              displayStatus: 'warning',
            },
            historyLogs: [
              {
                onEvent: PLEvents.MODIFY,
                logMessage: statesMessages.editHistoryLogMessage,
              },
              {
                onEvent: DefaultEvents.ABORT,
                logMessage:
                  statesMessages.editOrAddPeriodsAbortHistoryLogMessage,
              },
            ],
          },
          lifecycle: pruneAfterDays(970),
          progress: 0.4,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/EditsRequireAction').then((val) =>
                  Promise.resolve(val.EditsRequireAction),
                ),
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
          MODIFY: {
            target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
          },
          [DefaultEvents.ABORT]: {
            target: States.VINNUMALASTOFNUN_APPROVE_EDITS_ABORT,
          },
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      /**
       * Copy the current periods to temp. If the user cancels the edits,
       * we will restore the periods to their original state from temp.
       */
      createTempPeriods: assign((context, event) => {
        if (event.type !== DefaultEvents.EDIT) {
          return context
        }

        const { application } = context
        const { answers } = application

        set(answers, 'tempPeriods', answers.periods)

        return context
      }),
      /**
       * The user canceled the edits.
       * Restore the periods to their original state from temp.
       */
      restorePeriodsFromTemp: assign((context, event) => {
        if (event.type !== DefaultEvents.ABORT) {
          return context
        }

        const { application } = context
        const { answers } = application

        if (answers.tempPeriods) {
          set(answers, 'periods', cloneDeep(answers.tempPeriods))
          unset(answers, 'tempPeriods')
        }

        return context
      }),
      /**
       * Copy the current employers to temp. If the user cancels the edits,
       * we will restore the employers to their original state from temp.
       */
      createTempEmployers: assign((context, event) => {
        if (event.type !== DefaultEvents.EDIT) {
          return context
        }

        const { application } = context
        const { answers } = application

        set(answers, 'tempEmployers', answers.employers)

        return context
      }),
      /**
       * The user canceled the edits.
       * Restore the employers to their original state from temp.
       */
      restoreEmployersFromTemp: assign((context, event) => {
        if (event.type !== DefaultEvents.ABORT) {
          return context
        }

        const { application } = context
        const { answers } = application

        if (answers.tempEmployers) {
          set(answers, 'employers', cloneDeep(answers.tempEmployers))
          unset(answers, 'tempEmployers')
        }

        return context
      }),
      /**
       * The user submitted the edits but did not make any changes to the employer.
       * Restore the employers to their original state from temp.
       */
      removeAddedEmployers: assign((context, event) => {
        if (event.type !== DefaultEvents.SUBMIT) {
          return context
        }

        const { application } = context
        const { answers } = application

        if (answers.tempEmployers && answers.addEmployer === NO) {
          set(answers, 'employers', cloneDeep(answers.tempEmployers))
        }

        return context
      }),
      /**
       * The user submitted the edits but did not make any changes to the periods.
       * Restore the periods to their original state from temp.
       */
      removeAddedPeriods: assign((context, event) => {
        if (event.type !== DefaultEvents.SUBMIT) {
          return context
        }

        const { application } = context
        const { answers } = application

        if (answers.tempPeriods && answers.addPeriods === NO) {
          set(answers, 'periods', cloneDeep(answers.tempPeriods))
        }

        return context
      }),
      clearEmployers: assign((context) => {
        const { application } = context
        const { answers } = application
        const { employers, isSelfEmployed, employerLastSixMonths } =
          getApplicationAnswers(answers)

        if (isSelfEmployed === NO) {
          employers?.forEach((val, i) => {
            if (val.phoneNumber) {
              set(answers, `employers[${i}].phoneNumber`, val.phoneNumber)
            }
            if (val.phoneNumber === '') {
              unset(answers, `employers[${i}].phoneNumber`)
            }
            set(answers, `employers[${i}].ratio`, val.ratio)
            set(answers, `employers[${i}].email`, val.email)
            set(answers, `employers[${i}].reviewerNationalRegistryId`, '')
            set(
              answers,
              `employers[${i}].companyNationalRegistryId`,
              val.companyNationalRegistryId,
            )
            set(answers, `employers[${i}].isApproved`, false)
          })
        }

        if (employerLastSixMonths === YES) {
          employers?.forEach((val, i) => {
            if (val.phoneNumber) {
              set(answers, `employers[${i}].phoneNumber`, val.phoneNumber)
            }
            if (val.stillEmployed) {
              set(answers, `employers[${i}].stillEmployed`, val.stillEmployed)
              if (val.stillEmployed === YES) {
                set(answers, `employers[${i}].isApproved`, false)
              } else {
                set(answers, `employers[${i}].isApproved`, true)
              }
            }
            set(answers, `employers[${i}].ratio`, val.ratio)
            set(answers, `employers[${i}].email`, val.email)
            set(answers, `employers[${i}].reviewerNationalRegistryId`, '')
            set(answers, `employers[${i}].companyNationalRegistryId`, '')
          })
        }

        return context
      }),
      clearEmployerNationalRegistryId: assign((context) => {
        const { application } = context
        const { answers } = application

        unset(answers, 'employerNationalRegistryId')

        return context
      }),
      /**
       * The edits were approved. Clear out temp.
       */
      clearTemp: assign((context, event) => {
        if (event.type !== DefaultEvents.APPROVE) {
          return context
        }

        const { application } = context
        const { answers } = application

        unset(answers, 'tempPeriods')
        unset(answers, 'tempEmployers')

        return context
      }),
      clearOtherParentDataIfSelectedNo: assign((context) => {
        const { application } = context
        const { otherParent } = getApplicationAnswers(application.answers)
        if (otherParent === NO || otherParent === SINGLE) {
          unset(application.answers, 'otherParentEmail')
          unset(application.answers, 'otherParentPhoneNumber')
          unset(application.answers, 'requestRights')
          unset(application.answers, 'giveRights')
          unset(application.answers, 'transferRights')
          unset(application.answers, 'personalAllowanceFromSpouse')
          unset(application.answers, 'otherParentRightOfAccess')
        }
        return context
      }),
      setOtherParentIdIfSelectedSpouse: assign((context) => {
        const { application } = context

        const answers = getApplicationAnswers(application.answers)

        if (answers.otherParent === SPOUSE) {
          // Specifically persist the national registry id of the spouse
          // into answers.otherParentId since it is used when the other
          // parent is applying for parental leave to see if there
          // have already been any applications created by the primary parent
          set(
            application.answers,
            'otherParentObj.otherParentId',
            getOtherParentId(application),
          )
        }

        return context
      }),
      clearPersonalAllowanceIfUsePersonalAllowanceIsNo: assign((context) => {
        const { application } = context
        const { usePersonalAllowance } = getApplicationAnswers(
          application.answers,
        )

        if (usePersonalAllowance === NO) {
          if (application.answers.personalAllowance) {
            unset(application.answers, 'personalAllowance.useAsMuchAsPossible')
            unset(application.answers, 'personalAllowance.usage')
          }
        }

        return context
      }),
      clearSpouseAllowanceIfUseSpouseAllowanceIsNo: assign((context) => {
        const { application } = context
        const { usePersonalAllowanceFromSpouse } = getApplicationAnswers(
          application.answers,
        )

        if (usePersonalAllowanceFromSpouse === NO) {
          if (application.answers.personalAllowanceFromSpouse) {
            unset(
              application.answers,
              'personalAllowanceFromSpouse.useAsMuchAsPossible',
            )
            unset(application.answers, 'personalAllowanceFromSpouse.usage')
          }
        }

        return context
      }),
      removeNullPeriod: assign((context) => {
        const { application } = context

        const answers = getApplicationAnswers(application.answers)
        const { periods } = getApplicationAnswers(application.answers)
        const tempPeriods = periods.filter((period) => !!period?.startDate)

        if (answers.periods.length !== tempPeriods.length) {
          unset(answers, 'periods')
          set(answers, 'periods', tempPeriods)
        }

        return context
      }),
      setIsApprovedOnEmployer: assign((context) => {
        const { application } = context
        const { answers } = application
        const { employerNationalRegistryId } = getApplicationAnswers(answers)
        const employers = getApprovedEmployers(answers)
        if (employers?.length > 0) {
          set(
            answers,
            `employers[${employers.length - 1}].companyNationalRegistryId`,
            employerNationalRegistryId,
          )
        }

        return context
      }),
      resetAdditionalDocumentsArray: assign((context) => {
        const { application } = context
        unset(application.answers, 'fileUpload.additionalDocuments')

        return context
      }),
      setNavId: assign((context) => {
        const { application } = context

        const { applicationFundId } = getApplicationExternalData(
          application.externalData,
        )

        if (applicationFundId && applicationFundId !== '') {
          set(application.externalData, 'navId', applicationFundId)
        }

        return context
      }),
      setPrivatePensionValuesIfUsePrivatePensionFundIsNO: assign((context) => {
        const { application } = context

        const answers = getApplicationAnswers(application.answers)

        if (
          answers.usePrivatePensionFund === NO &&
          answers.privatePensionFund !== NO_PRIVATE_PENSION_FUND
        ) {
          set(
            application.answers,
            'payments.privatePensionFund',
            NO_PRIVATE_PENSION_FUND,
          )
        }

        if (
          answers.usePrivatePensionFund === NO &&
          answers.privatePensionFundPercentage !== '0'
        ) {
          set(application.answers, 'payments.privatePensionFundPercentage', '0')
        }

        return context
      }),
      setUnionValuesIfUseUnionIsNO: assign((context) => {
        const { application } = context

        const answers = getApplicationAnswers(application.answers)

        if (answers.useUnion === NO && answers.union !== NO_UNION) {
          set(application.answers, 'payments.union', NO_UNION)
        }

        return context
      }),
      setPersonalUsageToHundredIfUseAsMuchAsPossibleIsYes: assign((context) => {
        const { application } = context

        const answers = getApplicationAnswers(application.answers)

        if (
          answers.personalUseAsMuchAsPossible === YES &&
          answers.personalUsage !== '100'
        ) {
          set(application.answers, 'personalAllowance', {
            useAsMuchAsPossible: YES,
            usage: '100',
            usePersonalAllowance: YES,
          })
        }

        return context
      }),
      setSpouseUsageToHundredIfUseAsMuchAsPossibleIsYes: assign((context) => {
        const { application } = context

        const answers = getApplicationAnswers(application.answers)

        if (
          answers.spouseUseAsMuchAsPossible === YES &&
          answers.spouseUsage !== '100'
        ) {
          set(application.answers, 'personalAllowanceFromSpouse', {
            useAsMuchAsPossible: YES,
            usage: '100',
            usePersonalAllowance: YES,
          })
        }

        return context
      }),
      assignToOtherParent: assign((context) => {
        const { application } = context
        const otherParentId = getOtherParentId(application)

        if (
          otherParentId !== undefined &&
          otherParentId !== '' &&
          needsOtherParentApproval(context)
        ) {
          set(application, 'assignees', [otherParentId])
        }

        return context
      }),
      assignToVMST: assign((context) => {
        const { application } = context
        const VMST_ID = process.env.VMST_ID ?? ''

        const assignees = application.assignees
        if (VMST_ID && VMST_ID !== '') {
          if (Array.isArray(assignees) && !assignees.includes(VMST_ID)) {
            assignees.push(VMST_ID)
            set(application, 'assignees', assignees)
          } else {
            set(application, 'assignees', [VMST_ID])
          }
        }

        return context
      }),
      setEmployerReviewerNationalRegistryId: assign((context, event) => {
        // Only set if employer gets assigned
        if (event.type !== DefaultEvents.ASSIGN) {
          return context
        }

        const { application } = context
        const { answers } = application
        const { employers } = getApplicationAnswers(answers)

        set(
          answers,
          'employerReviewerNationalRegistryId',
          application.assignees[0],
        )

        // Multiple employers and we mark first 'available' employer
        let isAlreadyDone = false
        employers.forEach((e, i) => {
          if (!isAlreadyDone && !e.isApproved) {
            set(answers, `employers[${i}].isApproved`, true)
            set(
              answers,
              `employers[${i}].reviewerNationalRegistryId`,
              application.assignees[0],
            )
            isAlreadyDone = true
          }
        })

        return context
      }),
      attemptToSetPrimaryParentAsOtherParent: assign((context) => {
        const { application } = context
        const { answers, externalData } = application
        const selectedChild = getSelectedChild(answers, externalData)

        if (!selectedChild || isParentWithoutBirthParent(application.answers)) {
          return context
        }

        if (selectedChild.parentalRelation === ParentalRelations.primary) {
          return context
        }

        // Current parent is secondary parent, this will set otherParentId to the id of the primary parent
        set(
          answers,
          'otherParentObj.otherParentId',
          selectedChild.primaryParentNationalRegistryId,
        )

        set(answers, 'otherParentObj.chooseOtherParent', MANUAL)

        return context
      }),
      correctTransferRights: assign((context) => {
        const { application } = context
        const { answers } = application
        const { hasMultipleBirths } = getApplicationAnswers(answers)
        const multipleBirthsRequestDays = getMultipleBirthRequestDays(answers)

        if (
          hasMultipleBirths === YES &&
          multipleBirthsRequestDays !== getMaxMultipleBirthsDays(answers) &&
          multipleBirthsRequestDays > 0
        ) {
          set(answers, 'transferRights', TransferRightsOption.NONE)
        }

        return context
      }),
      setRightsToOtherParent: assign((context) => {
        const { application } = context
        const { answers, externalData } = application
        const selectedChild = getSelectedChild(answers, externalData)

        if (!selectedChild) {
          return context
        }

        if (selectedChild.parentalRelation === ParentalRelations.primary) {
          return context
        }

        const days = selectedChild.transferredDays

        if (days !== undefined && days > 0) {
          set(answers, 'requestRights.isRequestingRights', YES)
          set(answers, 'requestRights.requestDays', days.toString())
        } else if (days !== undefined && days < 0) {
          set(answers, 'giveRights.isGivingRights', YES)
          set(answers, 'giveRights.giveDays', days.toString())
        } else {
          set(answers, 'requestRights.isRequestingRights', NO)
          set(answers, 'giveRights.isGivingRights', NO)
        }

        return context
      }),
      setAllowanceToOtherParent: assign((context) => {
        const { application } = context
        const { answers, externalData } = application
        const selectedChild = getSelectedChild(answers, externalData)

        if (!selectedChild) {
          return context
        }

        if (selectedChild.parentalRelation === ParentalRelations.primary) {
          return context
        }

        set(answers, 'usePersonalAllowance', NO)
        set(answers, 'usePersonalAllowanceFromSpouse', NO)

        return context
      }),
      removePeriodsOrAllowanceOnSpouseRejection: assign((context) => {
        const { application } = context

        const answers = getApplicationAnswers(application.answers)

        if (answers.requestDays > 0) {
          unset(application.answers, 'periods')
          unset(application.answers, 'validatedPeriods')
          set(application.answers, 'requestRights.requestDays', '0')
          set(application.answers, 'requestRights.isRequestingRights', NO)
          set(application.answers, 'giveRights.giveDays', '0')
          set(application.answers, 'giveRights.isGivingRights', NO)
        }

        if (answers.usePersonalAllowanceFromSpouse === YES) {
          unset(application.answers, 'personalAllowanceFromSpouse')
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
      removePreviousState: assign((context) => {
        const { application } = context

        unset(application.answers, 'previousState')
        return context
      }),
      setPreviousState: assign((context, event) => {
        const { application } = context
        const { state } = application
        const { answers } = application
        const e = event.type as unknown as any
        if (e === 'xstate.init') {
          return context
        }
        if (
          e === 'APPROVE' &&
          state === 'residenceGrantApplicationNoBirthDate'
        ) {
          return context
        }
        if (e === 'REJECT' && state === 'residenceGrantApplication') {
          set(answers, 'previousState', 'residenceGrantApplicationNoBirthDate')
          return context
        }

        set(answers, 'previousState', state)
        return context
      }),
      setHasAppliedForReidenceGrant: assign((context, event) => {
        const { application } = context
        const { state, answers } = application
        const e = event.type as unknown as any
        if (
          state === States.RESIDENCE_GRAND_APPLICATION &&
          e === DefaultEvents.APPROVE
        ) {
          set(answers, 'hasAppliedForReidenceGrant', YES)
        }
        return context
      }),
      setActionName: assign((context) => {
        const { application } = context
        const { answers } = application
        const actionName = findActionName(context)
        set(answers, 'actionName', actionName)
        return context
      }),
      setResidenceGrant: assign((context) => {
        const { application } = context
        const { answers } = application

        set(answers, 'isResidenceGrant', YES)

        return context
      }),
    },
  },
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    // If the applicant is its own employer, we need to give it the `ASSIGNEE` role to be able to continue the process
    if (id === application.applicant && application.assignees.includes(id)) {
      return Roles.ASSIGNEE
    }

    if (id === application.applicant) {
      return Roles.APPLICANT
    }

    if (application.assignees.includes(id)) {
      return Roles.ASSIGNEE
    }

    const VMST_ID = process.env.VMST_ID
    if (id === VMST_ID) {
      return Roles.ORGINISATION_REVIEWER
    }

    return undefined
  },
  answerValidators,
}

export default ParentalLeaveTemplate
