import cloneDeep from 'lodash/cloneDeep'
import set from 'lodash/set'
import unset from 'lodash/unset'
import { assign } from 'xstate'

import {
  EphemeralStateLifeCycle,
  NO,
  YES,
  coreHistoryMessages,
  coreMessages,
  getValueViaPath,
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
  StateLifeCycle,
  UserProfileApi,
  defineTemplateApi,
  InstitutionNationalIds,
} from '@island.is/application/types'

import {
  ApiModuleActions,
  ApplicationAction,
  Events,
  MANUAL,
  NO_MULTIPLE_BIRTHS,
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  PARENTAL_LEAVE,
  PLEvents,
  ParentalRelations,
  Roles,
  SINGLE,
  SPOUSE,
  States,
  TransferRightsOption,
  UnEmployedBenefitTypes,
} from '../constants'
import {
  ChildrenApi,
  GetPersonInformation,
  PreviousApplicationApi,
} from '../dataProviders'
import {
  calculatePruneDate,
  determineNameFromApplicationAnswers,
  employerApprovalStatePendingAction,
  getActionName,
  getApplicationAnswers,
  getApplicationExternalData,
  getChangeBaseline,
  getVMSTApplicationAnswers,
  getMaxMultipleBirthsDays,
  getMultipleBirthRequestDays,
  getOtherParentId,
  getSelectedChild,
  getSpouse,
  isParentWithoutBirthParent,
  normalize,
  otherParentApprovalStatePendingAction,
} from '../lib/parentalLeaveUtils'
import { answerValidators } from './answerValidators'
import { dataSchema } from './dataSchema'
import { parentalLeaveFormMessages, statesMessages } from './messages'
import {
  allEmployersHaveApproved,
  hasBeenSubmittedToVMST,
  hasEmployer,
  hasEmployerRelevantChange,
  isChangeApplication,
  isInPlaceRewind,
  isMockApplication,
  isResidenceGrantApplication,
  needsOtherParentApproval,
  needsOtherParentApprovalForEdits,
  restructureVMSTPeriods,
} from './parentalLeaveTemplateUtils'
import { CodeOwners } from '@island.is/shared/constants'

export const birthDayLifeCycle: StateLifeCycle = {
  shouldBeListed: true,
  shouldBePruned: true,
  whenToPrune: (application: Application) => {
    return calculatePruneDate(application)
  },
} as const

const ParentalLeaveTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.PARENTAL_LEAVE,
  name: determineNameFromApplicationAnswers,
  codeOwner: CodeOwners.Origo,
  institution: parentalLeaveFormMessages.shared.institution,
  translationNamespaces: ApplicationConfigurations.ParentalLeave.translation,
  allowMultipleApplicationsInDraft: true,
  initialQueryParameter: 'previousApplication',
  dataSchema,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        exit: [
          'prefillFromPreviousApplication',
          'setSelectedChildForSynthesizedChild',
          'otherParentToSpouse',
          'attemptToSetPrimaryParentAsOtherParent',
          'setRightsToOtherParent',
          'setMultipleBirthsIfNo',
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
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            whenToPrune: 7 * 24 * 60 * 60 * 1000, // 7 days
          },
          onExit: [
            defineTemplateApi({
              action: ApiModuleActions.setChildrenInformation,
              externalDataId: 'children',
              throwOnError: true,
              order: 0,
            }),
            defineTemplateApi({
              action: ApiModuleActions.getPreviousApplication,
              externalDataId: 'previousApplication',
              throwOnError: true,
              order: 1,
            }),
            defineTemplateApi({
              action: ApiModuleActions.setApplicationInformation,
              externalDataId: 'VMSTApplicationInformation',
              throwOnError: false,
              order: 2,
            }),
            defineTemplateApi({
              action: ApiModuleActions.setApplicationFundId,
              externalDataId: 'navId',
              throwOnError: false,
              order: 3,
            }),
            defineTemplateApi({
              action: ApiModuleActions.setVMSTPeriods,
              externalDataId: 'VMSTPeriods',
              throwOnError: false,
              order: 4,
            }),
            defineTemplateApi({
              action: ApiModuleActions.setApplicationRights,
              externalDataId: 'VMSTApplicationRights',
              throwOnError: false,
              order: 5,
            }),
            defineTemplateApi({
              action: ApiModuleActions.setOtherParent,
              externalDataId: 'VMSTOtherParent',
              throwOnError: false,
              order: 6,
            }),
            // Seeds externalData.dateOfBirth so birthDayLifeCycle can prune this
            // application on the same date as the one it continues.
            defineTemplateApi({
              action: ApiModuleActions.setBirthDate,
              externalDataId: 'dateOfBirth',
              throwOnError: false,
              order: 7,
            }),
          ],
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
                UserProfileApi,
                GetPersonInformation,
                PreviousApplicationApi,
                ChildrenApi,
              ],
            },
          ],
        },
        on: {
          SUBMIT: [
            {
              target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
              cond: isChangeApplication,
            },
            {
              target: States.RESIDENCE_GRANT_APPLICATION_NO_BIRTH_DATE,
              cond: isResidenceGrantApplication,
            },
            { target: States.DRAFT },
          ],
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
          'setNavId',
          'correctTransferRights',
          'clearEmployers',
          'setIfSelfEmployed',
          'setIfIsReceivingUnemploymentBenefits',
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
          lifecycle: pruneAfterDays(90),
          onExit: defineTemplateApi({
            action: ApiModuleActions.validateApplication,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              delete: (application) => !hasBeenSubmittedToVMST(application),
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
                includeSubjectAndActor: true,
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
                includeSubjectAndActor: true,
              },
            ],
          },
          lifecycle: pruneAfterDays(970),
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
              delete: (application) => !hasBeenSubmittedToVMST(application),
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              read: 'all',
              write: 'all',
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
          onEntry: defineTemplateApi({
            action: ApiModuleActions.notifyApplicantOfRejectionFromOtherParent,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              delete: (application) => !hasBeenSubmittedToVMST(application),
              formLoader: () =>
                import('../forms/DraftRequiresAction').then((val) =>
                  Promise.resolve(val.DraftRequiresAction),
                ),
              read: 'all',
              write: 'all',
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
          onEntry: defineTemplateApi({
            action: ApiModuleActions.assignEmployer,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              delete: (application) => !hasBeenSubmittedToVMST(application),
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.ASSIGN]: { target: States.EMPLOYER_APPROVAL },
          [DefaultEvents.EDIT]: { target: States.DRAFT },
        },
      },
      [States.EMPLOYER_APPROVAL]: {
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
                  statesMessages.employerApprovalApprovePeriodHistoryLogMessage,
                includeSubjectAndActor: true,
              },
              {
                onEvent: DefaultEvents.REJECT,
                logMessage:
                  parentalLeaveFormMessages.draftFlow
                    .draftNotApprovedEmployerDesc,
                includeSubjectAndActor: true,
              },
            ],
          },
          lifecycle: pruneAfterDays(970),
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
              delete: (application) => !hasBeenSubmittedToVMST(application),
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              read: 'all',
              write: 'all',
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
          onEntry: defineTemplateApi({
            action: ApiModuleActions.notifyApplicantOfRejectionFromEmployer,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              delete: (application) => !hasBeenSubmittedToVMST(application),
              formLoader: () =>
                import('../forms/DraftRequiresAction').then((val) =>
                  Promise.resolve(val.DraftRequiresAction),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: { target: States.DRAFT },
        },
      },
      [States.VINNUMALASTOFNUN_APPROVAL]: {
        exit: ['clearAssignees', 'setNavId', 'resetAdditionalDocumentsArray'],
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
            ],
          },
          lifecycle: birthDayLifeCycle,
          onEntry: [
            defineTemplateApi({
              triggerEvent: DefaultEvents.SUBMIT,
              action: ApiModuleActions.sendApplication,
              shouldPersistToExternalData: true,
              throwOnError: true,
            }),
            defineTemplateApi({
              triggerEvent: DefaultEvents.APPROVE,
              action: ApiModuleActions.sendApplication,
              shouldPersistToExternalData: true,
              throwOnError: true,
            }),
          ],
          onExit: [
            defineTemplateApi({
              action: ApiModuleActions.setBirthDate,
              triggerEvent: DefaultEvents.APPROVE,
              externalDataId: 'dateOfBirth',
              throwOnError: false,
            }),
            defineTemplateApi({
              action: ApiModuleActions.setVMSTPeriods,
              triggerEvent: DefaultEvents.EDIT,
              externalDataId: 'VMSTPeriods',
              throwOnError: false,
            }),
            defineTemplateApi({
              action: ApiModuleActions.setApplicationRights,
              triggerEvent: DefaultEvents.EDIT,
              externalDataId: 'VMSTApplicationRights',
              throwOnError: false,
            }),
          ],
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
              id: Roles.ORGANISATION_REVIEWER,
            },
          ],
        },
        always: {
          target: States.APPROVED,
          cond: (context) =>
            isMockApplication(context) && !isChangeApplication(context),
        },
        on: {
          [DefaultEvents.APPROVE]: { target: States.APPROVED },
          ADDITIONALDOCUMENTSREQUIRED: {
            target: States.ADDITIONAL_DOCUMENTS_REQUIRED,
          },
          [DefaultEvents.REJECT]: { target: States.VINNUMALASTOFNUN_ACTION },
          [DefaultEvents.EDIT]: [
            {
              target: States.RESIDENCE_GRANT_APPLICATION,
              cond: isResidenceGrantApplication,
            },
            {
              target: States.DRAFT,
            },
          ],
          CLOSED: { target: States.CLOSED },
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
          lifecycle: pruneAfterDays(90),
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
              id: Roles.ORGANISATION_REVIEWER,
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: {
            target: States.DRAFT,
          },
          CLOSED: { target: States.CLOSED },
        },
      },
      [States.ADDITIONAL_DOCUMENTS_REQUIRED]: {
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
          lifecycle: birthDayLifeCycle,
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
              id: Roles.ORGANISATION_REVIEWER,
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: {
            target: States.VINNUMALASTOFNUN_APPROVAL,
          },
          CLOSED: { target: States.CLOSED },
        },
      },
      [States.ADDITIONAL_DOCUMENTS_REQUIRED_FOR_EDITS]: {
        exit: 'setActionName',
        meta: {
          status: 'inprogress',
          name: States.ADDITIONAL_DOCUMENTS_REQUIRED_FOR_EDITS,
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
          lifecycle: birthDayLifeCycle,
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
              id: Roles.ORGANISATION_REVIEWER,
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: {
            target: States.VINNUMALASTOFNUN_APPROVE_EDITS,
          },
          CLOSED: { target: States.CLOSED },
        },
      },
      [States.RESIDENCE_GRANT_APPLICATION_NO_BIRTH_DATE]: {
        meta: {
          status: 'inprogress',
          name: States.RESIDENCE_GRANT_APPLICATION_NO_BIRTH_DATE,
          actionCard: {
            pendingAction: {
              title: statesMessages.residenceGrantInProgress,
              content:
                parentalLeaveFormMessages.residenceGrantMessage
                  .residenceGrantClosedDescription,
              displayStatus: 'warning',
            },
          },
          lifecycle: pruneAfterDays(90),
          onEntry: defineTemplateApi({
            action: ApiModuleActions.setBirthDate,
            externalDataId: 'dateOfBirth',
            throwOnError: true,
          }),
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
            {
              id: Roles.ORGANISATION_REVIEWER,
            },
          ],
        },
        on: {
          [DefaultEvents.REJECT]: { target: States.CLOSED },
          APPROVE: {
            target: States.RESIDENCE_GRANT_APPLICATION,
          },
          CLOSED: { target: States.CLOSED },
        },
      },
      [States.RESIDENCE_GRANT_APPLICATION]: {
        entry: ['setResidenceGrant', 'setActionName'],
        exit: ['setHasAppliedForReidenceGrant'],
        meta: {
          status: 'inprogress',
          name: States.RESIDENCE_GRANT_APPLICATION,

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
                onEvent: DefaultEvents.APPROVE,
                logMessage: statesMessages.residenceGrantSubmitted,
              },
            ],
          },
          lifecycle: pruneAfterDays(90),
          onExit: [
            defineTemplateApi({
              action: ApiModuleActions.setApplicationFundId,
              triggerEvent: DefaultEvents.APPROVE,
              externalDataId: 'navId',
              throwOnError: false,
              order: 0,
            }),
            defineTemplateApi({
              action: ApiModuleActions.validateApplication,
              triggerEvent: DefaultEvents.APPROVE,
              throwOnError: true,
              order: 1,
            }),
          ],

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
            {
              id: Roles.ORGANISATION_REVIEWER,
            },
          ],
        },
        on: {
          APPROVE: [
            {
              target: States.VINNUMALASTOFNUN_APPROVE_EDITS,
            },
          ],
          REJECT: { target: States.CLOSED },
          CLOSED: { target: States.CLOSED },
        },
      },
      [States.APPROVED]: {
        meta: {
          name: States.APPROVED,
          status: 'completed',
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
            ],
          },
          lifecycle: birthDayLifeCycle,
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
              id: Roles.ORGANISATION_REVIEWER,
            },
          ],
        },
        on: {
          CLOSED: { target: States.CLOSED },
        },
      },
      [States.CLOSED]: {
        entry: 'clearAssignees',
        meta: {
          name: States.CLOSED,
          status: 'completed',
          lifecycle: EphemeralStateLifeCycle,
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
      [States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS]: {
        entry: [
          'discardPendingChanges',
          'setPeriodsFromVMST',
          'setNavId',
          'clearChangeApplicationInfo',
          'setAddEmployer',
          'snapshotRewindBaseline',
        ],
        exit: [
          'detectEmployerChanges',
          'setNavId',
          'setActionName',
          'clearEmployers',
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
                onEvent: DefaultEvents.ASSIGN,
                logMessage:
                  statesMessages.editOrAddPeriodsSubmitHistoryLogMessage,
              },
            ],
          },
          lifecycle: pruneAfterDays(970),
          onExit: [
            defineTemplateApi({
              action: ApiModuleActions.setApplicationFundId,
              triggerEvent: DefaultEvents.SUBMIT,
              externalDataId: 'navId',
              throwOnError: false,
              order: 0,
            }),
            defineTemplateApi({
              triggerEvent: DefaultEvents.SUBMIT,
              action: ApiModuleActions.validateApplication,
              throwOnError: true,
              order: 1,
            }),
          ],
          roles: [
            {
              id: Roles.APPLICANT,
              delete: (application) => !hasBeenSubmittedToVMST(application),
              formLoader: () =>
                import('../forms/EditOrAddEmployersAndPeriods').then((val) =>
                  Promise.resolve(val.EditOrAddEmployersAndPeriods),
                ),
              read: 'all',
              write: 'all',
            },
            {
              id: Roles.ORGANISATION_REVIEWER,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: [
            {
              target: States.OTHER_PARENT_APPROVAL_FOR_EDITS,
              cond: needsOtherParentApprovalForEdits,
            },
            {
              target: States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
              cond: hasEmployerRelevantChange,
            },
            {
              target: States.VINNUMALASTOFNUN_APPROVE_EDITS,
            },
          ],
          [DefaultEvents.ABORT]: [
            {
              target: States.VINNUMALASTOFNUN_APPROVE_EDITS,
              cond: isInPlaceRewind,
              actions: [
                'restoreChangeBaseline',
                'clearChangeEmployerFileIfCancel',
              ],
            },
            {
              target: States.CLOSED,
              actions: [
                'discardPendingChanges',
                'clearChangeEmployerFileIfCancel',
              ],
            },
          ],
          CLOSED: { target: States.CLOSED },
        },
      },
      [States.OTHER_PARENT_APPROVAL_FOR_EDITS]: {
        entry: ['assignToOtherParent'],
        exit: ['clearAssignees'],
        meta: {
          name: States.OTHER_PARENT_APPROVAL_FOR_EDITS,
          status: 'inprogress',
          actionCard: {
            pendingAction: otherParentApprovalStatePendingAction,
            historyLogs: [
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage: statesMessages.otherParentApproveHistoryLogMessage,
                includeSubjectAndActor: true,
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
                includeSubjectAndActor: true,
              },
            ],
          },
          lifecycle: pruneAfterDays(970),
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
              delete: (application) => !hasBeenSubmittedToVMST(application),
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: [
            {
              target: States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
              cond: hasEmployerRelevantChange,
            },
            {
              target: States.VINNUMALASTOFNUN_APPROVE_EDITS,
            },
          ],
          [DefaultEvents.EDIT]: {
            target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
          },
          [DefaultEvents.REJECT]: {
            target: States.OTHER_PARENT_EDITS_ACTION,
          },
        },
      },
      [States.OTHER_PARENT_EDITS_ACTION]: {
        entry: 'removePeriodsOrAllowanceOnSpouseRejection',
        meta: {
          name: States.OTHER_PARENT_EDITS_ACTION,
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
          onEntry: defineTemplateApi({
            action: ApiModuleActions.notifyApplicantOfRejectionFromOtherParent,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              delete: (application) => !hasBeenSubmittedToVMST(application),
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
          [DefaultEvents.EDIT]: {
            target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
          },
        },
      },
      [States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS]: {
        entry: 'clearEmployerNationalRegistryId',
        exit: ['setEmployerReviewerNationalRegistryId'],
        meta: {
          name: States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
          status: 'inprogress',
          actionCard: {
            pendingAction: employerApprovalStatePendingAction,
          },
          lifecycle: pruneAfterDays(970),
          onExit: [
            defineTemplateApi({
              action: ApiModuleActions.setApplicationFundId,
              triggerEvent: DefaultEvents.EDIT,
              externalDataId: 'navId',
              throwOnError: false,
            }),
            defineTemplateApi({
              action: ApiModuleActions.setApplicationRights,
              triggerEvent: DefaultEvents.EDIT,
              externalDataId: 'VMSTApplicationRights',
              throwOnError: false,
            }),
            defineTemplateApi({
              action: ApiModuleActions.setOtherParent,
              triggerEvent: DefaultEvents.EDIT,
              externalDataId: 'VMSTOtherParent',
              throwOnError: false,
            }),
          ],
          onEntry: defineTemplateApi({
            action: ApiModuleActions.assignEmployer,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              delete: (application) => !hasBeenSubmittedToVMST(application),
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              read: 'all',
              write: 'all',
            },
            {
              id: Roles.ORGANISATION_REVIEWER,
            },
          ],
        },
        on: {
          [DefaultEvents.ASSIGN]: { target: States.EMPLOYER_APPROVE_EDITS },
          [DefaultEvents.EDIT]: [
            {
              target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
              cond: isChangeApplication,
            },
            {
              target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
              actions: 'markInPlaceRewind',
            },
          ],
          CLOSED: { target: States.CLOSED },
        },
      },
      [States.EMPLOYER_APPROVE_EDITS]: {
        exit: ['clearAssignees', 'setIsApprovedOnEmployer'],
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
                includeSubjectAndActor: true,
              },
              {
                onEvent: DefaultEvents.REJECT,
                logMessage:
                  parentalLeaveFormMessages.draftFlow
                    .draftNotApprovedEmployerDesc,
                includeSubjectAndActor: true,
              },
            ],
          },
          lifecycle: pruneAfterDays(970),
          onExit: [
            defineTemplateApi({
              action: ApiModuleActions.setApplicationFundId,
              triggerEvent: DefaultEvents.EDIT,
              externalDataId: 'navId',
              throwOnError: false,
            }),
            defineTemplateApi({
              action: ApiModuleActions.setApplicationRights,
              triggerEvent: DefaultEvents.EDIT,
              externalDataId: 'VMSTApplicationRights',
              throwOnError: false,
            }),
            defineTemplateApi({
              action: ApiModuleActions.setOtherParent,
              triggerEvent: DefaultEvents.EDIT,
              externalDataId: 'VMSTOtherParent',
              throwOnError: false,
            }),
          ],
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
              delete: (application) => !hasBeenSubmittedToVMST(application),
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.InReview),
                ),
              read: 'all',
              write: 'all',
            },
            {
              id: Roles.ORGANISATION_REVIEWER,
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
          [DefaultEvents.EDIT]: [
            {
              target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
              cond: isChangeApplication,
            },
            {
              target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
              actions: 'markInPlaceRewind',
            },
          ],
          [DefaultEvents.REJECT]: { target: States.EMPLOYER_EDITS_ACTION },
          CLOSED: { target: States.CLOSED },
        },
      },
      [States.EMPLOYER_EDITS_ACTION]: {
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
                onEvent: DefaultEvents.ABORT,
                logMessage: statesMessages.employerActionDeleteChanges,
              },
            ],
          },
          lifecycle: pruneAfterDays(970),
          onExit: [
            defineTemplateApi({
              action: ApiModuleActions.setApplicationFundId,
              triggerEvent: DefaultEvents.EDIT,
              externalDataId: 'navId',
              throwOnError: false,
            }),
            defineTemplateApi({
              action: ApiModuleActions.setApplicationRights,
              triggerEvent: DefaultEvents.EDIT,
              externalDataId: 'VMSTApplicationRights',
              throwOnError: false,
            }),
            defineTemplateApi({
              action: ApiModuleActions.setOtherParent,
              triggerEvent: DefaultEvents.EDIT,
              externalDataId: 'VMSTOtherParent',
              throwOnError: false,
            }),
          ],
          onEntry: defineTemplateApi({
            action: ApiModuleActions.notifyApplicantOfRejectionFromEmployer,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              delete: (application) => !hasBeenSubmittedToVMST(application),
              formLoader: () =>
                import('../forms/EditsRequireAction').then((val) =>
                  Promise.resolve(val.EditsRequireAction),
                ),
              read: 'all',
              write: 'all',
            },
            {
              id: Roles.ORGANISATION_REVIEWER,
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: [
            {
              target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
              cond: isChangeApplication,
            },
            {
              target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
              actions: 'markInPlaceRewind',
            },
          ],
          [DefaultEvents.ABORT]: [
            {
              target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
              cond: isChangeApplication,
            },
            {
              target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
              actions: 'markInPlaceRewind',
            },
          ],
          CLOSED: { target: States.CLOSED },
        },
      },
      [States.VINNUMALASTOFNUN_APPROVE_EDITS]: {
        exit: [
          'resetAdditionalDocumentsArray',
          'clearAssignees',
          'setNavId',
          'clearChangedPeriodsNEmployers',
          'clearChangeEmployerFileIfAddEmployerIsNo',
          'clearChangeEmployerFileIfCancel',
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
            ],
          },
          lifecycle: birthDayLifeCycle,
          onEntry: [
            defineTemplateApi({
              triggerEvent: DefaultEvents.APPROVE,
              action: ApiModuleActions.sendApplication,
              shouldPersistToExternalData: true,
              throwOnError: true,
            }),
            defineTemplateApi({
              triggerEvent: DefaultEvents.SUBMIT,
              action: ApiModuleActions.sendApplication,
              shouldPersistToExternalData: true,
              throwOnError: true,
            }),
          ],
          onExit: [
            defineTemplateApi({
              action: ApiModuleActions.setBirthDate,
              triggerEvent: DefaultEvents.APPROVE,
              externalDataId: 'dateOfBirth',
              throwOnError: false,
            }),
            defineTemplateApi({
              action: ApiModuleActions.setVMSTPeriods,
              triggerEvent: DefaultEvents.EDIT,
              externalDataId: 'VMSTPeriods',
              throwOnError: false,
            }),
            defineTemplateApi({
              action: ApiModuleActions.setApplicationRights,
              triggerEvent: DefaultEvents.EDIT,
              externalDataId: 'VMSTApplicationRights',
              throwOnError: false,
            }),
          ],
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
              id: Roles.ORGANISATION_REVIEWER,
            },
          ],
        },
        always: {
          target: States.APPROVED,
          cond: (context) =>
            isMockApplication(context) && !isChangeApplication(context),
        },
        on: {
          [DefaultEvents.APPROVE]: { target: States.APPROVED },
          ADDITIONALDOCUMENTSREQUIRED: {
            target: States.ADDITIONAL_DOCUMENTS_REQUIRED_FOR_EDITS,
          },
          [DefaultEvents.EDIT]: [
            {
              target: States.RESIDENCE_GRANT_APPLICATION,
              cond: isResidenceGrantApplication,
            },
            {
              target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
              actions: 'markInPlaceRewind',
            },
          ],
          [DefaultEvents.REJECT]: {
            target: States.VINNUMALASTOFNUN_EDITS_ACTION,
          },
          CLOSED: { target: States.CLOSED },
        },
      },
      [States.VINNUMALASTOFNUN_EDITS_ACTION]: {
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
                onEvent: DefaultEvents.EDIT,
                logMessage: statesMessages.editHistoryLogMessage,
              },
            ],
          },
          lifecycle: pruneAfterDays(90),
          onExit: [
            defineTemplateApi({
              action: ApiModuleActions.setApplicationFundId,
              triggerEvent: DefaultEvents.EDIT,
              externalDataId: 'navId',
              throwOnError: false,
            }),
            defineTemplateApi({
              action: ApiModuleActions.setApplicationRights,
              triggerEvent: DefaultEvents.EDIT,
              externalDataId: 'VMSTApplicationRights',
              throwOnError: false,
            }),
            defineTemplateApi({
              action: ApiModuleActions.setOtherParent,
              triggerEvent: DefaultEvents.EDIT,
              externalDataId: 'VMSTOtherParent',
              throwOnError: false,
            }),
          ],
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
              id: Roles.ORGANISATION_REVIEWER,
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: {
            target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
            actions: 'markInPlaceRewind',
          },
          [DefaultEvents.ABORT]: {
            target: States.VINNUMALASTOFNUN_APPROVE_EDITS,
          },
          CLOSED: { target: States.CLOSED },
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      /**
       * Seed a follow-up application from the one it continues.
       *
       * The predecessor's answers arrive as external data from
       * `getPreviousApplication`, which resolved them server-side from an id the
       * browser supplied — so this only ever copies answers the applicant already
       *
       * `vmstApplicationId` is what keeps VMST seeing one record per child across
       * the whole sequence of applications.
       */
      prefillFromPreviousApplication: assign((context) => {
        const { application } = context
        const { answers } = application
        const { previousApplication } = getApplicationExternalData(
          application.externalData,
        )

        if (!previousApplication) {
          // First-time application: it is its own root as far as VMST is concerned.
          set(answers, 'applicationAction', ApplicationAction.APPLY)
          set(answers, 'vmstApplicationId', application.id)
          return context
        }

        for (const [key, value] of Object.entries(
          previousApplication.answers ?? {},
        )) {
          // Mock mode belongs to the VMST record, not to this application: a
          // follow-up to a mock application has no real record behind it and must
          // stay in mock mode. The prerequisites screen may have written a
          // `mock` answer of its own, so the predecessor has to win here rather
          // than only filling a gap.
          if (key === 'mock' || getValueViaPath(answers, key) === undefined) {
            set(answers, key, value)
          }
        }

        for (const [key, value] of Object.entries(
          getVMSTApplicationAnswers(application.externalData),
        )) {
          if (getValueViaPath(answers, key) === undefined) {
            set(answers, key, value)
          }
        }

        set(answers, 'previousApplicationId', previousApplication.applicationId)
        set(answers, 'vmstApplicationId', previousApplication.vmstApplicationId)

        // Resolve the child by matching rather than copying the predecessor's
        // `selectedChild`: that answer is an index into
        // `externalData.children.data.children`, and this application built its own
        // list, so the same index can point at a different child.
        const previousChild = previousApplication.selectedChild
        if (
          previousChild &&
          getValueViaPath(answers, 'selectedChild') === undefined
        ) {
          const { children } = getApplicationExternalData(
            application.externalData,
          )
          const index = children.findIndex(
            (child) =>
              (!!previousChild.expectedDateOfBirth &&
                child.expectedDateOfBirth ===
                  previousChild.expectedDateOfBirth) ||
              (!!previousChild.adoptionDate &&
                child.adoptionDate === previousChild.adoptionDate),
          )

          if (index >= 0) {
            set(answers, 'selectedChild', `${index}`)
          }
        }

        // The action is only decided here, once we know a predecessor exists.
        if (getValueViaPath(answers, 'applicationAction') === undefined) {
          set(answers, 'applicationAction', ApplicationAction.CHANGE)
        }

        return context
      }),
      /**
       * Point `selectedChild` at the child the no-children-found answers describe.
       *
       * `setChildrenInformation` runs before this — onExit template apis run ahead
       * of the xstate transition — and replaces the children list with a single
       * synthesized child. Without this, `selectedChild` is either the
       * `CHILD_NOT_IN_DATA` sentinel or unset, so `getSelectedChild` returns null
       * and everything downstream fails with "Missing selected child".
       */
      setSelectedChildForSynthesizedChild: assign((context) => {
        const { application } = context
        const { noChildrenFoundTypeOfApplication } = getApplicationAnswers(
          application.answers,
        )

        if (!noChildrenFoundTypeOfApplication) {
          return context
        }

        set(application.answers, 'selectedChild', '0')

        return context
      }),
      /**
       * Start the change form from what VMST actually holds. The applicant may
       * have made changes on paper, so VMST is the source of truth for periods.
       */
      setPeriodsFromVMST: assign((context) => {
        const { application } = context

        // Only sync at the start of a change session: entering the change form
        // from prerequisites (fresh follow-up), or from VMST_APPROVE_EDITS via
        // markInPlaceRewind (applicant re-editing an already-approved change).
        // Any other source state is a re-entry that would clobber the
        // applicant's in-progress edits.
        const syncIsSafe =
          application.state === States.PREREQUISITES ||
          application.state === States.VINNUMALASTOFNUN_APPROVE_EDITS

        if (!syncIsSafe) {
          return context
        }

        const newPeriods = restructureVMSTPeriods(application.externalData)

        if (newPeriods.length > 0) {
          set(application.answers, 'periods', newPeriods)
        }

        // The periods changed underneath the client-side validation cache.
        unset(application.answers, 'validatedPeriods')

        return context
      }),
      /**
       * Reset the changeApplicationInfo flag so a fresh change session starts
       * without stale change tracking.
       */
      clearChangeApplicationInfo: assign((context) => {
        const { application } = context

        unset(application.answers, 'changeApplicationInfo')

        return context
      }),
      /**
       * Snapshot the answers as the applicant sees them on entry to the change
       * form, so the change-review screens have a baseline to diff against for
       * an in-place rewind of a first-time leave (`getChangeBaseline` falls back
       * to this when there is no `previousApplication`).
       */
      snapshotRewindBaseline: assign((context) => {
        const { application } = context

        if (isChangeApplication(context) || !isInPlaceRewind(context)) {
          return context
        }

        const existing = getValueViaPath(
          application.externalData,
          'rewindBaseline.data.answers',
        )
        if (existing) {
          return context
        }

        // Follow-up applications already have a predecessor baseline; no snapshot needed.
        const fromPredecessor = getValueViaPath(
          application.externalData,
          'previousApplication.data.answers',
        ) as Record<string, unknown> | undefined
        if (fromPredecessor && Object.keys(fromPredecessor).length > 0) {
          return context
        }

        set(application.externalData, 'rewindBaseline', {
          data: { answers: cloneDeep(application.answers) },
          status: 'success',
          date: new Date(),
        })

        return context
      }),
      markInPlaceRewind: assign((context) => {
        set(context.application.externalData, 'inPlaceRewind', {
          data: { value: true },
          status: 'success',
          date: new Date(),
        })

        return context
      }),
      // Runs on every entry to the change form; only clears when the transition was fired by ABORT so ordinary re-entry keeps the applicant's edits.
      discardPendingChanges: assign((context, event) => {
        if (event.type !== DefaultEvents.ABORT) {
          return context
        }
        const { application } = context
        const { answers } = application
        unset(answers, 'changeEmployer')
        return context
      }),
      /**
       * Detects changes in the employer-related information of the application.
       * If any changes are found compared to the baseline, it marks the application
       * as having added an employer.
       */
      detectEmployerChanges: assign((context, event) => {
        if (event.type !== DefaultEvents.SUBMIT) {
          return context
        }

        const { application } = context
        const { answers } = application
        const { employers, isSelfEmployed } = getApplicationAnswers(answers)
        const baseline = getChangeBaseline(application.externalData)

        if (!baseline) {
          return context
        }

        const selfEmployedChanged =
          normalize(baseline.employment.isSelfEmployed) !==
          normalize(isSelfEmployed)
        const employersChanged =
          JSON.stringify(employers) !== JSON.stringify(baseline.employers)

        if (selfEmployedChanged || employersChanged) {
          set(answers, 'addEmployer', YES)
        }

        return context
      }),
      restoreChangeBaseline: assign((context) => {
        const { application } = context
        const baseline = getChangeBaseline(application.externalData)

        if (!baseline) {
          return context
        }

        set(
          application.answers,
          'employment.isSelfEmployed',
          baseline.employment.isSelfEmployed,
        )
        set(
          application.answers,
          'employment.isReceivingUnemploymentBenefits',
          baseline.employment.isReceivingUnemploymentBenefits,
        )
        set(application.answers, 'employers', cloneDeep(baseline.employers))
        set(application.answers, 'periods', cloneDeep(baseline.periods))

        // Rights
        set(
          application.answers,
          'transferRights',
          baseline.rights.transferRights,
        )
        set(
          application.answers,
          'requestRights.requestDays',
          baseline.rights.requestDays,
        )
        set(
          application.answers,
          'giveRights.giveDays',
          baseline.rights.giveDays,
        )
        set(
          application.answers,
          'multipleBirthsRequestDays',
          baseline.rights.multipleBirthsRequestDays,
        )

        // Personal allowance
        set(
          application.answers,
          'personalAllowance.usePersonalAllowance',
          baseline.personalAllowance.usePersonalAllowance,
        )
        set(
          application.answers,
          'personalAllowance.useAsMuchAsPossible',
          baseline.personalAllowance.personalUseAsMuchAsPossible,
        )
        set(
          application.answers,
          'personalAllowance.usage',
          baseline.personalAllowance.personalUsage,
        )

        // Personal allowance from spouse
        set(
          application.answers,
          'personalAllowanceFromSpouse.usePersonalAllowance',
          baseline.personalAllowanceFromSpouse.usePersonalAllowanceFromSpouse,
        )
        set(
          application.answers,
          'personalAllowanceFromSpouse.useAsMuchAsPossible',
          baseline.personalAllowanceFromSpouse.spouseUseAsMuchAsPossible,
        )
        set(
          application.answers,
          'personalAllowanceFromSpouse.usage',
          baseline.personalAllowanceFromSpouse.spouseUsage,
        )

        // Other parent — `getApplicationAnswers` reads from `otherParentObj.*`
        // with a fallback to the flat legacy paths, so writing back to the
        // canonical `otherParentObj.*` is what the rest of the code expects.
        set(
          application.answers,
          'otherParentObj.chooseOtherParent',
          baseline.otherParent.otherParent,
        )
        set(
          application.answers,
          'otherParentObj.otherParentName',
          baseline.otherParent.otherParentName,
        )
        set(
          application.answers,
          'otherParentObj.otherParentId',
          baseline.otherParent.otherParentId,
        )
        set(
          application.answers,
          'otherParentEmail',
          baseline.otherParent.otherParentEmail,
        )
        set(
          application.answers,
          'otherParentPhoneNumber',
          baseline.otherParent.otherParentPhoneNumber,
        )
        set(
          application.answers,
          'otherParentRightOfAccess',
          baseline.otherParent.otherParentRightOfAccess,
        )
        set(
          application.answers,
          'shareInformationWithOtherParent',
          baseline.otherParent.shareInformationWithOtherParent,
        )

        // Applicant contact + language
        set(
          application.answers,
          'applicant.email',
          baseline.baseInformation.applicantEmail,
        )
        set(
          application.answers,
          'applicant.phoneNumber',
          baseline.baseInformation.applicantPhoneNumber,
        )
        set(application.answers, 'applicant.language', baseline.language)

        // Payments
        set(application.answers, 'payments.bank', baseline.payments.bank)
        set(
          application.answers,
          'payments.pensionFund',
          baseline.payments.pensionFund,
        )
        set(
          application.answers,
          'payments.useUnion',
          baseline.payments.useUnion,
        )
        set(application.answers, 'payments.union', baseline.payments.union)
        set(
          application.answers,
          'payments.usePrivatePensionFund',
          baseline.payments.usePrivatePensionFund,
        )
        set(
          application.answers,
          'payments.privatePensionFund',
          baseline.payments.privatePensionFund,
        )
        set(
          application.answers,
          'payments.privatePensionFundPercentage',
          baseline.payments.privatePensionFundPercentage,
        )

        unset(application.answers, 'changeEmployer')
        unset(application.answers, 'changePeriods')
        unset(application.answers, 'addPeriods')
        unset(application.answers, 'addEmployer')
        unset(application.answers, 'fileUpload.changeEmployerFile')

        return context
      }),
      setAddEmployer: assign((context) => {
        const { application } = context
        const { isSelfEmployed } = getApplicationAnswers(application.answers)
        set(application.answers, 'addEmployer', NO)
        set(application.answers, 'employment.isSelfEmployed', isSelfEmployed)
        set(
          application.answers,
          'selfEmployedCheckbox',
          isSelfEmployed === YES ? [YES] : [],
        )

        return context
      }),
      clearEmployers: assign((context) => {
        const { application } = context
        const { answers } = application
        const {
          employers,
          isSelfEmployed,
          applicationType,
          employerLastSixMonths,
          isReceivingUnemploymentBenefits,
        } = getApplicationAnswers(answers)

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
            set(answers, `employers[${i}].companyNationalRegistryId`, '')
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

        const hasEmployer =
          (applicationType === PARENTAL_LEAVE &&
            isReceivingUnemploymentBenefits !== YES &&
            isSelfEmployed !== YES) ||
          ((applicationType === PARENTAL_GRANT ||
            applicationType === PARENTAL_GRANT_STUDENTS) &&
            employerLastSixMonths === YES)

        if (!hasEmployer) {
          unset(application.answers, 'employers')
          unset(
            application.answers,
            'fileUpload.employmentTerminationCertificateFile',
          )
        }

        return context
      }),
      clearEmployerNationalRegistryId: assign((context) => {
        const { application } = context
        const { answers } = application

        unset(answers, 'employerNationalRegistryId')

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

        if (otherParent !== MANUAL) {
          unset(application.answers, 'otherParentObj.otherParentId')
          unset(application.answers, 'otherParentObj.otherParentName')
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
      /**
       * The employer approved the application.
       * Set isApproved to true and register companyNationalRegistryId
       */
      setIsApprovedOnEmployer: assign((context, event) => {
        // Only set if employer approves application
        if (event.type !== DefaultEvents.APPROVE) {
          return context
        }

        const { application } = context
        const { answers } = application
        const { employerNationalRegistryId, employers } =
          getApplicationAnswers(answers)

        // Multiple employers and we mark first 'available' employer
        let isAlreadyDone = false
        employers.forEach((e, i) => {
          if (!isAlreadyDone && !e.isApproved) {
            set(answers, `employers[${i}].isApproved`, true)
            set(
              answers,
              `employers[${i}].companyNationalRegistryId`,
              employerNationalRegistryId,
            )
            isAlreadyDone = true
          }
        })

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

        if (answers.usePrivatePensionFund === NO) {
          unset(application.answers, 'payments.privatePensionFund')
        }

        if (answers.usePrivatePensionFund === NO) {
          unset(application.answers, 'payments.privatePensionFundPercentage')
        }

        return context
      }),
      setUnionValuesIfUseUnionIsNO: assign((context) => {
        const { application } = context

        const answers = getApplicationAnswers(application.answers)

        if (answers.useUnion === NO) {
          unset(application.answers, 'payments.union')
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
      otherParentToSpouse: assign((context) => {
        const { application } = context
        const { answers } = application
        const spouse = getSpouse(application)

        if (spouse) {
          set(answers, 'otherParentObj.chooseOtherParent', SPOUSE)
        }

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
      setHasAppliedForReidenceGrant: assign((context, event) => {
        const { application } = context
        const { state, answers } = application
        const e = event.type
        if (
          state === States.RESIDENCE_GRANT_APPLICATION &&
          e === DefaultEvents.APPROVE
        ) {
          set(answers, 'hasAppliedForReidenceGrant', YES)
        }
        return context
      }),
      setActionName: assign((context) => {
        const { application } = context
        const { answers } = application
        const actionName = getActionName(application)
        set(answers, 'actionName', actionName)
        return context
      }),
      clearChangedPeriodsNEmployers: assign((context) => {
        const { application } = context
        const { answers } = application

        unset(answers, 'changeEmployer')
        unset(answers, 'changePeriods')
        unset(answers, 'addPeriods')
        unset(answers, 'addEmployer')

        return context
      }),
      setResidenceGrant: assign((context) => {
        const { application } = context
        const { answers } = application

        set(answers, 'isResidenceGrant', YES)

        return context
      }),
      setMultipleBirthsIfNo: assign((context) => {
        const { application } = context
        const { hasMultipleBirths } = getApplicationAnswers(application.answers)

        if (hasMultipleBirths === NO) {
          set(
            application.answers,
            'multipleBirths.multipleBirths',
            NO_MULTIPLE_BIRTHS,
          )
        }

        return context
      }),
      setIfSelfEmployed: assign((context) => {
        const { application } = context
        const { isSelfEmployed } = getApplicationAnswers(application.answers)

        if (isSelfEmployed === YES) {
          set(
            application.answers,
            'employment.isReceivingUnemploymentBenefits',
            NO,
          )
          unset(application.answers, 'employment.unemploymentBenefits')
        }

        if (isSelfEmployed === NO) {
          unset(application.answers, 'fileUpload.selfEmployedFile')
        }

        return context
      }),
      setIfIsReceivingUnemploymentBenefits: assign((context) => {
        const { application } = context
        const { isReceivingUnemploymentBenefits, unemploymentBenefits } =
          getApplicationAnswers(application.answers)

        if (isReceivingUnemploymentBenefits === NO) {
          unset(application.answers, 'employment.unemploymentBenefits')
          unset(application.answers, 'fileUpload.benefitsFile')
        }

        if (
          unemploymentBenefits !== UnEmployedBenefitTypes.union &&
          unemploymentBenefits !== UnEmployedBenefitTypes.healthInsurance
        ) {
          unset(application.answers, 'fileUpload.benefitsFile')
        }

        return context
      }),
      /**
       * Clear changeEmployerFile if applicant decides not to change employer info.
       */
      clearChangeEmployerFileIfAddEmployerIsNo: assign((context) => {
        const { application } = context
        const { addEmployer, changeEmployerFile } = getApplicationAnswers(
          application.answers,
        )

        if (addEmployer === NO) {
          if (changeEmployerFile) {
            unset(application.answers, 'fileUpload.changeEmployerFile')
          }
        }

        return context
      }),
      /**
       * The user canceled the edits.
       * Clear changeEmployerFile.
       */
      clearChangeEmployerFileIfCancel: assign((context, event) => {
        if (event.type !== DefaultEvents.ABORT) {
          return context
        }

        const { application } = context
        const { changeEmployerFile } = getApplicationAnswers(
          application.answers,
        )
        if (changeEmployerFile) {
          unset(application.answers, 'fileUpload.changeEmployerFile')
        }

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

    const VMST_ID = InstitutionNationalIds.VINNUMALASTOFNUN
    if (id === VMST_ID) {
      return Roles.ORGANISATION_REVIEWER
    }

    return undefined
  },
  answerValidators,
}

export default ParentalLeaveTemplate
