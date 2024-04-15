import {
  coreHistoryMessages,
  EphemeralStateLifeCycle,
  getValueViaPath,
  pruneAfterDays,
} from '@island.is/application/core'
import {
  Application,
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
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'
import { assign } from 'xstate'
import {
  IdentityDocumentApi,
  SyslumadurPaymentCatalogApi,
  DeliveryAddressApi,
  UserInfoApi,
  NationalRegistryUser,
} from '../dataProviders'
import { application as applicationMessage } from './messages'
import { ApiActions, Events, Roles, States } from './constants'
import { dataSchema } from './dataSchema'
import { buildPaymentState } from '@island.is/application/utils'
// import { needAssignment } from './utils'

const getCode = (application: Application) => {
  const chargeItemCode = getValueViaPath<string>(
    application.answers,
    'chargeItemCode',
  )
  if (!chargeItemCode) {
    throw new Error('chargeItemCode missing in request')
  }
  return [chargeItemCode]
}

// export const hasReviewer = (context: ApplicationContext) => {
//   const { answers, externalData } = context.application
//   return needAssignment(answers, externalData)
// }

const IdCardTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.ID_CARD,
  name: applicationMessage.name,
  featureFlag: Features.idCardApplication,
  dataSchema,
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
                PassportsApi,
                DistrictsApi,
                IdentityDocumentApi,
                DeliveryAddressApi,
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DRAFT },
          [DefaultEvents.PAYMENT]: { target: States.PAYMENT },
        },
      },
      [States.DRAFT]: {
        meta: {
          name: 'Umsókn um nafnskírteini',
          status: 'draft',
          progress: 0.25,
          lifecycle: pruneAfterDays(2),
          onExit: defineTemplateApi({
            action: ApiActions.checkForDiscount,
          }),
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationStarted,
                onEvent: DefaultEvents.PAYMENT,
              },
            ],
          },
        },
      },
      [States.PAYMENT]: buildPaymentState({
        organizationId: InstitutionNationalIds.SYSLUMENN,
        chargeItemCodes: getCode,
        submitTarget: [
          {
            target: States.PARENT_B_CONFIRM, // TODO CHANGE TO CHECK ALL PARENTS FOR ALL CHILDREN
            // cond: hasReviewer,
          },
          {
            target: States.COMPLETED,
          },
        ],
      }),
      //   [States.PARENT_B_CONFIRM]: {
      //     entry: 'assignToParentB',
      //     meta: {
      //       name: 'ParentB',
      //       status: 'inprogress',
      //       lifecycle: {
      //         ...pruneAfter(sevenDays),
      //         shouldDeleteChargeIfPaymentFulfilled: true,
      //       },
      //       onEntry: defineTemplateApi({
      //         action: ApiActions.assignParentB,
      //       }),
      //       roles: [
      //         {
      //           id: Roles.APPLICANT,
      //           formLoader: () =>
      //             import('../forms/WaitingForParentBConfirmation').then((val) =>
      //               Promise.resolve(val.WaitingForParentBConfirmation),
      //             ),
      //           read: {
      //             answers: ['childsPersonalInfo'],
      //             externalData: ['submitPassportApplication'],
      //           },
      //         },
      //         {
      //           id: Roles.ASSIGNEE,
      //           formLoader: () =>
      //             import('../forms/ParentB').then((val) =>
      //               Promise.resolve(val.ParentB),
      //             ),
      //           actions: [
      //             { event: DefaultEvents.SUBMIT, name: '', type: 'primary' },
      //           ],
      //           write: 'all',
      //           api: [
      //             NationalRegistryUserParentB,
      //             UserInfoApi,
      //             SyslumadurPaymentCatalogApi,
      //             PassportsApi,
      //             DistrictsApi,
      //             IdentityDocumentApi,
      //             DeliveryAddressApi,
      //           ],
      //         },
      //       ],
      //       actionCard: {
      //         historyLogs: [
      //           {
      //             logMessage: m.confirmedByParentB,
      //             onEvent: DefaultEvents.SUBMIT,
      //           },
      //         ],
      //         pendingAction: {
      //           title: m.waitingForConfirmationFromParentBTitle,
      //           content: m.waitingForConfirmationFromParentBDescription,
      //           displayStatus: 'warning',
      //         },
      //       },
      //     },
      //     on: {
      //       [DefaultEvents.SUBMIT]: { target: States.DONE },
      //     },
      //   },
      [States.COMPLETED]: {
        meta: {
          name: 'Done',
          status: 'completed',
          lifecycle: pruneAfterDays(30), // TODO HOW MANY DAYS SHOULD THIS BE?
          //   onEntry: defineTemplateApi({
          //     action: ApiActions.submitPassportApplication,
          //   }),
          //   roles: [
          //     {
          //       id: Roles.APPLICANT,
          //       formLoader: () =>
          //         import('../forms/Done').then((val) =>
          //           Promise.resolve(val.Done),
          //         ),
          //       read: {
          //         externalData: ['submitPassportApplication'],
          //         answers: [
          //           'submitPassportApplication',
          //           'childsPersonalInfo',
          //           'personalInfo',
          //           'passport',
          //         ],
          //       },
          //     },
          //     {
          //       id: Roles.ASSIGNEE,
          //       formLoader: () =>
          //         import('../forms/Done').then((val) =>
          //           Promise.resolve(val.Done),
          //         ),
          //       read: {
          //         externalData: ['submitPassportApplication'],
          //         answers: ['passport', 'childsPersonalInfo'],
          //       },
          //     },
          //   ],
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
          'childsPersonalInfo.guardian2.nationalId',
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
