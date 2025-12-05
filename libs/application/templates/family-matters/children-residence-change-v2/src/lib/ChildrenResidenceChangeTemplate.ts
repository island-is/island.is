import { assign } from 'xstate'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  defineTemplateApi,
  InstitutionNationalIds,
  ApplicationConfigurations,
} from '@island.is/application/types'
import { getSelectedChildrenFromExternalData } from '@island.is/application/templates/family-matters-core/utils'
import { dataSchema } from './dataSchema'
import { CRCApplication } from '../types'
import { Roles, ApplicationStates } from './constants'
import { application, stateDescriptions, history } from './messages'
import {
  ChildrenCustodyInformationApi,
  NationalRegistryUserApi,
  UserProfileApi,
} from '../dataProviders'
import {
  coreHistoryMessages,
  coreMessages,
  EphemeralStateLifeCycle,
  DefaultStateLifeCycle,
} from '@island.is/application/core'
import set from 'lodash/set'
import { Features } from '@island.is/feature-flags'
import { CodeOwners } from '@island.is/shared/constants'

type Events =
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.APPROVE }

enum TemplateApiActions {
  submitApplication = 'submitApplication',
  sendNotificationToCounterParty = 'sendNotificationToCounterParty',
  rejectedByCounterParty = 'rejectedByCounterParty',
  rejectedByOrganization = 'rejectedByOrganization',
  approvedByOrganization = 'approvedByOrganization',
}

const applicationName = 'Umsókn um breytt lögheimili barns'

const configuration =
  ApplicationConfigurations[ApplicationTypes.CHILDREN_RESIDENCE_CHANGE_V2]

const ChildrenResidenceChangeTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.CHILDREN_RESIDENCE_CHANGE_V2,
  name: application.name,
  codeOwner: CodeOwners.NordaApplications,
  dataSchema,
  translationNamespaces: [configuration.translation],
  featureFlag: Features.childrenResidenceChangeV2,
  stateMachineConfig: {
    initial: ApplicationStates.PREREQUISITES,
    states: {
      [ApplicationStates.PREREQUISITES]: {
        meta: {
          name: applicationName,
          status: 'draft',
          lifecycle: EphemeralStateLifeCycle,
          actionCard: {
            historyLogs: {
              logMessage: coreHistoryMessages.applicationStarted,
              onEvent: DefaultEvents.SUBMIT,
            },
          },
          roles: [
            {
              id: Roles.ParentA,
              formLoader: () =>
                import('../forms/PrerequisitesForm').then((module) =>
                  Promise.resolve(module.PrerequisitesForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: coreMessages.externalDataAgreement,
                  type: 'primary',
                },
              ],
              delete: true,
              write: 'all',
              api: [
                ChildrenCustodyInformationApi.configure({
                  params: {
                    validateHasChildren: true,
                    validateHasJointCustody: true,
                  },
                }),
                NationalRegistryUserApi,
                UserProfileApi,
              ],
            },
          ],
        },
        on: {
          SUBMIT: { target: ApplicationStates.DRAFT },
        },
      },
      [ApplicationStates.DRAFT]: {
        meta: {
          status: 'draft',
          name: applicationName,
          progress: 0,
          actionCard: {
            description: stateDescriptions.draft,
            historyLogs: [
              {
                onEvent: DefaultEvents.ASSIGN,
                logMessage: coreHistoryMessages.applicationAssigned,
              },
            ],
          },
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.ParentA,
              formLoader: () =>
                import('../forms/ChildrenResidenceChangeForm').then((module) =>
                  Promise.resolve(module.ChildrenResidenceChangeForm),
                ),
              actions: [
                {
                  event: DefaultEvents.ASSIGN,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              read: 'all',
              delete: true,
              write: {
                answers: [
                  'reason',
                  'parentA',
                  'approveTerms',
                  'counterParty',
                  'selectDuration',
                  'selectedChildren',
                  'selectChildSupportPayment',
                  'approveExternalData',
                  'residenceChangeReason',
                  'approveChildSupportTerms',
                  'confirmContract',
                ],
                externalData: [
                  NationalRegistryUserApi.externalDataId,
                  ChildrenCustodyInformationApi.externalDataId,
                  UserProfileApi.externalDataId,
                ],
              },
            },
          ],
        },
        on: {
          ASSIGN: {
            target: ApplicationStates.IN_REVIEW,
          },
        },
      },
      [ApplicationStates.IN_REVIEW]: {
        entry: 'assignToOtherParent',
        meta: {
          status: 'inprogress',
          name: applicationName,
          progress: 0.5,
          actionCard: {
            description: stateDescriptions.inReview,
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: history.general.onCounterPartyApprove,
                includeSubjectAndActor: true,
              },
              {
                onEvent: DefaultEvents.REJECT,
                logMessage: history.general.onCounterPartyReject,
                includeSubjectAndActor: true,
              },
            ],
            pendingAction: (_, role) =>
              role === Roles.ParentB
                ? {
                    displayStatus: 'warning',
                    title: history.actions.waitingForUserActionTitle,
                    content: history.actions.waitingForUserActionDescription,
                  }
                : {
                    displayStatus: 'info',
                    title: history.actions.waitingForUserActionTitle,
                    content: history.actions.waitingForCounterpartyDescription,
                  },
          },
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: TemplateApiActions.sendNotificationToCounterParty,
          }),
          roles: [
            {
              id: Roles.ParentB,
              formLoader: () =>
                import('../forms/ParentBForm').then((module) =>
                  Promise.resolve(module.ParentBForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
                {
                  event: DefaultEvents.REJECT,
                  name: 'Hafna',
                  type: 'reject',
                },
              ],
              read: 'all',
              write: {
                answers: [
                  'parentB',
                  'acceptContract',
                  'approveTermsParentB',
                  'confirmContractParentB',
                  'approveChildSupportTermsParentB',
                ],
                externalData: [],
              },
            },
            {
              id: Roles.ParentA,
              formLoader: () =>
                import('../forms/ApplicationConfirmation').then((module) =>
                  Promise.resolve(module.ApplicationConfirmation),
                ),
              read: 'all',
            },
          ],
        },
        on: {
          SUBMIT: {
            target: ApplicationStates.WAITINGFORORGANIZATION,
          },
          REJECT: {
            target: ApplicationStates.REJECTEDBYPARENTB,
          },
        },
      },
      [ApplicationStates.REJECTEDBYPARENTB]: {
        meta: {
          name: applicationName,
          status: 'rejected',
          progress: 1,
          actionCard: {
            description: stateDescriptions.rejectedByParentB,
          },
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: TemplateApiActions.rejectedByCounterParty,
          }),
          roles: [
            {
              id: Roles.ParentB,
              formLoader: () =>
                import('../forms/ContractRejected').then((module) =>
                  Promise.resolve(module.ParentBContractRejected),
                ),
            },
            {
              id: Roles.ParentA,
              formLoader: () =>
                import('../forms/ContractRejected').then((module) =>
                  Promise.resolve(module.ContractRejected),
                ),
              read: 'all',
            },
          ],
        },
      },
      [ApplicationStates.WAITINGFORORGANIZATION]: {
        entry: 'assignToOrganization',
        exit: 'clearAssignees',
        meta: {
          name: applicationName,
          status: 'inprogress',
          progress: 0.75,
          onEntry: defineTemplateApi({
            action: TemplateApiActions.submitApplication,
            shouldPersistToExternalData: true,
          }),
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            historyLogs: [
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage: history.general.onCommissionerApprove,
              },
              {
                onEvent: DefaultEvents.REJECT,
                logMessage: history.general.onCommissionerReject,
              },
            ],
            pendingAction: {
              displayStatus: 'info',
              title: history.actions.waitingForOrganizationTitle,
              content: stateDescriptions.submitted,
            },
          },
          roles: [
            {
              id: Roles.ParentA,
              formLoader: () =>
                import('../forms/WaitingForOrganization').then((module) =>
                  Promise.resolve(module.WaitingForOrganization),
                ),
              read: 'all',
            },
            {
              id: Roles.ParentB,
              formLoader: () =>
                import('../forms/WaitingForOrganization').then((module) =>
                  Promise.resolve(module.WaitingForOrganization),
                ),
              read: 'all',
            },
            {
              id: Roles.Organization,
              read: 'all',
              write: 'all',
              actions: [
                {
                  event: DefaultEvents.APPROVE,
                  name: 'Samþykkja',
                  type: 'primary',
                },
                {
                  event: DefaultEvents.REJECT,
                  name: 'Hafna',
                  type: 'reject',
                },
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: { target: ApplicationStates.COMPLETED },
          [DefaultEvents.REJECT]: {
            target: ApplicationStates.REJECTEDBYORGANIZATION,
          },
        },
      },
      [ApplicationStates.REJECTEDBYORGANIZATION]: {
        meta: {
          status: 'rejected',
          name: applicationName,
          progress: 1,
          actionCard: {
            description: stateDescriptions.rejected,
          },
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: TemplateApiActions.rejectedByOrganization,
          }),
          roles: [
            {
              id: Roles.ParentA,
              formLoader: () =>
                import('../forms/ApplicationRejected').then((module) =>
                  Promise.resolve(module.ApplicationRejected),
                ),
              read: 'all',
            },
            {
              id: Roles.ParentB,
              formLoader: () =>
                import('../forms/ApplicationRejected').then((module) =>
                  Promise.resolve(module.ApplicationRejected),
                ),
              read: 'all',
            },
          ],
        },
      },
      [ApplicationStates.COMPLETED]: {
        meta: {
          name: applicationName,
          status: 'approved',
          progress: 1,
          actionCard: {
            description: stateDescriptions.approved,
          },
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: TemplateApiActions.approvedByOrganization,
          }),
          roles: [
            {
              id: Roles.ParentA,
              formLoader: () =>
                import('../forms/ApplicationApproved').then((module) =>
                  Promise.resolve(module.ApplicationApproved),
                ),
              read: 'all',
            },
            {
              id: Roles.ParentB,
              formLoader: () =>
                import('../forms/ApplicationApproved').then((module) =>
                  Promise.resolve(module.ApplicationApproved),
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
      assignToOtherParent: assign((context) => {
        // TODO: fix this..
        const { externalData, answers } =
          context.application as unknown as CRCApplication
        const children = externalData.childrenCustodyInformation.data
        const selectedChildren = getSelectedChildrenFromExternalData(
          children,
          answers.selectedChildren,
        )
        const otherParent = selectedChildren[0].otherParent

        return {
          ...context,
          application: {
            ...context.application,
            assignees: [otherParent?.nationalId ?? ''],
          },
        }
      }),
      assignToOrganization: assign((context) => {
        const { application } = context

        set(application, 'assignees', [InstitutionNationalIds.SYSLUMENN])

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
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (
      application.assignees.includes(id) &&
      application.answers.useMocks === 'yes' &&
      application.state === ApplicationStates.IN_REVIEW
    ) {
      return Roles.ParentB
    }
    if (id === application.applicant) {
      return Roles.ParentA
    }
    if (application.assignees.includes(id)) {
      return Roles.ParentB
    }
    if (id === InstitutionNationalIds.SYSLUMENN) {
      return Roles.Organization
    }
    return undefined
  },
}

export default ChildrenResidenceChangeTemplate
