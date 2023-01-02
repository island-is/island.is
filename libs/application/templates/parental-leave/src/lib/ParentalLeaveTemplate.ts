import { assign } from 'xstate'
import set from 'lodash/set'
import unset from 'lodash/unset'
import cloneDeep from 'lodash/cloneDeep'

import {
  EphemeralStateLifeCycle,
  getValueViaPath,
  pruneAfterDays,
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
  NationalRegistryUserApi,
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
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  TransferRightsOption,
  SINGLE,
} from '../constants'
import { dataSchema } from './dataSchema'
import { answerValidators } from './answerValidators'
import { parentalLeaveFormMessages, statesMessages } from './messages'
import {
  hasEmployer,
  needsOtherParentApproval,
} from './parentalLeaveTemplateUtils'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getMaxMultipleBirthsDays,
  getMultipleBirthRequestDays,
  getOtherParentId,
  getSelectedChild,
} from '../lib/parentalLeaveUtils'
import { ChildrenApi } from '../dataProviders'

type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ABORT }
  | { type: DefaultEvents.EDIT }
  | { type: 'MODIFY' } // Ex: The user might modify their 'edits'.
  | { type: 'ADDITIONALDOCUMENTREQUIRED' } // Ex: VMST ask for more documents
  | { type: 'CLOSED' } // Ex: Close application

enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
  ORGINISATION_REVIEWER = 'vmst',
}

const determineNameFromApplicationAnswers = (application: Application) => {
  const applicationType = getValueViaPath(
    application.answers,
    'applicationType.option',
    undefined,
  ) as string | undefined

  if (
    applicationType === PARENTAL_GRANT ||
    applicationType === PARENTAL_GRANT_STUDENTS
  ) {
    return parentalLeaveFormMessages.shared.nameGrant
  }

  return parentalLeaveFormMessages.shared.name
}

const ParentalLeaveTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.PARENTAL_LEAVE,
  name: determineNameFromApplicationAnswers,
  institution: parentalLeaveFormMessages.shared.institution,
  readyForProduction: true,
  translationNamespaces: [ApplicationConfigurations.ParentalLeave.translation],
  dataSchema,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
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
          lifecycle: EphemeralStateLifeCycle,
          progress: 0.25,
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
              api: [UserProfileApi, NationalRegistryUserApi, ChildrenApi],
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
        ],
        meta: {
          name: States.DRAFT,
          status: 'draft',
          actionCard: {
            description: statesMessages.draftDescription,
          },
          lifecycle: pruneAfterDays(365),
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
        entry: 'assignToOtherParent',
        exit: ['clearAssignees'],
        meta: {
          name: States.OTHER_PARENT_APPROVAL,
          status: 'inprogress',
          actionCard: {
            description: statesMessages.otherParentApprovalDescription,
          },
          lifecycle: pruneAfterDays(365),
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
            description: statesMessages.otherParentActionDescription,
          },
          lifecycle: pruneAfterDays(365),
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
        exit: 'setEmployerReviewerNationalRegistryId',
        meta: {
          name: States.EMPLOYER_WAITING_TO_ASSIGN,
          status: 'inprogress',
          actionCard: {
            description: statesMessages.employerWaitingToAssignDescription,
          },
          lifecycle: pruneAfterDays(365),
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
          [DefaultEvents.REJECT]: { target: States.EMPLOYER_ACTION },
          [DefaultEvents.EDIT]: { target: States.DRAFT },
        },
      },
      [States.EMPLOYER_APPROVAL]: {
        entry: 'removeNullPeriod',
        exit: 'clearAssignees',
        meta: {
          name: States.EMPLOYER_APPROVAL,
          status: 'inprogress',
          actionCard: {
            description: statesMessages.employerApprovalDescription,
          },
          lifecycle: pruneAfterDays(365),
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
                ],
                externalData: ['children', 'navId', 'sendApplication'],
              },
              write: {
                answers: [
                  'employerNationalRegistryId',
                  'periods',
                  'selectedChild',
                  'payments',
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
            description: statesMessages.employerActionDescription,
          },
          lifecycle: pruneAfterDays(365),
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
        exit: ['clearAssignees', 'setNavId'],
        meta: {
          name: States.VINNUMALASTOFNUN_APPROVAL,
          status: 'inprogress',
          actionCard: {
            description: statesMessages.vinnumalastofnunApprovalDescription,
          },
          lifecycle: pruneAfterDays(970),
          progress: 0.75,
          onEntry: defineTemplateApi({
            action: ApiModuleActions.sendApplication,
            shouldPersistToExternalData: true,
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
          ADDITIONALDOCUMENTREQUIRED: {
            target: States.ADDITIONAL_DOCUMENT_REQUIRED,
          },
          [DefaultEvents.REJECT]: { target: States.VINNUMALASTOFNUN_ACTION },
          [DefaultEvents.EDIT]: { target: States.EDIT_OR_ADD_PERIODS },
        },
      },
      [States.VINNUMALASTOFNUN_ACTION]: {
        entry: 'assignToVMST',
        meta: {
          name: States.VINNUMALASTOFNUN_ACTION,
          status: 'inprogress',
          actionCard: {
            description: statesMessages.vinnumalastofnunActionDescription,
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
      [States.ADDITIONAL_DOCUMENT_REQUIRED]: {
        entry: 'assignToVMST',
        meta: {
          status: 'inprogress',
          name: States.ADDITIONAL_DOCUMENT_REQUIRED,
          actionCard: {
            description: statesMessages.additionalDocumentRequiredDescription,
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
      //     ADDITIONALDOCUMENTREQUIRED: { target: States.ADDITIONAL_DOCUMENT_REQUIRED },
      //     [DefaultEvents.APPROVE]: { target: States.APPROVED },
      //     [DefaultEvents.REJECT]: { target: States.VINNUMALASTOFNUN_ACTION },
      //     [DefaultEvents.EDIT]: { target: States.EDIT_OR_ADD_PERIODS },
      //   },
      // },
      [States.APPROVED]: {
        entry: 'assignToVMST',
        meta: {
          name: States.APPROVED,
          status: 'inprogress',
          actionCard: {
            description: statesMessages.approvedDescription,
          },
          lifecycle: pruneAfterDays(970),
          progress: 1,
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
          [DefaultEvents.EDIT]: { target: States.EDIT_OR_ADD_PERIODS },
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
          lifecycle: pruneAfterDays(730),
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
      [States.EDIT_OR_ADD_PERIODS]: {
        entry: [
          'createTempPeriods',
          'assignToVMST',
          'removeNullPeriod',
          'setNavId',
        ],
        exit: ['restorePeriodsFromTemp', 'removeNullPeriod', 'setNavId'],
        meta: {
          name: States.EDIT_OR_ADD_PERIODS,
          status: 'inprogress',
          actionCard: {
            description: statesMessages.editOrAddPeriodsDescription,
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
                import('../forms/EditOrAddPeriods').then((val) =>
                  Promise.resolve(val.EditOrAddPeriods),
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
              target: States.APPROVED,
            },
          ],
        },
      },
      [States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS]: {
        exit: 'setEmployerReviewerNationalRegistryId',
        meta: {
          name: States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
          status: 'inprogress',
          actionCard: {
            description:
              statesMessages.employerWaitingToAssignForEditsDescription,
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
          [DefaultEvents.ASSIGN]: { target: States.EMPLOYER_APPROVE_EDITS },
          [DefaultEvents.REJECT]: { target: States.EMPLOYER_EDITS_ACTION },
          [DefaultEvents.EDIT]: { target: States.EDIT_OR_ADD_PERIODS },
        },
      },
      [States.EMPLOYER_APPROVE_EDITS]: {
        entry: ['assignToVMST', 'removeNullPeriod'],
        exit: 'clearAssignees',
        meta: {
          name: States.EMPLOYER_APPROVE_EDITS,
          status: 'inprogress',
          actionCard: {
            description: statesMessages.employerApproveEditsDescription,
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
                ],
                externalData: ['children', 'navId', 'sendApplication'],
              },
              write: {
                answers: [
                  'employerNationalRegistryId',
                  'periods',
                  'selectedChild',
                  'payments',
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
          [DefaultEvents.APPROVE]: [
            {
              target: States.VINNUMALASTOFNUN_APPROVE_EDITS,
            },
          ],
          [DefaultEvents.EDIT]: { target: States.EDIT_OR_ADD_PERIODS },
          [DefaultEvents.REJECT]: { target: States.EMPLOYER_EDITS_ACTION },
        },
      },
      [States.EMPLOYER_EDITS_ACTION]: {
        entry: 'assignToVMST',
        exit: 'restorePeriodsFromTemp',
        meta: {
          name: States.EMPLOYER_EDITS_ACTION,
          status: 'inprogress',
          actionCard: {
            description: statesMessages.employerEditsActionDescription,
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
            target: States.EDIT_OR_ADD_PERIODS,
          },
          [DefaultEvents.ABORT]: { target: States.APPROVED },
        },
      },
      [States.VINNUMALASTOFNUN_APPROVE_EDITS]: {
        entry: ['assignToVMST', 'removeNullPeriod'],
        exit: 'clearTemp',
        meta: {
          name: States.VINNUMALASTOFNUN_APPROVE_EDITS,
          status: 'inprogress',
          actionCard: {
            description: statesMessages.vinnumalastofnunApproveEditsDescription,
          },
          lifecycle: pruneAfterDays(970),
          progress: 0.75,
          onEntry: defineTemplateApi({
            action: ApiModuleActions.sendApplication,
            shouldPersistToExternalData: true,
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
          ADDITIONALDOCUMENTREQUIRED: {
            target: States.ADDITIONAL_DOCUMENT_REQUIRED,
          },
          [DefaultEvents.EDIT]: { target: States.EDIT_OR_ADD_PERIODS },
          [DefaultEvents.REJECT]: {
            target: States.VINNUMALASTOFNUN_EDITS_ACTION,
          },
        },
      },
      [States.VINNUMALASTOFNUN_EDITS_ACTION]: {
        entry: 'assignToVMST',
        exit: 'restorePeriodsFromTemp',
        meta: {
          name: States.VINNUMALASTOFNUN_EDITS_ACTION,
          status: 'inprogress',
          actionCard: {
            description: statesMessages.vinnumalastofnunEditsActionDescription,
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
            target: States.EDIT_OR_ADD_PERIODS,
          },
          [DefaultEvents.ABORT]: { target: States.APPROVED },
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

        set(answers, 'periods', cloneDeep(answers.tempPeriods))
        unset(answers, 'tempPeriods')

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
          // set(application.answers, 'otherParentEmail', undefined)
          // set(application.answers, 'otherParentPhoneNumber', '')
          // set(application.answers, 'requestRights.isRequestingRights', NO)
          // set(application.answers, 'requestRights.requestDays', '0')
          // set(application.answers, 'giveRights.giveDays', '0')
          // set(application.answers, 'giveRights.isGivingRights', NO)
          // set(application.answers, 'transferRights', TransferRightsOption.NONE)
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

        const answers = getApplicationAnswers(application.answers)

        if (answers.usePersonalAllowance === NO) {
          if (application.answers.personalAllowance) {
            unset(application.answers, 'personalAllowance')
          }
        }

        return context
      }),
      clearSpouseAllowanceIfUseSpouseAllowanceIsNo: assign((context) => {
        const { application } = context

        const answers = getApplicationAnswers(application.answers)

        if (answers.usePersonalAllowanceFromSpouse === NO) {
          if (application.answers.personalAllowanceFromSpouse) {
            unset(application.answers, 'personalAllowanceFromSpouse')
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

        set(
          answers,
          'employerReviewerNationalRegistryId',
          application.assignees[0],
        )

        return context
      }),
      attemptToSetPrimaryParentAsOtherParent: assign((context) => {
        const { application } = context
        const { answers, externalData } = application
        const selectedChild = getSelectedChild(answers, externalData)

        if (!selectedChild) {
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
