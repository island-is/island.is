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
  NationalRegistryUserApi,
  UserProfileApi,
  checkResidence,
  grindaVikHousing,
} from '../dataProviders'
import { GrindavikHousingBuyoutSchema } from './dataSchema'
import { States, TWENTY_FOUR_HOURS_IN_MS } from './constants'
import {
  DefaultStateLifeCycle,
  coreHistoryMessages,
} from '@island.is/application/core'
import { Features } from '@island.is/feature-flags'
import { application, states } from './messages'
import { assign } from 'xstate'
import set from 'lodash/set'

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
  dataSchema: GrindavikHousingBuyoutSchema,
  translationNamespaces: [configuration.translation],
  featureFlag: Features.grindavikHousingBuyout,
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
                NationalRegistryUserApi,
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
        exit: 'clearAssignees',
        meta: {
          status: FormModes.IN_PROGRESS,
          name: application.general.name.defaultMessage,
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: 'submitApplication',
            shouldPersistToExternalData: true,
          }),
          actionCard: {
            historyLogs: [
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage: coreHistoryMessages.applicationApproved,
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
          APPROVE: {
            target: States.APPROVED,
          },
          REJECT: {
            target: States.REJECTED,
          },
        },
      },
      [States.REJECTED]: {
        meta: {
          status: FormModes.REJECTED,
          name: application.general.name.defaultMessage,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            pendingAction: {
              displayStatus: 'error',
              content: states.rejectedText,
            },
          },
          onEntry: defineTemplateApi({
            action: 'rejectedByOrganization',
          }),
        },
      },
      [States.APPROVED]: {
        meta: {
          status: FormModes.APPROVED,
          name: application.general.name.defaultMessage,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            pendingAction: {
              displayStatus: 'success',
              content: states.approvedText,
            },
          },
          onEntry: defineTemplateApi({
            action: 'approvedByOrganization',
          }),
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
