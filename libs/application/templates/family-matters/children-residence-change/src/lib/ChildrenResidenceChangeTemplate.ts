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
} from '@island.is/application/types'
import { getSelectedChildrenFromExternalData } from '@island.is/application/templates/family-matters-core/utils'
import { dataSchema } from './dataSchema'
import { CRCApplication } from '../types'
import { Roles, ApplicationStates } from './constants'
import { application, stateDescriptions, stateLabels } from './messages'
import {
  ChildrenCustodyInformationApi,
  NationalRegistryUserApi,
  UserProfileApi,
} from '../dataProviders'
import { pruneAfterDays } from '@island.is/application/core'

type Events =
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.REJECT }

enum TemplateApiActions {
  submitApplication = 'submitApplication',
  sendNotificationToCounterParty = 'sendNotificationToCounterParty',
  rejectApplication = 'rejectApplication',
  approveApplication = 'approveApplication',
  rejectedApplication = 'rejectedApplication',
}

const applicationName = 'Umsókn um breytt lögheimili barns'

const ChildrenResidenceChangeTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.CHILDREN_RESIDENCE_CHANGE,
  name: application.name,
  dataSchema,
  stateMachineConfig: {
    initial: ApplicationStates.DRAFT,
    states: {
      [ApplicationStates.DRAFT]: {
        meta: {
          status: 'draft',
          name: applicationName,
          actionCard: {
            description: stateDescriptions.draft,
          },
          lifecycle: pruneAfterDays(365),
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
              api: [
                ChildrenCustodyInformationApi,
                NationalRegistryUserApi,
                UserProfileApi,
              ],
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
          actionCard: {
            description: stateDescriptions.inReview,
          },
          lifecycle: pruneAfterDays(28),
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
            target: ApplicationStates.SUBMITTED,
          },
          REJECT: {
            target: ApplicationStates.REJECTEDBYPARENTB,
          },
        },
      },
      [ApplicationStates.SUBMITTED]: {
        meta: {
          name: applicationName,
          status: 'inprogress',
          actionCard: {
            description: stateDescriptions.submitted,
            tag: { label: stateLabels.submitted },
          },
          lifecycle: pruneAfterDays(365),
          onEntry: defineTemplateApi({
            action: TemplateApiActions.submitApplication,
          }),
          roles: [
            {
              id: Roles.ParentA,
              formLoader: () =>
                import('../forms/ApplicationConfirmation').then((module) =>
                  Promise.resolve(module.ApplicationConfirmation),
                ),
              read: 'all',
            },
            {
              id: Roles.ParentB,
              formLoader: () =>
                import('../forms/ParentBApplicationConfirmation').then(
                  (module) =>
                    Promise.resolve(module.ParentBApplicationConfirmation),
                ),
              read: 'all',
            },
          ],
        },
      },
      [ApplicationStates.REJECTEDBYPARENTB]: {
        meta: {
          name: applicationName,
          status: 'rejected',
          actionCard: {
            description: stateDescriptions.rejectedByParentB,
            tag: {
              variant: 'red',
              label: stateLabels.rejected,
            },
          },
          lifecycle: pruneAfterDays(365),
          onEntry: defineTemplateApi({
            action: TemplateApiActions.rejectApplication,
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
      [ApplicationStates.REJECTED]: {
        meta: {
          status: 'rejected',
          name: applicationName,
          actionCard: {
            description: stateDescriptions.rejected,
            tag: { label: stateLabels.rejected, variant: 'red' },
          },
          lifecycle: pruneAfterDays(365),
          onEntry: defineTemplateApi({
            action: TemplateApiActions.rejectedApplication,
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
          actionCard: {
            description: stateDescriptions.approved,
            tag: { label: stateLabels.approved, variant: 'blueberry' },
          },
          lifecycle: pruneAfterDays(365),
          onEntry: defineTemplateApi({
            action: TemplateApiActions.approveApplication,
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
    },
  },

  mapUserToRole(
    id: string,
    // TODO: Somehow use CRCApplication here
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
    return undefined
  },
}

export default ChildrenResidenceChangeTemplate
