import set from 'lodash/set'
import { assign } from 'xstate'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  FormModes,
  UserProfileApi,
  ApplicationConfigurations,
  InstitutionNationalIds,
} from '@island.is/application/types'
import { Events, Roles, States } from '../utils/constants'
import { CodeOwners } from '@island.is/shared/constants'
import { dataSchema } from './dataSchema'
import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import * as m from './messages'
import {
  HouseholdMembersApi,
  NationalRegistryApi,
  RentalAgreementsApi,
} from '../dataProviders'
import { hasRentalAgreements } from '../utils/rentalAgreementUtils'
import * as kennitala from 'kennitala'
import {
  getAssigneeNationalIds,
  needsHouseholdMemberApproval,
} from '../utils/assigneeUtils'

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
  dataSchema,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Forkröfur',
          progress: 0,
          status: FormModes.DRAFT,
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
                RentalAgreementsApi,
                HouseholdMembersApi,
              ],
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: [
            {
              target: States.DRAFT,
              cond: ({ application }: ApplicationContext) =>
                hasRentalAgreements(application),
            },
            {
              target: States.NO_RENTAL_AGREEMENT,
              cond: ({ application }: ApplicationContext) =>
                !hasRentalAgreements(application),
            },
          ],
        },
      },
      [States.NO_RENTAL_AGREEMENT]: {
        meta: {
          name: 'Enginn leigusamningur',
          progress: 0.2,
          status: FormModes.DRAFT,
          lifecycle: DefaultStateLifeCycle,
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
        meta: {
          name: 'Main form',
          progress: 0.4,
          status: FormModes.DRAFT,
          lifecycle: DefaultStateLifeCycle,
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
        // exit: 'clearAssignees',
        meta: {
          name: 'Samþykki heimilismanna',
          progress: 0.6,
          status: FormModes.IN_PROGRESS,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.UNSIGNED_ASSIGNEE,
              formLoader: () =>
                import('../forms/assigneeApprovalForm').then((module) =>
                  Promise.resolve(module.AssigneeApproval),
                ),
              write: 'all',
              read: 'all',
              api: [NationalRegistryApi],
            },
            {
              id: Roles.SIGNED_ASSIGNEE,
              formLoader: () =>
                import('../forms/assigneeWaitingForm').then((module) =>
                  Promise.resolve(module.AssigneeWaitingForm),
                ),
              read: 'all',
            },
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/assigneeWaitingForm').then((module) =>
                  Promise.resolve(module.AssigneeWaitingForm),
                ),
              read: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: [
            {
              target: States.IN_REVIEW,
              cond: ({ application }: ApplicationContext) => {
                const signed = (application.answers?.householdMemberApprovals ??
                  []) as string[]
                const assignees = application.assignees ?? []
                return signed.length >= assignees.length
              },
            },
            { target: States.ASSIGNEE_APPROVAL },
          ],
        },
      },
      [States.IN_REVIEW]: {
        entry: 'assignToInstitution',
        meta: {
          name: 'Í vinnslu',
          progress: 0.6,
          status: FormModes.IN_PROGRESS,
          lifecycle: DefaultStateLifeCycle,
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
          lifecycle: DefaultStateLifeCycle,
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
          lifecycle: DefaultStateLifeCycle,
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
          lifecycle: DefaultStateLifeCycle,
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
    actions: {
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
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    const normalizedNationalId = kennitala.isValid(nationalId)
      ? kennitala.sanitize(nationalId)
      : nationalId
    if (
      normalizedNationalId ===
        kennitala.sanitize(
          InstitutionNationalIds.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
        ) ||
      normalizedNationalId === kennitala.sanitize('0101304929') // Gervimaður Bretland, only for testing
    ) {
      return Roles.INSTITUTION
    }

    if (
      nationalId === application.applicant ||
      normalizedNationalId ===
        (kennitala.isValid(application.applicant)
          ? kennitala.sanitize(application.applicant)
          : application.applicant)
    ) {
      return Roles.APPLICANT
    }

    const assignees = application.assignees ?? []
    if (!assignees.includes(normalizedNationalId)) {
      return undefined
    }

    const signed = (application.answers?.householdMemberApprovals ??
      []) as string[]
    const hasSigned = signed.some(
      (id) =>
        (kennitala.isValid(id) ? kennitala.sanitize(id) : id) ===
        normalizedNationalId,
    )
    return hasSigned ? Roles.SIGNED_ASSIGNEE : Roles.UNSIGNED_ASSIGNEE
  },
}

export default template
