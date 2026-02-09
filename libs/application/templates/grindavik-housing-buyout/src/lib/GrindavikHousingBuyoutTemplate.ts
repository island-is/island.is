import {
  ApplicationContext,
  ApplicationConfigurations,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  defineTemplateApi,
  InstitutionNationalIds,
  FormModes,
} from '@island.is/application/types'
import {
  NationalRegistryV3UserApi,
  UserProfileApi,
  checkResidence,
  grindaVikHousing,
} from '../dataProviders'
import { GrindavikHousingBuyoutSchema } from './dataSchema'
import { States, TWENTY_FOUR_HOURS_IN_MS } from './constants'
import {
  DefaultStateLifeCycle,
  coreHistoryMessages,
  pruneAfterDays,
} from '@island.is/application/core'
import { Features } from '@island.is/feature-flags'
import { application, states } from './messages'
import { assign } from 'xstate'
import set from 'lodash/set'
import { historyLogs } from './messages/history'
import { CodeOwners } from '@island.is/shared/constants'

type GrindavikHousingBuyoutEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.REJECT }

enum Roles {
  APPLICANT = 'applicant',
  ORGANIZATION = 'organization',
}

const configuration =
  ApplicationConfigurations[ApplicationTypes.GRINDAVIK_HOUSING_BUYOUT]

const GrindavikHousingBuyoutTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<GrindavikHousingBuyoutEvent>,
  GrindavikHousingBuyoutEvent
