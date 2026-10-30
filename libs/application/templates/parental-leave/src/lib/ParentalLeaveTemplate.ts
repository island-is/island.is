import cloneDeep from 'lodash/cloneDeep'
import set from 'lodash/set'
import unset from 'lodash/unset'
import { assign } from 'xstate'

import {
  DefaultStateLifeCycle,
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
import { ChildrenApi, GetPersonInformation } from '../dataProviders'
import {
  determineNameFromApplicationAnswers,
  draftStateDescription,
  editOrAddPeriodsStatePendingAction,
  employerApprovalStatePendingAction,
  getRejectedByFromState,
  getActionName,
  getApplicationAnswers,
  getChangeBaseline,
  getVMSTApplicationAnswers,
  getVMSTTypeOfApplication,
  getFollowUpChildIndex,
  getVmstApplicationId,
  getMaxMultipleBirthsDays,
  getMultipleBirthRequestDays,
  getOtherParentId,
  getSelectedChild,
  getSpouse,
  isFollowUpApplication,
  isNoChildrenFoundPath,
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
          'prefillFromVMST',
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
            // Refuse a follow-up whose leave VMST does not list for this
            // applicant, instead of letting it continue without VMST data.
            defineTemplateApi({
              action: ApiModuleActions.verifyFollowUpLeave,
              shouldPersistToExternalData: false,
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
            // Seeds externalData.dateOfBirth: period validation and the residence
            // grant use the child's actual birth date once it is known.
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
              api: [UserProfileApi, GetPersonInformation, ChildrenApi],
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
          'setDefaultOtherParentRightOfAccess',
          'clearPrivatePensionFundIfNotUsed',
          'clearUnionIfNotUsed',
          'clearPersonalAllowanceIfUsePersonalAllowanceIsNo',
          'clearSpouseAllowanceIfUseSpouseAllowanceIsNo',
          'setPersonalUsageToHundredIfUseAsMuchAsPossibleIsYes',
          'setSpouseUsageToHundredIfUseAsMuchAsPossibleIsYes',
          'correctTransferRights',
          'clearEmployers',
          'clearAnswersIncompatibleWithSelfEmployment',
          'clearAnswersIncompatibleWithUnemploymentBenefits',
          'clearRejectedBy',
        ],
        meta: {
          name: States.DRAFT,
          status: 'draft',
          actionCard: {
            description: draftStateDescription,
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: coreHistoryMessages.applicationSent,
              },
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage:
                  statesMessages.vinnumalastofnunApprovalApproveHistoryLogMessage,
              },
              {
                onEvent: DefaultEvents.REJECT,
                logMessage:
                  parentalLeaveFormMessages.draftFlow.draftNotApprovedVMLSTDesc,
              },
            ],
          },
          lifecycle: pruneAfterDays(90),
          onEntry: defineTemplateApi({
            action: ApiModuleActions.notifyApplicantOfRejection,
            triggerEvent: DefaultEvents.REJECT,
            shouldPersistToExternalData: false,
            throwOnError: false,
          }),
          onExit: defineTemplateApi({
            action: ApiModuleActions.validateApplication,
            triggerEvent: DefaultEvents.SUBMIT,
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
            {
              id: Roles.ORGANISATION_REVIEWER,
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
          // Catch late VMST callbacks that arrive after the applicant has bounced back to DRAFT.
          [DefaultEvents.APPROVE]: {
            target: States.APPROVED,
            cond: (context) => hasBeenSubmittedToVMST(context.application),
          },
          // The applicant is already editing, so a late rejection only flags it.
          [DefaultEvents.REJECT]: {
            cond: (context) => hasBeenSubmittedToVMST(context.application),
            actions: 'setRejectedBy',
          },
          CLOSED: {
            target: States.CLOSED,
            cond: (context) => hasBeenSubmittedToVMST(context.application),
          },
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
          lifecycle: DefaultStateLifeCycle,
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
          [DefaultEvents.REJECT]: {
            target: States.DRAFT,
            actions: [
              'removePeriodsOrAllowanceOnSpouseRejection',
              'setRejectedBy',
            ],
          },
        },
      },
      [States.EMPLOYER_WAITING_TO_ASSIGN]: {
        entry: 'clearEmployerNationalRegistryId',
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
          lifecycle: DefaultStateLifeCycle,
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
          [DefaultEvents.ASSIGN]: {
            target: States.EMPLOYER_APPROVAL,
            actions: 'setEmployerReviewerNationalRegistryId',
          },
          [DefaultEvents.EDIT]: { target: States.DRAFT },
        },
      },
      [States.EMPLOYER_APPROVAL]: {
        exit: 'clearAssignees',
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
          lifecycle: DefaultStateLifeCycle,
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
              actions: 'setIsApprovedOnEmployer',
            },
            {
              target: States.EMPLOYER_WAITING_TO_ASSIGN,
              actions: 'setIsApprovedOnEmployer',
            },
          ],
          [DefaultEvents.REJECT]: {
            target: States.DRAFT,
            actions: 'setRejectedBy',
          },
          [DefaultEvents.EDIT]: { target: States.DRAFT },
        },
      },
      [States.VINNUMALASTOFNUN_APPROVAL]: {
        exit: ['clearAssignees', 'resetAdditionalDocumentsArray'],
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
          lifecycle: DefaultStateLifeCycle,
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
          [DefaultEvents.REJECT]: {
            target: States.DRAFT,
            actions: 'setRejectedBy',
          },
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
          lifecycle: DefaultStateLifeCycle,
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
          lifecycle: DefaultStateLifeCycle,
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
              actions: 'setHasAppliedForResidenceGrant',
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
          lifecycle: DefaultStateLifeCycle,
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
          'setPeriodsFromVMST',
          'clearChangeApplicationInfo',
          'setAddEmployer',
          'snapshotRewindBaseline',
        ],
        exit: [
          'detectEmployerChanges',
          'setActionName',
          'setDefaultOtherParentRightOfAccess',
          'clearEmployers',
          'clearRejectedBy',
        ],
        meta: {
          name: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
          status: 'inprogress',
          actionCard: {
            pendingAction: editOrAddPeriodsStatePendingAction,
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
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: ApiModuleActions.notifyApplicantOfRejection,
            triggerEvent: DefaultEvents.REJECT,
            shouldPersistToExternalData: false,
            throwOnError: false,
          }),
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
              actions: ['restoreChangeBaseline', 'clearChangeEmployerFile'],
            },
            {
              target: States.CLOSED,
              actions: ['discardPendingChanges', 'clearChangeEmployerFile'],
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
          lifecycle: DefaultStateLifeCycle,
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
            target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
            actions: [
              'removePeriodsOrAllowanceOnSpouseRejection',
              'setRejectedBy',
            ],
          },
        },
      },
      [States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS]: {
        entry: 'clearEmployerNationalRegistryId',
        meta: {
          name: States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
          status: 'inprogress',
          actionCard: {
            pendingAction: employerApprovalStatePendingAction,
          },
          lifecycle: DefaultStateLifeCycle,
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
          [DefaultEvents.ASSIGN]: {
            target: States.EMPLOYER_APPROVE_EDITS,
            actions: 'setEmployerReviewerNationalRegistryId',
          },
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
        exit: 'clearAssignees',
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
          lifecycle: DefaultStateLifeCycle,
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
            defineTemplateApi({
              action: ApiModuleActions.setApplicationFundId,
              triggerEvent: DefaultEvents.REJECT,
              externalDataId: 'navId',
              throwOnError: false,
            }),
            defineTemplateApi({
              action: ApiModuleActions.setApplicationRights,
              triggerEvent: DefaultEvents.REJECT,
              externalDataId: 'VMSTApplicationRights',
              throwOnError: false,
            }),
            defineTemplateApi({
              action: ApiModuleActions.setOtherParent,
              triggerEvent: DefaultEvents.REJECT,
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
              actions: 'setIsApprovedOnEmployer',
            },
            {
              target: States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
              actions: 'setIsApprovedOnEmployer',
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
          [DefaultEvents.REJECT]: [
            {
              target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
              cond: isChangeApplication,
              actions: 'setRejectedBy',
            },
            {
              target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
              actions: ['setRejectedBy', 'markInPlaceRewind'],
            },
          ],
          CLOSED: { target: States.CLOSED },
        },
      },
      [States.VINNUMALASTOFNUN_APPROVE_EDITS]: {
        exit: [
          'resetAdditionalDocumentsArray',
          'clearAssignees',
          'clearChangedPeriodsNEmployers',
          'clearChangeEmployerFileIfAddEmployerIsNo',
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
          lifecycle: DefaultStateLifeCycle,
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
            defineTemplateApi({
              action: ApiModuleActions.setApplicationFundId,
              triggerEvent: DefaultEvents.REJECT,
              externalDataId: 'navId',
              throwOnError: false,
            }),
            defineTemplateApi({
              action: ApiModuleActions.setApplicationRights,
              triggerEvent: DefaultEvents.REJECT,
              externalDataId: 'VMSTApplicationRights',
              throwOnError: false,
            }),
            defineTemplateApi({
              action: ApiModuleActions.setOtherParent,
              triggerEvent: DefaultEvents.REJECT,
              externalDataId: 'VMSTOtherParent',
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
            target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
            actions: ['setRejectedBy', 'markInPlaceRewind'],
          },
          CLOSED: { target: States.CLOSED },
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      /**
       * Prefill a follow-up application from what VMST holds for the leave it
       * continues. Nothing is taken from the predecessor's island.is answers.
       *
       * The change form and the request sent to VMST both read answers, so
       * VMST's data has to be copied into them. `vmstApplicationId` is what
       * keeps VMST seeing one record per child across the whole sequence of
       * applications.
       */
      prefillFromVMST: assign((context) => {
        const { application } = context
        const { answers } = application

        if (!getValueViaPath(answers, 'initialQuery')) {
          // First-time application: it is its own root as far as VMST is concerned.
          set(answers, 'applicationAction', ApplicationAction.APPLY)
          set(answers, 'vmstApplicationId', application.id)
          return context
        }

        for (const [key, value] of Object.entries(
          getVMSTApplicationAnswers(application.externalData),
        )) {
          if (getValueViaPath(answers, key) === undefined) {
            set(answers, key, value)
          }
        }

        set(answers, 'vmstApplicationId', getVmstApplicationId(application))

        // Resolve the child in this application's own children list rather than
        // reusing the predecessor's `selectedChild` index, which points into a
        // different list.
        if (getValueViaPath(answers, 'selectedChild') === undefined) {
          const index = getFollowUpChildIndex(application)

          if (index >= 0) {
            set(answers, 'selectedChild', `${index}`)
          }
        }

        // Adoption and permanent foster care are read off VMST's rights. Only a
        // primary parent answers this themselves; a secondary parent's comes with
        // the child as `primaryParentTypeOfApplication`.
        const typeOfApplication = getVMSTTypeOfApplication(
          application.externalData,
        )
        if (
          typeOfApplication &&
          getValueViaPath(answers, 'noChildrenFound.typeOfApplication') ===
            undefined &&
          getSelectedChild(answers, application.externalData)
            ?.parentalRelation === ParentalRelations.primary
        ) {
          set(answers, 'noChildrenFound.typeOfApplication', typeOfApplication)
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
       *
       * A follow-up never has a synthesized child: its child was matched in
       * `prefillFromVMST`, which this must not overwrite.
       *
       * A registry child picked after answering the no-children-found screens
       * keeps its index; those answers no longer describe the child and are
       * dropped so they do not steer the draft form (e.g. its adoption upload).
       */
      setSelectedChildForSynthesizedChild: assign((context) => {
        const { application } = context
        const { noChildrenFoundTypeOfApplication } = getApplicationAnswers(
          application.answers,
        )

        if (
          !noChildrenFoundTypeOfApplication ||
          isFollowUpApplication(application.answers)
        ) {
          return context
        }

        if (!isNoChildrenFoundPath(application.answers)) {
          unset(application.answers, 'noChildrenFound')
          unset(application.answers, 'fosterCareOrAdoption')
          unset(application.answers, 'noPrimaryParent')

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
       * to this; follow-up applications diff against VMST data alone).
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

        set(application.externalData, 'rewindBaseline', {
          data: { answers: cloneDeep(application.answers) },
          status: 'success',
          date: new Date(),
        })

        return context
      }),
      /**
       * Mark that an approved application is being edited in place so the change
       * form can snapshot and restore the current application as its baseline.
       */
      markInPlaceRewind: assign((context) => {
        set(context.application.externalData, 'inPlaceRewind', {
          data: { value: true },
          status: 'success',
          date: new Date(),
        })

        return context
      }),
      /**
       * Discard the pending employer-change flag only when the applicant aborts;
       * ordinary re-entry into the change form must preserve in-progress edits.
       */
      discardPendingChanges: assign((context) => {
        const { application } = context
        const { answers } = application
        unset(answers, 'changeEmployer')
        return context
      }),
      /**
       * Compare employer and self-employment answers with the change baseline.
       * Marking `addEmployer` forces the changed employment data through employer
       * review when the applicant submits.
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
      /**
       * Restore all editable answers from the change baseline when an in-place
       * edit is abandoned, then clear transient change flags and attachments.
       */
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
      /**
       * Initialize the change form's employer controls from the canonical
       * self-employment answer and reset the add-employer choice.
       */
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
      /**
       * Remove the temporary national registry id used while assigning the next
       * employer reviewer.
       */
      clearEmployerNationalRegistryId: assign((context) => {
        const { application } = context
        const { answers } = application

        unset(answers, 'employerNationalRegistryId')

        return context
      }),
      /**
       * Clear rights, allowance, and contact answers that no longer apply when
       * there is no other parent, or when the parent is not entered manually.
       */
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
      /**
       * Persist the selected spouse's national registry id so their applications
       * can be matched with this application.
       */
      setOtherParentIdIfSelectedSpouse: assign((context) => {
        const { application } = context

        const answers = getApplicationAnswers(application.answers)

        if (answers.otherParent === SPOUSE) {
          set(
            application.answers,
            'otherParentObj.otherParentId',
            getOtherParentId(application),
          )
        }

        return context
      }),
      /**
       * The form displays "yes" by default for manual other-parent access, but
       * defaultValue is not necessarily persisted when the field is untouched.
       * Persist that default before validation and downstream approval routing.
       */
      setDefaultOtherParentRightOfAccess: assign((context) => {
        const { application } = context
        const { otherParent, otherParentRightOfAccess } = getApplicationAnswers(
          application.answers,
        )

        if (otherParent === MANUAL && otherParentRightOfAccess === undefined) {
          set(application.answers, 'otherParentRightOfAccess', YES)
        }

        return context
      }),
      /**
       * Clear personal-allowance usage details when the applicant opts out.
       */
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
      /**
       * Clear spouse-allowance usage details when the applicant opts out.
       */
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
       * On employer approval, mark the first pending employer as approved and
       * record the approving company's national registry id.
       */
      setIsApprovedOnEmployer: assign((context) => {
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
      /**
       * Remove previously requested additional documents before leaving the
       * review state.
       */
      resetAdditionalDocumentsArray: assign((context) => {
        const { application } = context
        unset(application.answers, 'fileUpload.additionalDocuments')

        return context
      }),
      /**
       * Clear private-pension selections when the applicant opts out.
       */
      clearPrivatePensionFundIfNotUsed: assign((context) => {
        const { application } = context

        const answers = getApplicationAnswers(application.answers)

        if (answers.usePrivatePensionFund === NO) {
          unset(application.answers, 'payments.privatePensionFund')
          unset(application.answers, 'payments.privatePensionFundPercentage')
        }

        return context
      }),
      /**
       * Clear the selected union when the applicant opts out of union payments.
       */
      clearUnionIfNotUsed: assign((context) => {
        const { application } = context

        const answers = getApplicationAnswers(application.answers)

        if (answers.useUnion === NO) {
          unset(application.answers, 'payments.union')
        }

        return context
      }),
      /**
       * Normalize personal tax-allowance usage to 100% when the applicant chooses
       * to use as much as possible.
       */
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
      /**
       * Normalize spouse tax-allowance usage to 100% when the applicant chooses
       * to use as much as possible.
       */
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
      /**
       * Assign the application to the other parent when their approval is
       * required and a valid national registry id is available.
       */
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
      /**
       * Ensure VMST is assigned, preserving existing assignees when VMST is
       * added for the first time.
       */
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
      /**
       * On assignment, record the reviewer on the application and on the first
       * employer still waiting for approval.
       */
      setEmployerReviewerNationalRegistryId: assign((context) => {
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
      /**
       * When the applicant is the secondary parent, preselect the child's primary
       * parent as the manually entered other parent.
       */
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

        set(
          answers,
          'otherParentObj.otherParentId',
          selectedChild.primaryParentNationalRegistryId,
        )

        set(answers, 'otherParentObj.chooseOtherParent', MANUAL)

        return context
      }),
      /**
       * Switch the other-parent selector to spouse when registry data contains a
       * spouse.
       */
      otherParentToSpouse: assign((context) => {
        const { application } = context
        const { answers } = application
        const spouse = getSpouse(application)

        if (spouse) {
          set(answers, 'otherParentObj.chooseOtherParent', SPOUSE)
        }

        return context
      }),
      /**
       * Disable ordinary rights transfer when a partial multiple-birth rights
       * request would otherwise leave conflicting transfer choices.
       */
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
      /**
       * Seed the secondary parent's requested or given days from rights already
       * transferred on the selected child.
       */
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
      /**
       * Clear periods and transferred-rights answers invalidated by other-parent
       * rejection, and remove any requested spouse allowance.
       */
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
      /**
       * Remove every current assignee before the application is routed again.
       */
      clearAssignees: assign((context) => ({
        ...context,
        application: {
          ...context.application,
          assignees: [],
        },
      })),
      /**
       * Record that the applicant submitted the residence-grant application.
       */
      setHasAppliedForResidenceGrant: assign((context) => {
        const { application } = context
        const { answers } = application
        set(answers, 'hasAppliedForReidenceGrant', YES)
        return context
      }),
      /**
       * Store the action label derived from the application's current answers.
       */
      setActionName: assign((context) => {
        const { application } = context
        const { answers } = application
        const actionName = getActionName(application)
        set(answers, 'actionName', actionName)
        return context
      }),
      /**
       * Clear transient employer and period change flags after VMST processes the
       * edit.
       */
      clearChangedPeriodsNEmployers: assign((context) => {
        const { application } = context
        const { answers } = application

        unset(answers, 'changeEmployer')
        unset(answers, 'changePeriods')
        unset(answers, 'addPeriods')
        unset(answers, 'addEmployer')

        return context
      }),
      /**
       * Mark this application as following the residence-grant flow.
       */
      setResidenceGrant: assign((context) => {
        const { application } = context
        const { answers } = application

        set(answers, 'isResidenceGrant', YES)

        return context
      }),
      /**
       * Store the explicit no-multiple-births value when the applicant answers no.
       */
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
      /**
       * Prevent contradictory employment answers and remove a self-employment
       * attachment when the applicant is not self-employed.
       */
      clearAnswersIncompatibleWithSelfEmployment: assign((context) => {
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
      /**
       * Clear unemployment-benefit details when the applicant opts out, and keep
       * an attachment only for benefit types that require one.
       */
      clearAnswersIncompatibleWithUnemploymentBenefits: assign((context) => {
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
       * Clear the employer-change attachment when the applicant decides not to
       * change employer information.
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
       * Clear the employer-change attachment when the applicant aborts the edit.
       */
      /**
       * Record who sent the application back. Runs as a transition action, so
       * `application.state` is still the state the rejection came from.
       */
      setRejectedBy: assign((context) => {
        const { application } = context
        set(
          application.answers,
          'rejectedBy',
          getRejectedByFromState(application.state),
        )

        return context
      }),
      clearRejectedBy: assign((context) => {
        unset(context.application.answers, 'rejectedBy')

        return context
      }),
      clearChangeEmployerFile: assign((context) => {
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
