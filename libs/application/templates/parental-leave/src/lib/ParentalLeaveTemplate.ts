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
  calculatePruneDate,
  determineNameFromApplicationAnswers,
  employerApprovalStatePendingAction,
  getActionName,
  getApplicationAnswers,
  getApplicationExternalData,
  getMaxMultipleBirthsDays,
  getMultipleBirthRequestDays,
  getOtherParentId,
  getSelectedChild,
  getSpouse,
  isParentWithoutBirthParent,
  otherParentApprovalStatePendingAction,
} from '../lib/parentalLeaveUtils'
import { answerValidators } from './answerValidators'
import { dataSchema } from './dataSchema'
import { parentalLeaveFormMessages, statesMessages } from './messages'
import {
  allEmployersHaveApproved,
  goToState,
  hasDateOfBirth,
  hasEmployer,
  needsOtherParentApproval,
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
  codeOwner: CodeOwners.Deloitte,
  institution: parentalLeaveFormMessages.shared.institution,
  translationNamespaces: ApplicationConfigurations.ParentalLeave.translation,
  dataSchema,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        exit: [
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
            whenToPrune: 7 * 24 * 3600 * 1000,
          },
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
          lifecycle: pruneAfterDays(970), //pruneAfterDays(90),
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
        entry: ['setNavId', 'removeNullPeriod'],
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
            ],
          },
          lifecycle: pruneAfterDays(970),
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
              target: States.RESIDENCE_GRANT_APPLICATION,
            },
            {
              target: States.RESIDENCE_GRANT_APPLICATION_NO_BIRTH_DATE,
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
          lifecycle: pruneAfterDays(970),
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
          [DefaultEvents.EDIT]: { target: States.DRAFT },
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
          lifecycle: pruneAfterDays(970),
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
        entry: 'setPreviousState',
        exit: 'setPreviousState',
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
          lifecycle: pruneAfterDays(970),
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
          [DefaultEvents.REJECT]: [
            {
              cond: (application) => goToState(application, States.APPROVED),
              target: States.APPROVED,
            },
            {
              cond: (application) =>
                goToState(application, States.VINNUMALASTOFNUN_APPROVAL),
              target: States.VINNUMALASTOFNUN_APPROVAL,
            },
            {
              target: States.VINNUMALASTOFNUN_APPROVE_EDITS,
            },
          ],
          APPROVE: {
            target: States.RESIDENCE_GRANT_APPLICATION,
          },
          CLOSED: { target: States.CLOSED },
        },
      },
      [States.RESIDENCE_GRANT_APPLICATION]: {
        entry: ['setResidenceGrant', 'setActionName'],
        exit: ['setPreviousState', 'setHasAppliedForReidenceGrant'],
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
          lifecycle: pruneAfterDays(970),
          onExit: defineTemplateApi({
            action: ApiModuleActions.validateApplication,
            triggerEvent: DefaultEvents.APPROVE,
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
          REJECT: [
            {
              cond: (application) => goToState(application, States.APPROVED),
              target: States.APPROVED,
            },
            {
              cond: (application) =>
                goToState(application, States.VINNUMALASTOFNUN_APPROVAL),
              target: States.VINNUMALASTOFNUN_APPROVAL,
            },
            {
              target: States.VINNUMALASTOFNUN_APPROVE_EDITS,
            },
          ],
          CLOSED: { target: States.CLOSED },
        },
      },
      [States.APPROVED]: {
        entry: 'removePreviousState',
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
            ],
          },
          lifecycle: pruneAfterDays(970),
          onExit: [
            defineTemplateApi({
              action: ApiModuleActions.setBirthDate,
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
          [DefaultEvents.EDIT]: {
            target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
          },
          SUBMIT: [
            {
              target: States.RESIDENCE_GRANT_APPLICATION,
              cond: hasDateOfBirth,
            },
            {
              target: States.RESIDENCE_GRANT_APPLICATION_NO_BIRTH_DATE,
            },
          ],
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
      // Edit Flow States
      [States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS]: {
        entry: [
          'createTempPeriods',
          'removeNullPeriod',
          'setNavId',
          'createTempEmployers',
          'setVMSTPeriods',
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
                onEvent: DefaultEvents.ASSIGN,
                logMessage:
                  statesMessages.editOrAddPeriodsSubmitHistoryLogMessage,
              },
            ],
          },
          lifecycle: pruneAfterDays(970),
          onExit: defineTemplateApi({
            triggerEvent: DefaultEvents.SUBMIT,
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
            {
              id: Roles.ORGANISATION_REVIEWER,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: [
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
                goToState(application, States.VINNUMALASTOFNUN_APPROVAL),
              target: States.VINNUMALASTOFNUN_APPROVAL,
            },
            {
              cond: (application) =>
                goToState(
                  application,
                  States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
                ),
              target: States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
            },
            {
              target: States.VINNUMALASTOFNUN_APPROVE_EDITS,
            },
          ],
          CLOSED: { target: States.CLOSED },
        },
      },
      [States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS]: {
        entry: 'clearEmployerNationalRegistryId',
        exit: [
          'setEmployerReviewerNationalRegistryId',
          'restorePeriodsFromTemp',
          'restoreEmployersFromTemp',
          'setPreviousState',
        ],
        meta: {
          name: States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
          status: 'inprogress',
          actionCard: {
            pendingAction: employerApprovalStatePendingAction,
          },
          lifecycle: pruneAfterDays(970),
          onExit: [
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
          [DefaultEvents.EDIT]: {
            target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
          },
          CLOSED: { target: States.CLOSED },
        },
      },
      [States.EMPLOYER_APPROVE_EDITS]: {
        entry: 'removeNullPeriod',
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
          [DefaultEvents.EDIT]: {
            target: States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS,
          },
          [DefaultEvents.REJECT]: { target: States.EMPLOYER_EDITS_ACTION },
          CLOSED: { target: States.CLOSED },
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
                onEvent: DefaultEvents.ABORT,
                logMessage: statesMessages.employerActionDeleteChanges,
              },
            ],
          },
          lifecycle: pruneAfterDays(970),
          onExit: [
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
          },
          [DefaultEvents.ABORT]: [
            {
              cond: (application) =>
                goToState(application, States.VINNUMALASTOFNUN_APPROVAL),
              target: States.VINNUMALASTOFNUN_APPROVAL,
            },
            {
              cond: (application) =>
                goToState(application, States.VINNUMALASTOFNUN_APPROVE_EDITS),
              target: States.VINNUMALASTOFNUN_APPROVE_EDITS,
            },
            {
              cond: (application) =>
                goToState(
                  application,
                  States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
                ),
              target: States.VINNUMALASTOFNUN_APPROVE_EDITS,
            },
            {
              cond: (application) => goToState(application, States.APPROVED),
              target: States.APPROVED,
            },
          ],
          CLOSED: { target: States.CLOSED },
        },
      },
      [States.VINNUMALASTOFNUN_APPROVE_EDITS]: {
        entry: [
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
            ],
          },
          lifecycle: pruneAfterDays(970),
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
              target: States.RESIDENCE_GRANT_APPLICATION,
            },
            {
              target: States.RESIDENCE_GRANT_APPLICATION_NO_BIRTH_DATE,
            },
          ],
          CLOSED: { target: States.CLOSED },
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
                onEvent: DefaultEvents.EDIT,
                logMessage: statesMessages.editHistoryLogMessage,
              },
            ],
          },
          lifecycle: pruneAfterDays(970),
          onExit: [
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
      removePreviousState: assign((context) => {
        const { application } = context

        unset(application.answers, 'previousState')
        return context
      }),
      setPreviousState: assign((context, event) => {
        const { application } = context
        const { state } = application
        const { answers } = application
        const e = event.type as unknown
        if (e === 'xstate.init') {
          return context
        }
        if (
          e === DefaultEvents.APPROVE &&
          state === States.RESIDENCE_GRANT_APPLICATION_NO_BIRTH_DATE
        ) {
          return context
        }
        if (
          e === DefaultEvents.REJECT &&
          state === States.RESIDENCE_GRANT_APPLICATION
        ) {
          set(
            answers,
            'previousState',
            States.RESIDENCE_GRANT_APPLICATION_NO_BIRTH_DATE,
          )
          return context
        }

        set(answers, 'previousState', state)
        return context
      }),
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
       * Copy VMST periods to periods.
       * Applicant could have made changes on paper, so VMST most likely has the newest changes to periods.
       */
      setVMSTPeriods: assign((context, event) => {
        if (event.type !== DefaultEvents.EDIT) {
          return context
        }
        const { application } = context

        /**
         * Do not update periods if in these states.
         * We may be overwriting older edits that have not reached VMST (e.g. still pending employer approval)
         */
        if (
          application.state === States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS ||
          application.state === States.EMPLOYER_APPROVE_EDITS ||
          application.state === States.EMPLOYER_EDITS_ACTION
        ) {
          return context
        }
        const newPeriods = restructureVMSTPeriods(context)

        if (newPeriods.length > 0) {
          set(application.answers, 'periods', newPeriods)
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
