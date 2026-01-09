import {
  coreHistoryMessages,
  getValueViaPath,
  pruneAfterDays,
} from '@island.is/application/core'
import { assign } from 'xstate'
import set from 'lodash/set'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  defineTemplateApi,
  NationalRegistryV3UserApi,
  UserProfileApi,
  DefaultEvents,
  ApplicationConfigurations,
  InstitutionNationalIds,
} from '@island.is/application/types'
import { buildPaymentState } from '@island.is/application/utils'
import { m } from './messages'
import { estateSchema } from './dataSchema'
import {
  ApiActions,
  EstateEvent,
  EstateTypes,
  Roles,
  States,
} from './constants'
import { FeatureFlagClient } from '@island.is/feature-flags'
import {
  EstateApi,
  EstateOnEntryApi,
  SyslumadurPaymentCatalogApi,
  MockableSyslumadurPaymentCatalogApi,
} from '../dataProviders'
import {
  getApplicationFeatureFlags,
  EstateFeatureFlags,
} from './getApplicationFeatureFlags'
import { CodeOwners } from '@island.is/shared/constants'
import { getChargeItems } from '../utils/getChargeItems'
import { getAssigneesNationalIdList } from './utils/getAssigneesNationalIdList'
import { allPartiesHaveApproved } from './utils/allPartiesHaveApproved'
import { nationalIdsMatch } from './utils/helpers'
import { EstateMember } from '../types'

const configuration = ApplicationConfigurations[ApplicationTypes.ESTATE]

const EstateTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<EstateEvent>,
  EstateEvent
