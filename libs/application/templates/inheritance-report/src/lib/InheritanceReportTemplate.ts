import set from 'lodash/set'
import { assign } from 'xstate'
import {
  coreHistoryMessages,
  pruneAfterDays,
  getValueViaPath,
} from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  defineTemplateApi,
  NationalRegistryUserApi,
  UserProfileApi,
  DefaultEvents,
  ApplicationConfigurations,
} from '@island.is/application/types'
import { m } from './messages'
import { inheritanceReportSchema } from './dataSchema'
import {
  ApiActions,
  ESTATE_INHERITANCE,
  InheritanceReportEvent,
  PREPAID_INHERITANCE,
  Roles,
  States,
} from './constants'
import { EstateOnEntryApi, MaritalStatusApi } from '../dataProviders'
import { FeatureFlagClient } from '@island.is/feature-flags'
import {
  getApplicationFeatureFlags,
  InheritanceReportFeatureFlags,
} from './getApplicationFeatureFlags'
import { CodeOwners } from '@island.is/shared/constants'
import { getAssigneesNationalIdList } from './utils/getAssigneesNationalIdList'
import { allPartiesHaveApproved } from './utils/allPartiesHaveApproved'
import { nationalIdsMatch } from './utils/helpers'
import { EstateMember } from '../types'

const configuration =
  ApplicationConfigurations[ApplicationTypes.INHERITANCE_REPORT]

const InheritanceReportTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<InheritanceReportEvent>,
  InheritanceReportEvent
