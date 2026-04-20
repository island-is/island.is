import {
  coreHistoryMessages,
  corePendingActionMessages,
  EphemeralStateLifeCycle,
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
  defineTemplateApi,
  DistrictsApi,
  InstitutionNationalIds,
  PassportsApi,
  StaticText,
} from '@island.is/application/types'
import { assign } from 'xstate'
import {
  DeliveryAddressApi,
  UserInfoApi,
  NationalRegistryUser,
  MockableSyslumadurPaymentCatalogApi,
  IdentityDocumentApi,
  NationalRegistryUserParentB,
  SyslumadurPaymentCatalogApi,
} from '../dataProviders'
import { application as applicationMessage } from './messages'
import { Events, Roles, States, ApiActions, Routes } from './constants'
import { IdCardSchema } from './dataSchema'
import { buildPaymentState } from '@island.is/application/utils'
import { getChargeItems, hasReviewer } from '../utils'
import { CodeOwners } from '@island.is/shared/constants'

export const needsReview = (context: ApplicationContext) => {
  const { answers, externalData } = context.application
  return hasReviewer(answers, externalData)
}

export const determineMessageFromApplicationAnswers = (
  application: Application,
): StaticText => {
  const name = getValueViaPath(
    application.answers,
    'applicantInformation.name',
    ' ',
  ) as string

  const nameObject = { id: applicationMessage.name.id, values: { name: name } }

  return nameObject
}

const IdCardTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.ID_CARD,
  name: applicationMessage.name,
  codeOwner: CodeOwners.Origo,
  dataSchema: IdCardSchema,
  translationNamespaces: ApplicationConfigurations.IdCard.translation,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Gagnaöflun',
          status: 'draft',
          progress: 0.1,
          lifecycle: EphemeralStateLifeCycle,
          actionCard: {
            tag: {
              label: applicationMessage.actionCardPrerequisites,
              variant: 'blue',
            },
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationStarted,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Prerequisites').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
              api: [
                NationalRegistryUser,
                UserInfoApi,
                SyslumadurPaymentCatalogApi,
                MockableSyslumadurPaymentCatalogApi,
                PassportsApi,
                DistrictsApi,
                DeliveryAddressApi,
                IdentityDocumentApi,
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DRAFT },
        },
      },
      [States.DRAFT]: {
        meta: {
          name: 'Umsókn um nafnskírteini',
          status: 'draft',
          progress: 0.25,
          lifecycle: pruneAfterDays(2),
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationStarted,
                onEvent: DefaultEvents.PAYMENT,
              },
            ],
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/IdCardForm').then((module) =>
                  Promise.resolve(module.IdCardForm),
                ),
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.PAYMENT },
        },
      },
      [States.PAYMENT]: buildPaymentState({
        organizationId: InstitutionNationalIds.SYSLUMENN,
        chargeItems: getChargeItems,
        submitTarget: [
          {
            target: States.PARENT_B_CONFIRM,
            cond: needsReview,
          },
          {
            target: States.COMPLETED,
          },
        ],
      }),
      [States.PARENT_B_CONFIRM]: {
        entry: 'assignToParentB',
        meta: {
          name: 'ParentB',
          status: 'inprogress',
          lifecycle: pruneAfterDays(7),
          onEntry: defineTemplateApi({
            action: ApiActions.assignParentB,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Review').then((val) =>
                  Promise.resolve(val.Review),
                ),
              write: 'all',
            },
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/ParentB').then((val) =>
                  Promise.resolve(val.ParentB),
                ),
              actions: [
                { event: DefaultEvents.SUBMIT, name: '', type: 'primary' },
              ],
              write: 'all',
              api: [NationalRegistryUserParentB],
            },
          ],
          actionCard: {
            tag: {
              label: applicationMessage.actionCardDraft,
              variant: 'blue',
            },
            historyLogs: [
              {
                logMessage: applicationMessage.historyLogApprovedByParentB,
                onEvent: DefaultEvents.SUBMIT,
                includeSubjectAndActor: true,
              },
            ],
            pendingAction: (_, role) => {
              return role === Roles.ASSIGNEE
                ? {
                    title: corePendingActionMessages.waitingForReviewTitle,
                    content:
                      corePendingActionMessages.youNeedToReviewDescription,
                    displayStatus: 'warning',
                  }
                : {
                    title: corePendingActionMessages.waitingForReviewTitle,
                    content:
                      corePendingActionMessages.waitingForReviewFromParentBDescription,
                    displayStatus: 'info',
                  }
            },
          },
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.COMPLETED },
          [DefaultEvents.REJECT]: { target: States.REJECTED },
        },
      },
      [States.REJECTED]: {
        meta: {
          name: 'Rejected',
          status: 'rejected',
          lifecycle: pruneAfterDays(3 * 30),
          onEntry: defineTemplateApi({
            action: ApiActions.rejectApplication,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Rejected').then((val) =>
                  Promise.resolve(val.Rejected),
                ),
            },
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/Rejected').then((val) =>
                  Promise.resolve(val.Rejected),
                ),
            },
          ],
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: 'Completed',
          status: 'completed',
          lifecycle: pruneAfterDays(3 * 30),
          onEntry: defineTemplateApi({
            action: ApiActions.submitApplication,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Approved').then((val) =>
                  Promise.resolve(val.Approved),
                ),
              read: 'all',
            },
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/Approved').then((val) =>
                  Promise.resolve(val.Approved),
                ),
              read: 'all',
            },
          ],
          actionCard: {
            pendingAction: {
              title: coreHistoryMessages.applicationReceived,
              content: '',
              displayStatus: 'success',
            },
          },
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      assignToParentB: assign((context) => {
        const parentB = getValueViaPath<string>(
          context.application.answers,
          `${Routes.SECONDGUARDIANINFORMATION}.nationalId`,
        )

        return {
          ...context,
          application: {
            ...context.application,
            assignees: parentB ? [parentB] : [],
          },
        }
      }),
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (application.assignees.includes(nationalId)) {
      return Roles.ASSIGNEE
    }
    if (nationalId === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default IdCardTemplate