> = {
  type: ApplicationTypes.ESTATE,
  name: ({ answers }) =>
    answers.selectedEstate
      ? m.prerequisitesTitle.defaultMessage + ' - ' + answers.selectedEstate
      : m.prerequisitesTitle.defaultMessage,

  codeOwner: CodeOwners.Juni,
  institution: m.institution,
  dataSchema: estateSchema,
  translationNamespaces: [configuration.translation],
  allowMultipleApplicationsInDraft: true,
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
              id: Roles.APPLICANT,
              formLoader: async ({ featureFlagClient }) => {
                const featureFlags = await getApplicationFeatureFlags(
                  featureFlagClient as FeatureFlagClient,
                )

                const getForm = await import('../forms/Prerequisites').then(
                  (val) => val.getForm,
                )

                return getForm({
                  allowDivisionOfEstate:
                    featureFlags[EstateFeatureFlags.ALLOW_DIVISION_OF_ESTATE],
                  allowEstateWithoutAssets:
                    featureFlags[
                      EstateFeatureFlags.ALLOW_ESTATE_WITHOUT_ASSETS
                    ],
                  allowPermitToPostponeEstateDivision:
                    featureFlags[
                      EstateFeatureFlags
                        .ALLOW_PERMIT_TO_POSTPONE_ESTATE_DIVISION
                    ],
                  allowDivisionOfEstateByHeirs:
                    featureFlags[
                      EstateFeatureFlags.ALLOW_DIVISION_OF_ESTATE_BY_HEIRS
                    ],
                  allowEstatePayment:
                    featureFlags[EstateFeatureFlags.ALLOW_ESTATE_PAYMENT],
                })
              },
              actions: [{ event: 'SUBMIT', name: '', type: 'primary' }],
              write: 'all',
              delete: true,
              api: [
                EstateOnEntryApi,
                SyslumadurPaymentCatalogApi,
                MockableSyslumadurPaymentCatalogApi,
              ],
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
          [DefaultEvents.SUBMIT]: {
            target: States.draft,
          },
        },
      },
      [States.draft]: {
        meta: {
          name: '',
          status: 'draft',
          progress: 0.25,
          lifecycle: pruneAfterDays(60),
          roles: [
            {
              id: Roles.APPLICANT_NO_ASSETS,
              formLoader: () =>
                import('../forms/Forms').then((module) =>
                  Promise.resolve(module.estateWithoutAssetsForm),
                ),
              actions: [{ event: 'SUBMIT', name: '', type: 'primary' }],
              write: 'all',
              delete: true,
              api: [NationalRegistryV3UserApi, UserProfileApi, EstateApi],
            },
            {
              id: Roles.APPLICANT_OFFICIAL_DIVISION,
              formLoader: () =>
                import('../forms/Forms').then((module) =>
                  Promise.resolve(module.officialDivisionForm),
                ),
              actions: [{ event: 'SUBMIT', name: '', type: 'primary' }],
              write: 'all',
              delete: true,
              api: [NationalRegistryV3UserApi, UserProfileApi, EstateApi],
            },
            {
              id: Roles.APPLICANT_PERMIT_FOR_UNDIVIDED_ESTATE,
              formLoader: () =>
                import('../forms/Forms').then((module) =>
                  Promise.resolve(module.undividedEstateForm),
                ),
              actions: [
                { event: 'SUBMIT', name: '', type: 'primary' },
                { event: 'PAYMENT', name: '', type: 'primary' },
              ],
              write: 'all',
              delete: true,
              api: [
                NationalRegistryV3UserApi,
                UserProfileApi,
                EstateApi,
                SyslumadurPaymentCatalogApi,
                MockableSyslumadurPaymentCatalogApi,
              ],
            },
            {
              id: Roles.APPLICANT_DIVISION_OF_ESTATE_BY_HEIRS,
              formLoader: () =>
                import('../forms/Forms').then((module) =>
                  Promise.resolve(module.privateDivisionForm),
                ),
              actions: [
                { event: 'SUBMIT', name: '', type: 'primary' },
                { event: 'PAYMENT', name: '', type: 'primary' },
              ],
              write: 'all',
              delete: true,
              api: [
                NationalRegistryV3UserApi,
                UserProfileApi,
                EstateApi,
                SyslumadurPaymentCatalogApi,
                MockableSyslumadurPaymentCatalogApi,
              ],
            },
          ],
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationReceived,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.inReview,
            actions: 'setApplicantAsApproved',
          },
          [DefaultEvents.PAYMENT]: {
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
                const estateMembers = getValueViaPath<EstateMember[]>(
                  application.answers,
                  'estate.estateMembers',
                  [],
                )
                const currentUserMember = estateMembers?.find((member) =>
                  nationalIdsMatch(member.nationalId, nationalId),
                )

                if (currentUserMember?.approved) {
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
              id: Roles.APPLICANT_NO_ASSETS,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
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
              id: Roles.APPLICANT_OFFICIAL_DIVISION,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
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
              id: Roles.APPLICANT_PERMIT_FOR_UNDIVIDED_ESTATE,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.applicantInReviewForm),
                ),
              actions: [
                { event: DefaultEvents.EDIT, name: '', type: 'subtle' },
                { event: DefaultEvents.SUBMIT, name: '', type: 'primary' },
                { event: DefaultEvents.PAYMENT, name: '', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
            },
            {
              id: Roles.APPLICANT_DIVISION_OF_ESTATE_BY_HEIRS,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
                  Promise.resolve(val.applicantInReviewForm),
                ),
              actions: [
                { event: DefaultEvents.EDIT, name: '', type: 'subtle' },
                { event: DefaultEvents.SUBMIT, name: '', type: 'primary' },
                { event: DefaultEvents.PAYMENT, name: '', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
            },
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/InReview').then((val) =>
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
          [DefaultEvents.EDIT]: {
            target: States.draft,
          },
          [DefaultEvents.SUBMIT]: {
            target: States.done,
          },
          [DefaultEvents.PAYMENT]: {
            target: States.payment,
          },
          [DefaultEvents.APPROVE]: {
            target: States.inReview,
          },
          [DefaultEvents.REJECT]: {
            target: States.draft,
          },
        },
      },
      [States.payment]: buildPaymentState({
        organizationId: InstitutionNationalIds.SYSLUMENN,
        chargeItems: getChargeItems,
        submitTarget: States.done,
        abortTarget: States.draft,
        lifecycle: {
          shouldBeListed: true,
          shouldBePruned: true,
          whenToPrune: 60 * 24 * 3600 * 1000, // 60 days
          shouldDeleteChargeIfPaymentFulfilled: true,
        },
      }),
      [States.done]: {
        meta: {
          name: 'Approved',
          status: 'completed',
          progress: 1,
          lifecycle: pruneAfterDays(60),
          onEntry: defineTemplateApi({
            action: ApiActions.completeApplication,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT_NO_ASSETS,
              formLoader: () =>
                import('../forms/Done').then((val) =>
                  Promise.resolve(val.done),
                ),
              read: 'all',
            },
            {
              id: Roles.APPLICANT_OFFICIAL_DIVISION,
              formLoader: () =>
                import('../forms/Done').then((val) =>
                  Promise.resolve(val.done),
                ),
              read: 'all',
            },
            {
              id: Roles.APPLICANT_PERMIT_FOR_UNDIVIDED_ESTATE,
              formLoader: () =>
                import('../forms/Done').then((val) =>
                  Promise.resolve(val.done),
                ),
              read: 'all',
            },
            {
              id: Roles.APPLICANT_DIVISION_OF_ESTATE_BY_HEIRS,
              formLoader: () =>
                import('../forms/Done').then((val) =>
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
        // Keep assignees when progressing forward (SUBMIT/PAYMENT) or staying in review (APPROVE)
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
        const estateMembers = getValueViaPath<EstateMember[]>(
          application.answers,
          'estate.estateMembers',
          [],
        )
        const applicantNationalId = application.applicant

        if (estateMembers && estateMembers.length > 0) {
          const updatedMembers = estateMembers.map((member) => {
            if (nationalIdsMatch(member.nationalId, applicantNationalId)) {
              return {
                ...member,
                approved: true,
                approvedDate: new Date().toISOString(),
              }
            }
            return member
          })
          set(application.answers, 'estate.estateMembers', updatedMembers)
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
      const selectedEstate = getValueViaPath<string>(
        application.answers,
        'selectedEstate',
      )
      if (selectedEstate === EstateTypes.officialDivision) {
        return Roles.APPLICANT_OFFICIAL_DIVISION
      } else if (selectedEstate === EstateTypes.estateWithoutAssets) {
        return Roles.APPLICANT_NO_ASSETS
      } else if (selectedEstate === EstateTypes.permitForUndividedEstate) {
        return Roles.APPLICANT_PERMIT_FOR_UNDIVIDED_ESTATE
      } else if (selectedEstate === EstateTypes.divisionOfEstateByHeirs) {
        return Roles.APPLICANT_DIVISION_OF_ESTATE_BY_HEIRS
      } else return Roles.APPLICANT
    }

    // Check if user is in assignees (for pending approvals)
    if (assignees && assignees.includes(nationalId)) {
      return Roles.ASSIGNEE
    }

    // Check if user is an estate member in the application (including approved members)
    const estateMembers = getValueViaPath<EstateMember[]>(
      application.answers,
      'estate.estateMembers',
      [],
    )
    const isMember =
      estateMembers &&
      estateMembers.some(
        (member) =>
          nationalIdsMatch(member.nationalId, nationalId) &&
          member.enabled !== false &&
          !nationalIdsMatch(member.nationalId, applicant),
      )

    if (isMember) {
      return Roles.ASSIGNEE
    }

    return undefined
  },
}

export default EstateTemplate