> = {
  type: ApplicationTypes.INHERITANCE_REPORT,
  name: ({ answers }) =>
    answers.applicationFor === PREPAID_INHERITANCE
      ? m.prerequisitesTitle.defaultMessage +
        ' - ' +
        m.applicationNamePrepaid.defaultMessage
      : answers.applicationFor === ESTATE_INHERITANCE
      ? m.prerequisitesTitle.defaultMessage +
        ' - ' +
        m.applicationNameEstate.defaultMessage
      : m.prerequisitesTitle.defaultMessage,
  codeOwner: CodeOwners.Juni,
  institution: m.institution,
  dataSchema: inheritanceReportSchema,
  translationNamespaces: configuration.translation,
  allowMultipleApplicationsInDraft: false,
  stateMachineConfig: {
    initial: States.prerequisites,
    states: {
      [States.prerequisites]: {
        meta: {
          name: '',
          status: 'draft',
          progress: 0,
          lifecycle: pruneAfterDays(60),
          roles: [
            {
              id: Roles.ESTATE_INHERITANCE_APPLICANT,
              formLoader: async ({ featureFlagClient }) => {
                const featureFlags = await getApplicationFeatureFlags(
                  featureFlagClient as FeatureFlagClient,
                )

                const getForm = await import('../forms/prerequisites').then(
                  (val) => val.getForm,
                )

                return getForm({
                  allowEstateApplication:
                    featureFlags[
                      InheritanceReportFeatureFlags.AllowEstateApplication
                    ],
                  allowPrepaidApplication:
                    featureFlags[
                      InheritanceReportFeatureFlags.AllowPrepaidApplication
                    ],
                })
              },
              actions: [{ event: 'SUBMIT', name: '', type: 'primary' }],
              write: 'all',
              delete: true,
            },
          ],
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationStarted,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
        },
        on: {
          SUBMIT: {
            target: States.draft,
          },
        },
      },
      [States.draft]: {
        meta: {
          name: '',
          status: 'draft',
          progress: 0.15,
          lifecycle: pruneAfterDays(60),
          roles: [
            {
              id: Roles.ESTATE_INHERITANCE_APPLICANT,
              formLoader: () =>
                import('../forms/form').then((module) =>
                  Promise.resolve(module.estateInheritanceForm),
                ),
              actions: [{ event: 'SUBMIT', name: '', type: 'primary' }],
              write: 'all',
              delete: true,
              api: [NationalRegistryUserApi, UserProfileApi, EstateOnEntryApi],
            },
            {
              id: Roles.PREPAID_INHERITANCE_APPLICANT,
              formLoader: () =>
                import('../forms/form').then((module) =>
                  Promise.resolve(module.prepaidInheritanceForm),
                ),
              actions: [{ event: 'SUBMIT', name: '', type: 'primary' }],
              write: 'all',
              delete: true,
              api: [
                NationalRegistryUserApi,
                UserProfileApi,
                EstateOnEntryApi,
                MaritalStatusApi,
              ],
            },
          ],
        },
        on: {
          SUBMIT: {
            target: States.inReview,
            actions: 'setApplicantAsApproved',
          },
        },
      },
      [States.inReview]: {
        entry: 'assignEstateMembers',
        exit: 'clearAssignees',
        meta: {
          name: 'InReview',
          status: 'inprogress',
          progress: 0.6,
          lifecycle: pruneAfterDays(30),
          onExit: defineTemplateApi({
            action: ApiActions.approveByAssignee,
            shouldPersistToExternalData: false,
            throwOnError: true,
            triggerEvent: DefaultEvents.APPROVE,
          }),
          actionCard: {
            pendingAction: (application, role, nationalId) => {
              if (role === Roles.ASSIGNEE) {
                const heirs = getValueViaPath<EstateMember[]>(
                  application.answers,
                  'heirs.data',
                  [],
                )
                const currentUserHeir = heirs?.find((heir) =>
                  nationalIdsMatch(heir.nationalId, nationalId),
                )

                if (currentUserHeir?.approved) {
                  return {
                    title: m.assigneeApprovedTitle,
                    content: m.assigneeApprovedDescription,
                    displayStatus: 'success',
                  }
                }

                return {
                  title: m.assigneeInReviewInfoTitle,
                  content: m.assigneeInReviewDescription,
                  displayStatus: 'warning',
                }
              }
              // Check if all parties have approved
              const allApproved = allPartiesHaveApproved(application.answers)

              if (allApproved) {
                return {
                  title: m.applicantInReviewTitleAllApproved,
                  content: m.applicantInReviewDescriptionAllApproved,
                  displayStatus: 'success',
                }
              }

              return {
                title: m.applicantInReviewTitle,
                content: m.applicantInReviewDescription,
                displayStatus: 'info',
              }
            },
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationSent,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
          roles: [
            {
              id: Roles.ESTATE_INHERITANCE_APPLICANT,
              formLoader: () =>
                import('../forms/inReview').then((val) =>
                  Promise.resolve(val.applicantInReviewForm),
                ),
              actions: [
                { event: DefaultEvents.EDIT, name: '', type: 'subtle' },
                { event: DefaultEvents.SUBMIT, name: '', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
            },
            {
              id: Roles.PREPAID_INHERITANCE_APPLICANT,
              formLoader: () =>
                import('../forms/inReview').then((val) =>
                  Promise.resolve(val.applicantInReviewForm),
                ),
              actions: [
                { event: DefaultEvents.EDIT, name: '', type: 'subtle' },
                { event: DefaultEvents.SUBMIT, name: '', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
            },
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/inReview').then((val) =>
                  Promise.resolve(val.assigneeInReviewForm),
                ),
              actions: [
                { event: DefaultEvents.APPROVE, name: '', type: 'primary' },
                { event: DefaultEvents.REJECT, name: '', type: 'reject' },
              ],
              read: 'all',
            },
          ],
        },
        on: {
          EDIT: {
            target: States.draft,
          },
          SUBMIT: {
            target: States.signing,
          },
          APPROVE: {
            target: States.inReview,
          },
          REJECT: {
            target: States.draft,
          },
        },
      },
      [States.signing]: {
        meta: {
          name: 'Signing',
          status: 'inprogress',
          progress: 0.85,
          lifecycle: pruneAfterDays(30),
          onEntry: [
            defineTemplateApi({
              action: ApiActions.submitToSyslumenn,
              throwOnError: true,
            }),
            defineTemplateApi({
              action: ApiActions.getSignatories,
            }),
          ],
          roles: [
            {
              id: Roles.ESTATE_INHERITANCE_APPLICANT,
              formLoader: () =>
                import('../forms/signing').then((val) =>
                  Promise.resolve(val.signingForm),
                ),
              actions: [
                { event: DefaultEvents.EDIT, name: '', type: 'subtle' },
                { event: DefaultEvents.SUBMIT, name: '', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
            },
            {
              id: Roles.PREPAID_INHERITANCE_APPLICANT,
              formLoader: () =>
                import('../forms/signing').then((val) =>
                  Promise.resolve(val.signingForm),
                ),
              actions: [
                { event: DefaultEvents.EDIT, name: '', type: 'subtle' },
                { event: DefaultEvents.SUBMIT, name: '', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
            },
          ],
        },
        on: {
          EDIT: {
            target: States.draft,
          },
          SUBMIT: {
            target: States.done,
          },
        },
      },
      [States.done]: {
        meta: {
          name: 'Done',
          status: 'approved',
          progress: 1,
          lifecycle: pruneAfterDays(60),
          onEntry: defineTemplateApi({
            action: ApiActions.completeApplication,
          }),
          roles: [
            {
              id: Roles.ESTATE_INHERITANCE_APPLICANT,
              formLoader: () =>
                import('../forms/done').then((val) =>
                  Promise.resolve(val.done),
                ),
              read: 'all',
            },
            {
              id: Roles.PREPAID_INHERITANCE_APPLICANT,
              formLoader: () =>
                import('../forms/done').then((val) =>
                  Promise.resolve(val.done),
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
      assignEstateMembers: assign((context) => {
        const { application } = context
        const assigneesNationalIds = getAssigneesNationalIdList(application)

        if (assigneesNationalIds && assigneesNationalIds.length > 0) {
          set(application, 'assignees', assigneesNationalIds)
        }

        return context
      }),
      clearAssignees: assign((context, event) => {
        // Only clear assignees when going back to draft (EDIT or REJECT events)
        // Keep assignees when progressing forward (SUBMIT) or staying in review (APPROVE)
        const shouldClearAssignees =
          event.type === DefaultEvents.EDIT ||
          event.type === DefaultEvents.REJECT

        if (!shouldClearAssignees) {
          return context
        }

        const { application } = context
        set(application, 'assignees', [])
        return context
      }),
      setApplicantAsApproved: assign((context) => {
        const { application } = context
        const heirs = getValueViaPath<EstateMember[]>(
          application.answers,
          'heirs.data',
          [],
        )
        const applicantNationalId = application.applicant

        if (heirs && heirs.length > 0) {
          const updatedHeirs = heirs.map((heir) => {
            if (heir.nationalId === applicantNationalId) {
              return {
                ...heir,
                approved: true,
                approvedDate: new Date().toISOString(),
              }
            }
            return heir
          })
          set(application.answers, 'heirs.data', updatedHeirs)
        }
        return context
      }),
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    const { applicant, assignees } = application

    if (applicant === nationalId) {
      if (application.answers.applicationFor === PREPAID_INHERITANCE) {
        return Roles.PREPAID_INHERITANCE_APPLICANT
      }
      return Roles.ESTATE_INHERITANCE_APPLICANT
    }

    // Check if user is in assignees (for pending approvals)
    if (assignees && assignees.includes(nationalId)) {
      return Roles.ASSIGNEE
    }

    // Check if user is a heir in the application (including approved heirs)
    const heirs = getValueViaPath<EstateMember[]>(
      application.answers,
      'heirs.data',
      [],
    )
    const isHeir =
      heirs &&
      heirs.some(
        (heir) =>
          nationalIdsMatch(heir.nationalId, nationalId) &&
          heir.enabled !== false &&
          !nationalIdsMatch(heir.nationalId, applicant),
      )

    if (isHeir) {
      return Roles.ASSIGNEE
    }

    return undefined
  },
}

export default InheritanceReportTemplate
