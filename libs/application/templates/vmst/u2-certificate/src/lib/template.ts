import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  FormModes,
  ApplicationConfigurations,
  NationalRegistryV3UserApi,
  defineTemplateApi,
  InstitutionNationalIds,
} from '@island.is/application/types'
import {
  ApplicationEvents,
  ApiActions,
  Events,
  Roles,
  States,
  U2Events,
} from '../utils/types'
import { CodeOwners } from '@island.is/shared/constants'
import { dataSchema } from './dataSchema'
import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import { EESCountriesApi, EligibilityApi } from '../dataProviders'
import { applicationMessages as m } from './messages'
import { assign } from 'xstate'
import set from 'lodash/set'
import { Features } from '@island.is/feature-flags'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.U2_CERTIFICATE,
  name: m.name,
  codeOwner: CodeOwners.Origo,
  institution: m.institutionName,
  translationNamespaces: ApplicationConfigurations.U2Certificate.translation,
  dataSchema,
  featureFlag: Features.isU2ApplicationEnabled,
  allowMultipleApplicationsInDraft: false,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Skilyrði',
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
                { event: 'SUBMIT', name: m.submitConfirm, type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              api: [NationalRegistryV3UserApi, EESCountriesApi, EligibilityApi],
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.DRAFT,
          },
        },
      },
      [States.DRAFT]: {
        // Í vinnslu hjá notanda
        meta: {
          name: 'Main form',
          status: FormModes.DRAFT,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            tag: {
              variant: 'blue',
              label: m.inDraft,
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: m.draftHistorySubmit,
              },
            ],
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/mainForm').then((module) =>
                  Promise.resolve(module.MainForm),
                ),
              actions: [
                { event: 'SUBMIT', name: m.submitConfirm, type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              delete: true,
            },
          ],
          onExit: defineTemplateApi({
            action: 'completeApplication',
          }),
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.REVIEW,
          },
        },
      },
      [States.REVIEW]: {
        // Í vinnslu (hjá VMST)
        entry: ['assignToInstitution'],
        exit: ['clearAssignees'],
        meta: {
          name: 'Review',
          status: FormModes.IN_PROGRESS,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            tag: {
              variant: 'purple',
              label: m.sentIn,
            },
            pendingAction: {
              title: m.reviewPendingTitle,
              content: m.reviewPendingContent,
              displayStatus: 'info',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/reviewForm').then((module) =>
                  Promise.resolve(module.ReviewForm),
                ),
              read: 'all',
              write: 'all',
              delete: false,
            },
            {
              id: Roles.ORGANISATION_REVIEWER,
              read: 'all',
              write: 'all',
              actions: [
                {
                  event: ApplicationEvents.APPROVE,
                  name: 'Approve',
                  type: 'primary',
                },
                {
                  event: ApplicationEvents.REJECT,
                  name: 'Reject',
                  type: 'primary',
                },
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.REJECT]: {
            target: States.REJECTED,
          },
          [DefaultEvents.APPROVE]: {
            target: States.COMPLETED,
          },
          [U2Events.REVOKE]: {
            target: States.REVOKED,
          },
        },
      },
      [States.REVOKED]: {
        // Notandi afturkallar
        meta: {
          name: 'Revoked',
          status: FormModes.REJECTED,
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: ApiActions.revokeApplication,
            throwOnError: true,
          }),
          actionCard: {
            tag: {
              variant: 'red',
              label: m.revoked,
            },
            pendingAction: {
              title: m.revokedPendingTitle,
              content: m.revokedPendingContent,
              displayStatus: 'error',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/revokedForm').then((module) =>
                  Promise.resolve(module.RevokedForm),
                ),
              read: 'all',
              delete: false,
            },
          ],
        },
      },
      [States.REJECTED]: {
        // Hafnað (af VMST)
        meta: {
          name: 'Rejected',
          status: FormModes.REJECTED,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            tag: {
              variant: 'red',
              label: m.rejected,
            },
            pendingAction: {
              title: m.rejectedPendingTitle,
              content: m.rejectedPendingContent,
              displayStatus: 'error',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/rejectedForm').then((module) =>
                  Promise.resolve(module.RejectedForm),
                ),
              read: 'all',
              delete: false,
            },
          ],
        },
      },
      [States.COMPLETED]: {
        // Samþykkt (af VMST)
        meta: {
          name: 'Completed form',
          progress: 1,
          status: FormModes.COMPLETED,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            tag: {
              variant: 'mint',
              label: m.approved,
            },
            pendingAction: {
              title: m.completedPendingTitle,
              content: m.completedPendingContent,
              displayStatus: 'success',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/completedForm').then((module) =>
                  Promise.resolve(module.CompletedForm),
                ),
              read: 'all',
              delete: false,
            },
          ],
        },
      },
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (nationalId === application.applicant) {
      return Roles.APPLICANT
    } else if (nationalId === InstitutionNationalIds.VINNUMALASTOFNUN) {
      return Roles.ORGANISATION_REVIEWER
    }
    return undefined
  },
  stateMachineOptions: {
    actions: {
      assignToInstitution: assign((context) => {
        const { application } = context
        set(application, 'assignees', [InstitutionNationalIds.VINNUMALASTOFNUN])
        return context
      }),
      clearAssignees: assign((context) => {
        const { application } = context
        set(application, 'assignees', [])
        return context
      }),
    },
  },
}

export default template