> = {
  type: ApplicationTypes.GRINDAVIK_HOUSING_BUYOUT,
  name: application.general.name,
  codeOwner: CodeOwners.NordaApplications,
  dataSchema: GrindavikHousingBuyoutSchema,
  translationNamespaces: configuration.translation,
  institution: application.general.institutionName,
  featureFlag: Features.grindavikHousingBuyout,
  allowMultipleApplicationsInDraft: false,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: application.general.name.defaultMessage,
          status: FormModes.DRAFT,
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            whenToPrune: TWENTY_FOUR_HOURS_IN_MS,
          },
          actionCard: {
            historyLogs: {
              logMessage: coreHistoryMessages.applicationStarted,
              onEvent: DefaultEvents.SUBMIT,
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Prerequisites').then((val) =>
                  Promise.resolve(val.Prerequisites),
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
              api: [
                UserProfileApi,
                NationalRegistryV3UserApi,
                checkResidence,
                grindaVikHousing,
              ],
            },
          ],
        },
        on: {
          SUBMIT: {
            target: States.DRAFT,
          },
        },
      },
      [States.DRAFT]: {
        meta: {
          status: FormModes.DRAFT,
          name: application.general.name.defaultMessage,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            historyLogs: {
              logMessage: coreHistoryMessages.applicationSent,
              onEvent: DefaultEvents.SUBMIT,
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/GrindavikHousingBuyoutForm').then((module) =>
                  Promise.resolve(module.GrindavikHousingBuyoutForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              delete: true,
              write: 'all',
            },
          ],
        },
        on: {
          SUBMIT: {
            target: States.IN_REVIEW,
          },
        },
      },
      [States.IN_REVIEW]: {
        entry: 'assignToOrganization',
        meta: {
          status: FormModes.IN_PROGRESS,
          name: application.general.name.defaultMessage,
          lifecycle: pruneAfterDays(90),
          onEntry: defineTemplateApi({
            action: 'submitApplication',
            shouldPersistToExternalData: true,
          }),
          actionCard: {
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: historyLogs.sentToThorkatla,
              },
              {
                onEvent: DefaultEvents.REJECT,
                logMessage: coreHistoryMessages.applicationRejected,
              },
            ],
            pendingAction: {
              displayStatus: 'info',
              title: states.inReviewTitle,
              content: states.inReviewDescription,
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((module) =>
                  Promise.resolve(module.InReview),
                ),
              read: 'all',
            },
            {
              id: Roles.ORGANIZATION,
              read: 'all',
              write: 'all',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Samþykkja',
                  type: 'primary',
                },
              ],
            },
          ],
        },
        on: {
          SUBMIT: {
            target: States.SENT_TO_THORKATLA,
          },
        },
      },
      [States.SENT_TO_THORKATLA]: {
        meta: {
          status: FormModes.IN_PROGRESS,
          name: application.general.name.defaultMessage,
          lifecycle: pruneAfterDays(190),
          actionCard: {
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: historyLogs.approvedByThorkatla,
              },
            ],
            pendingAction: {
              displayStatus: 'info',
              title: states.sentToThorkatlaTitle,
              content: states.sentToThorkatlaDescription,
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((module) =>
                  Promise.resolve(module.InReview),
                ),
              read: 'all',
            },
            {
              id: Roles.ORGANIZATION,
              read: 'all',
              write: 'all',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Samþykkja',
                  type: 'primary',
                },
              ],
            },
          ],
        },
        on: {
          SUBMIT: {
            target: States.APPROVED_BY_THORKATLA,
          },
        },
      },
      [States.APPROVED_BY_THORKATLA]: {
        meta: {
          status: FormModes.IN_PROGRESS,
          name: application.general.name.defaultMessage,
          lifecycle: pruneAfterDays(190),
          actionCard: {
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: historyLogs.purchaseAgreementSentForSigning,
              },
            ],
            pendingAction: {
              displayStatus: 'info',
              title: states.approvedByThorkatlaTitle,
              content: states.approvedByThorkatlaDescription,
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((module) =>
                  Promise.resolve(module.InReview),
                ),
              read: 'all',
            },
            {
              id: Roles.ORGANIZATION,
              read: 'all',
              write: 'all',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
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
          SUBMIT: {
            target: States.PURCHASE_AGREEMENT_SENT_FOR_SIGNING,
          },
        },
      },
      [States.PURCHASE_AGREEMENT_SENT_FOR_SIGNING]: {
        meta: {
          status: FormModes.IN_PROGRESS,
          name: application.general.name.defaultMessage,
          lifecycle: pruneAfterDays(190),
          actionCard: {
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: historyLogs.purchaseAgreementReceivedFromSigning,
              },
            ],
            pendingAction: {
              displayStatus: 'info',
              title: states.purchaseAgreementSentForSigningTitle,
              content: states.purchaseAgreementSentForSigningDescription,
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((module) =>
                  Promise.resolve(module.InReview),
                ),
              read: 'all',
            },
            {
              id: Roles.ORGANIZATION,
              read: 'all',
              write: 'all',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
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
          SUBMIT: {
            target: States.PURCHASE_AGREEMENT_RECEIVED_FROM_SIGNING,
          },
        },
      },
      [States.PURCHASE_AGREEMENT_RECEIVED_FROM_SIGNING]: {
        meta: {
          status: FormModes.IN_PROGRESS,
          name: application.general.name.defaultMessage,
          lifecycle: pruneAfterDays(190),
          actionCard: {
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: historyLogs.purchaseAgreementDeclared,
              },
            ],
            pendingAction: {
              displayStatus: 'info',
              title: states.purchaseAgreementReceivedFromSigningTitle,
              content: states.purchaseAgreementReceivedFromSigningDescription,
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((module) =>
                  Promise.resolve(module.InReview),
                ),
              read: 'all',
            },
            {
              id: Roles.ORGANIZATION,
              read: 'all',
              write: 'all',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
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
          SUBMIT: {
            target: States.PURCHASE_AGREEMENT_DECLARED,
          },
        },
      },
      [States.PURCHASE_AGREEMENT_DECLARED]: {
        meta: {
          status: FormModes.IN_PROGRESS,
          name: application.general.name.defaultMessage,
          lifecycle: pruneAfterDays(190),
          actionCard: {
            pendingAction: {
              displayStatus: 'info',
              title: states.purchaseAgreementDeclaredTitle,
              content: states.purchaseAgreementDeclaredDescription,
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((module) =>
                  Promise.resolve(module.InReview),
                ),
              read: 'all',
            },
            {
              id: Roles.ORGANIZATION,
              read: 'all',
              write: 'all',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
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
          SUBMIT: {
            target: States.PAID_OUT,
          },
        },
      },
      [States.PAID_OUT]: {
        entry: 'clearAssignees',
        meta: {
          status: FormModes.APPROVED,
          name: application.general.name.defaultMessage,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            pendingAction: {
              displayStatus: 'success',
              title: states.paidOutTitle,
              content: states.paidOutDescription,
            },
          },
          onEntry: defineTemplateApi({
            action: 'approvedByOrganization',
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Approved').then((module) =>
                  Promise.resolve(module.Approved),
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
  mapUserToRole: (nationalId, application) => {
    if (nationalId === application.applicant) {
      return Roles.APPLICANT
    }
    if (nationalId === InstitutionNationalIds.SYSLUMENN) {
      return Roles.ORGANIZATION
    }
    return undefined
  },
}

export default GrindavikHousingBuyoutTemplate
