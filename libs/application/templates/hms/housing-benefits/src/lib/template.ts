import set from 'lodash/set'
import { assign } from 'xstate'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  DefaultEvents,
  FormModes,
  UserProfileApi,
  ApplicationConfigurations,
  InstitutionNationalIds,
} from '@island.is/application/types'
import { Events, Roles, States } from '../utils/constants'
import { CodeOwners } from '@island.is/shared/constants'
import { dataSchema } from './dataSchema'
import { EphemeralStateLifeCycle } from '@island.is/application/core'
import {
  DRAFT_ENTERED_AT_KEY,
  housingBenefitsPruneLifecycle,
} from '../utils/lifecycle'
import { getDraftPruneReminderScheduledNotifications } from '../utils/notifications'
import * as m from './messages'
import {
  AssigneeUserProfileApi,
  AssigneePersonalTaxReturnApi,
  ChildrenCustodyInformationApiV3,
  DomicileResidentsByRentalContractsApi,
  HouseholdMembersApi,
  NationalRegistryApi,
  PersonalTaxReturnApi,
  RentalAgreementsApi,
  AssigneeNationalRegistryApi,
  AssigneeChildrenCustodyInformationApiV3,
  NotifyAssigneesApi,
  NotifyApplicantOnAssigneeSubmitApi,
  NotifyApplicantOnAssigneeRejectApi,
  NotifyApplicantOnExtraDataRequestedApi,
  NotifyApplicantOnApprovedByInstitutionApi,
  NotifyApplicantOnRejectedByInstitutionApi,
  SubmitApplicationApi,
} from '../dataProviders'
import { hasRentalAgreements } from '../utils/rentalAgreementUtils'
import { mustFileTaxReturnBeforeApplying } from '../utils/utils'
import * as kennitala from 'kennitala'
import {
  getAssigneeNationalIds,
  getCompletedAssigneeNationalIdSet,
  needsHouseholdMemberApproval,
  shouldShowApplicantSubmitAccessAgreementSection,
} from '../utils/assigneeUtils'
import { getRejectedAssigneeNationalIds } from '../utils/assigneeRejectionUtils'
import { getValueViaPath } from '@island.is/application/core'
import {
  getHouseholdTableRepeaterWithoutRejectedAssignees,
  hasNewHouseholdMembersNeedingApproval,
} from '../utils/addHouseholdMemberUtils'
import { mapUserToRole } from '../utils/mapUserToRole'
import { housingBenefitsActionCards } from '../utils/actionCardMeta'
import { AuthDelegationType } from '@island.is/shared/types'
import { ApiScope, HmsScope } from '@island.is/auth/scopes'
import { Features } from '@island.is/feature-flags'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.HOUSING_BENEFITS,
  name: m.miscMessages.applicationName,
  codeOwner: CodeOwners.NordaApplications,
  institution: m.miscMessages.institutionName,
  translationNamespaces: ApplicationConfigurations.HousingBenefits.translation,
  featureFlag: Features.isHousingBenefitsEnabled,
  dataSchema,
  allowedDelegations: [
    {
      type: AuthDelegationType.GeneralMandate,
    },
    {
      type: AuthDelegationType.LegalGuardian,
    },
    {
      type: AuthDelegationType.LegalRepresentative,
    },
    {
      type: AuthDelegationType.PersonalRepresentative,
    },
    {
      type: AuthDelegationType.Custom,
    },
  ],
  requiredScopes: [HmsScope.properties, HmsScope.housingBenefits, ApiScope.hms],
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Forkröfur',
          progress: 0,
          status: FormModes.NOT_STARTED,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/prerequisitesForm').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              api: [
                UserProfileApi,
                NationalRegistryApi,
                ChildrenCustodyInformationApiV3,
                RentalAgreementsApi,
                DomicileResidentsByRentalContractsApi,
                PersonalTaxReturnApi,
                HouseholdMembersApi,
              ],
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: [
            {
              target: States.NO_RENTAL_AGREEMENT,
              cond: ({ application }: ApplicationContext) =>
                !hasRentalAgreements(application),
            },
            {
              target: States.TAX_RETURN_REQUIRED,
              cond: ({ application }: ApplicationContext) =>
                mustFileTaxReturnBeforeApplying(application),
            },
            {
              target: States.DRAFT,
            },
          ],
        },
      },
      [States.TAX_RETURN_REQUIRED]: {
        meta: {
          name: 'Skattframtal vantar',
          progress: 0.2,
          status: FormModes.DRAFT,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/noTaxReturnForm').then((module) =>
                  Promise.resolve(module.TaxReturnRequiredForm),
                ),
              read: 'all',
              delete: true,
            },
          ],
        },
      },
      [States.NO_RENTAL_AGREEMENT]: {
        meta: {
          name: 'Enginn leigusamningur',
          progress: 0.2,
          status: FormModes.DRAFT,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/noRentalAgreementForm').then((module) =>
                  Promise.resolve(module.NoRentalAgreementForm),
                ),
              read: 'all',
              delete: true,
            },
          ],
        },
      },
      [States.DRAFT]: {
        entry: 'recordDraftEnteredAt',
        meta: {
          name: 'Main form',
          progress: 0.4,
          status: FormModes.DRAFT,
          lifecycle: housingBenefitsPruneLifecycle,
          scheduledNotifications: getDraftPruneReminderScheduledNotifications,
          actionCard: housingBenefitsActionCards.draft,
          onExit: NotifyAssigneesApi,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/mainForm').then((module) =>
                  Promise.resolve(module.MainForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: [
            {
              target: States.ASSIGNEE_APPROVAL,
              cond: ({ application }: ApplicationContext) =>
                needsHouseholdMemberApproval(application),
            },
            {
              target: States.IN_REVIEW,
            },
          ],
        },
      },
      [States.ASSIGNEE_APPROVAL]: {
        entry: 'assignHouseholdMembers',
        meta: {
          name: 'Samþykki heimilismanna',
          progress: 0.6,
          status: FormModes.IN_PROGRESS,
          lifecycle: housingBenefitsPruneLifecycle,
          actionCard: housingBenefitsActionCards.assigneeApproval,
          onExit: [
            NotifyApplicantOnAssigneeSubmitApi,
            NotifyApplicantOnAssigneeRejectApi,
          ],
          roles: [
            {
              id: Roles.UNSIGNED_PREREQ_ASSIGNEE,
              formLoader: () =>
                import(
                  '../forms/assigneeApprovalState/assigneePrereqForm'
                ).then((module) => Promise.resolve(module.AssigneePrereqForm)),
              write: 'all',
              read: 'all',
              api: [
                NationalRegistryApi,
                PersonalTaxReturnApi,
                AssigneeNationalRegistryApi,
                AssigneePersonalTaxReturnApi,
                AssigneeUserProfileApi,
                AssigneeChildrenCustodyInformationApiV3,
                UserProfileApi,
              ],
            },
            {
              id: Roles.UNSIGNED_DRAFT_ASSIGNEE,
              formLoader: () =>
                import('../forms/assigneeApprovalState/assigneeDraftForm').then(
                  (module) => Promise.resolve(module.AssigneeDraftForm),
                ),
              write: 'all',
              read: 'all',
              api: [
                AssigneeNationalRegistryApi,
                AssigneeChildrenCustodyInformationApiV3,
              ],
            },
            {
              id: Roles.SIGNED_ASSIGNEE,
              formLoader: () =>
                import(
                  '../forms/assigneeApprovalState/assigneeWaitingForm'
                ).then((module) => Promise.resolve(module.AssigneeWaitingForm)),
              read: 'all',
            },
            {
              id: Roles.REJECTED_ASSIGNEE,
              formLoader: () =>
                import(
                  '../forms/assigneeApprovalState/assigneeWaitingForm'
                ).then((module) => Promise.resolve(module.AssigneeWaitingForm)),
              read: 'all',
            },
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import(
                  '../forms/assigneeApprovalState/assigneeWaitingForm'
                ).then((module) => Promise.resolve(module.AssigneeWaitingForm)),
              read: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: [
            {
              target: States.APPLICANT_SUBMIT,
              actions: 'recordSignedAssignee',
              cond: 'isLastAssigneeToSign',
            },
            {
              target: States.ASSIGNEE_APPROVAL,
              actions: 'recordSignedAssignee',
            },
          ],
          [DefaultEvents.EDIT]: {
            target: States.ASSIGNEE_APPROVAL,
          },
          [DefaultEvents.REJECT]: [
            {
              target: States.APPLICANT_SUBMIT,
              actions: 'recordRejectedAssignee',
              cond: 'isLastAssigneeToSign',
            },
            {
              target: States.ASSIGNEE_APPROVAL,
              actions: 'recordRejectedAssignee',
            },
          ],
        },
      },
      [States.APPLICANT_SUBMIT]: {
        meta: {
          name: 'Staðfesta',
          progress: 0.8,
          status: FormModes.IN_PROGRESS,
          lifecycle: housingBenefitsPruneLifecycle,
          actionCard: housingBenefitsActionCards.applicantSubmit,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import(
                  '../forms/applicantSubmitState/applicantSubmitForm'
                ).then((module) => Promise.resolve(module.ApplicantSubmitForm)),
              read: 'all',
              write: 'all',
              delete: true,
            },
            {
              id: Roles.SIGNED_ASSIGNEE,
              formLoader: () =>
                import('../forms/applicantSubmitState/assigneeForm').then(
                  (module) =>
                    Promise.resolve(module.ApplicantSubmitFormAssigneeVersion),
                ),
              read: 'all',
            },
            {
              id: Roles.REJECTED_ASSIGNEE,
              formLoader: () =>
                import('../forms/applicantSubmitState/assigneeForm').then(
                  (module) =>
                    Promise.resolve(module.ApplicantSubmitFormAssigneeVersion),
                ),
              read: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.IN_REVIEW,
            cond: ({ application }: ApplicationContext) =>
              !shouldShowApplicantSubmitAccessAgreementSection(
                application.answers,
                application.externalData,
              ),
          },
          [DefaultEvents.EDIT]: {
            target: States.ADD_HOUSEHOLD_MEMBER,
          },
        },
      },
      [States.ADD_HOUSEHOLD_MEMBER]: {
        entry: 'prepareAddHouseholdMemberTable',
        meta: {
          name: 'Bæta við heimilismanni',
          progress: 0.8,
          status: FormModes.IN_PROGRESS,
          lifecycle: housingBenefitsPruneLifecycle,
          onExit: NotifyAssigneesApi,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/addHouseholdMemberForm').then((module) =>
                  Promise.resolve(module.AddHouseholdMemberForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: [
            {
              target: States.ASSIGNEE_APPROVAL,
              actions: 'prepareAssigneeReapproval',
              cond: ({ application }: ApplicationContext) =>
                hasNewHouseholdMembersNeedingApproval(application),
            },
            {
              target: States.APPLICANT_SUBMIT,
            },
          ],
        },
      },
      [States.IN_REVIEW]: {
        entry: 'assignToInstitution',
        meta: {
          name: 'Í vinnslu',
          progress: 0.6,
          status: FormModes.IN_PROGRESS,
          lifecycle: housingBenefitsPruneLifecycle,
          actionCard: housingBenefitsActionCards.inReview,
          onEntry: SubmitApplicationApi,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/inReviewForm').then((module) =>
                  Promise.resolve(module.inReviewForm),
                ),
              read: 'all',
              delete: true,
            },
            {
              id: Roles.SIGNED_ASSIGNEE,
              formLoader: () =>
                import('../forms/inReviewForm').then((module) =>
                  Promise.resolve(module.inReviewForm),
                ),
              read: 'all',
            },
            {
              id: Roles.REJECTED_ASSIGNEE,
              formLoader: () =>
                import('../forms/inReviewForm').then((module) =>
                  Promise.resolve(module.inReviewForm),
                ),
              read: 'all',
            },
            {
              id: Roles.INSTITUTION,
              formLoader: () =>
                import('../forms/inReviewForm/institutionForm').then((module) =>
                  Promise.resolve(module.institutionForm),
                ),
              write: 'all',
              read: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: {
            target: States.APPROVED,
          },
          [DefaultEvents.REJECT]: {
            target: States.REJECTED,
          },
          [DefaultEvents.EDIT]: {
            target: States.EXTRA_DATA,
          },
        },
      },
      [States.EXTRA_DATA]: {
        entry: 'clearAssignees',
        meta: {
          name: 'Extra data',
          progress: 0.65,
          status: FormModes.IN_PROGRESS,
          lifecycle: housingBenefitsPruneLifecycle,
          actionCard: housingBenefitsActionCards.extraData,
          onEntry: NotifyApplicantOnExtraDataRequestedApi,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/extraDataForm').then((module) =>
                  Promise.resolve(module.ExtraDataForm),
                ),
              actions: [
                {
                  event: 'SUBMIT',
                  name: m.extraDataMessages.submitButton,
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.IN_REVIEW,
          },
        },
      },
      [States.APPROVED]: {
        entry: 'clearAssignees',
        meta: {
          name: 'Samþykkt',
          progress: 1,
          status: FormModes.APPROVED,
          lifecycle: housingBenefitsPruneLifecycle,
          actionCard: housingBenefitsActionCards.approved,
          onEntry: NotifyApplicantOnApprovedByInstitutionApi,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/approvedForm/approvedForm').then((module) =>
                  Promise.resolve(module.approvedForm),
                ),
              read: 'all',
            },
          ],
        },
      },
      [States.REJECTED]: {
        entry: 'clearAssignees',
        meta: {
          name: 'Hafnað',
          progress: 1,
          status: FormModes.REJECTED,
          lifecycle: housingBenefitsPruneLifecycle,
          actionCard: housingBenefitsActionCards.rejected,
          onEntry: NotifyApplicantOnRejectedByInstitutionApi,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/rejectedForm/rejectedForm').then((module) =>
                  Promise.resolve(module.rejectedForm),
                ),
              read: 'all',
              delete: true,
            },
          ],
        },
      },
    },
  },
  stateMachineOptions: {
    guards: {
      isLastAssigneeToSign: ({ application }, event) => {
        const nationalId = (event as Events).nationalId
        if (!nationalId) return false
        const normalized = kennitala.isValid(nationalId)
          ? kennitala.sanitize(nationalId)
          : nationalId
        const completed = getCompletedAssigneeNationalIdSet(application)
        completed.add(normalized)
        return completed.size >= (application.assignees ?? []).length
      },
    },
    actions: {
      recordDraftEnteredAt: assign((context) => {
        const { application } = context
        const existing = getValueViaPath<string>(
          application.answers,
          DRAFT_ENTERED_AT_KEY,
        )
        if (existing) {
          return context
        }
        set(
          application,
          `answers.${DRAFT_ENTERED_AT_KEY}`,
          new Date().toISOString(),
        )
        return context
      }),
      recordSignedAssignee: assign((context, event) => {
        const nationalId = (event as Events).nationalId
        if (!nationalId) return context
        const { application } = context
        const normalized = kennitala.isValid(nationalId)
          ? kennitala.sanitize(nationalId)
          : nationalId
        const existing = (application.answers?.signedAssignees ??
          []) as string[]
        const existingSet = new Set(
          existing.map((id) =>
            kennitala.isValid(id) ? kennitala.sanitize(id) : id,
          ),
        )
        if (!existingSet.has(normalized)) {
          set(application, 'answers.signedAssignees', [...existing, normalized])
        }
        return context
      }),
      recordRejectedAssignee: assign((context, event) => {
        const nationalId = (event as Events).nationalId
        if (!nationalId) return context
        const { application } = context
        const normalized = kennitala.isValid(nationalId)
          ? kennitala.sanitize(nationalId)
          : nationalId
        const existing = (application.answers?.rejectedAssignees ??
          []) as string[]
        const existingSet = new Set(
          existing.map((id) =>
            kennitala.isValid(id) ? kennitala.sanitize(id) : id,
          ),
        )
        if (!existingSet.has(normalized)) {
          set(application, 'answers.rejectedAssignees', [
            ...existing,
            normalized,
          ])
        }
        return context
      }),
      assignHouseholdMembers: assign((context) => {
        const { application } = context
        const assigneesNationalIds = getAssigneeNationalIds(application)
        if (assigneesNationalIds.length > 0) {
          const normalized = assigneesNationalIds
            .filter((id) => kennitala.isValid(id))
            .map((id) => kennitala.sanitize(id))
          set(application, 'assignees', normalized)
        }
        return context
      }),
      assignToInstitution: assign((context) => {
        const { application } = context
        const existing = (application.assignees ?? []).map((id) =>
          kennitala.isValid(id) ? kennitala.sanitize(id) : id,
        )
        const hmsInstitutionNationalId = kennitala.sanitize(
          InstitutionNationalIds.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
        )
        // Gervimaður Bretland — dev only, so institution UI can be tested locally
        const devInstitutionTesterNationalId = kennitala.sanitize('0101304929')
        set(application, 'assignees', [
          ...new Set([
            ...existing,
            hmsInstitutionNationalId,
            devInstitutionTesterNationalId,
          ]),
        ])
        return context
      }),
      clearAssignees: assign((context) => {
        const { application } = context
        set(application, 'assignees', [])
        return context
      }),
      prepareAddHouseholdMemberTable: assign((context) => {
        const { application } = context
        const filtered =
          getHouseholdTableRepeaterWithoutRejectedAssignees(application)
        if (filtered !== undefined) {
          set(application, 'answers.householdMembersTableRepeater', filtered)
        }
        return context
      }),
      prepareAssigneeReapproval: assign((context) => {
        const { application } = context
        const assigneeKeys = new Set(
          getAssigneeNationalIds(application).map((id) =>
            kennitala.isValid(id) ? kennitala.sanitize(id) : id,
          ),
        )
        const normalizeAssigneeId = (id: string) =>
          kennitala.isValid(id) ? kennitala.sanitize(id) : id
        const signed = (
          getValueViaPath<string[]>(application.answers, 'signedAssignees') ??
          []
        ).filter((id) => assigneeKeys.has(normalizeAssigneeId(id)))
        const rejected = getRejectedAssigneeNationalIds(application).filter(
          (id) => assigneeKeys.has(normalizeAssigneeId(id)),
        )
        set(application, 'answers.signedAssignees', signed)
        set(application, 'answers.rejectedAssignees', rejected)
        return context
      }),
    },
  },
  mapUserToRole,
}

export default template
