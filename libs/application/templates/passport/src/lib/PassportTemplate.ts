import {
  coreHistoryMessages,
  getValueViaPath,
} from '@island.is/application/core'
import {
  Application,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  BasicChargeItem,
  DefaultEvents,
  defineTemplateApi,
  InstitutionNationalIds,
  MockablePaymentCatalogApi,
  PassportsApi,
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'
import { assign } from 'xstate'
import {
  IdentityDocumentApi,
  SyslumadurPaymentCatalogApi,
  UserInfoApi,
  NationalRegistryUser,
  NationalRegistryUserParentB,
} from '../dataProviders'
import { m } from '../lib/messages'
import {
  ApiActions,
  Events,
  Roles,
  sevenDays,
  sixtyDays,
  States,
  twoDays,
} from './constants'
import { dataSchema } from './dataSchema'
import { buildPaymentState } from '@island.is/application/utils'
import { needAssignment } from './utils'
import { CodeOwners } from '@island.is/shared/constants'

const pruneAfter = (time: number) => {
  return {
    shouldBeListed: true,
    shouldBePruned: true,
    whenToPrune: time,
  }
}
const getCode = (application: Application): BasicChargeItem[] => {
  const chargeItemCode = getValueViaPath<string>(
    application.answers,
    'chargeItemCode',
  )
  if (!chargeItemCode) {
    throw new Error('chargeItemCode missing in request')
  }
  return [{ code: chargeItemCode }]
}

export const hasReviewer = (context: ApplicationContext) => {
  const { answers, externalData } = context.application
  return needAssignment(answers, externalData)
}

const PassportTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.PASSPORT,
  name: m.formName,
  codeOwner: CodeOwners.Juni,
  featureFlag: Features.passportApplication,
  dataSchema,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      draft: {
        meta: {
          name: m.formName.defaultMessage,
          status: 'draft',
          lifecycle: pruneAfter(twoDays),
          onExit: defineTemplateApi({
            action: ApiActions.checkForDiscount,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Draft').then((val) =>
                  Promise.resolve(val.Draft),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.confirm,
                  type: 'primary',
                },
                {
                  event: DefaultEvents.PAYMENT,
                  name: m.confirm,
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
              api: [
                NationalRegistryUser,
                UserInfoApi,
                SyslumadurPaymentCatalogApi,
                MockablePaymentCatalogApi.configure({
                  externalDataId: 'payment',
                }),
                PassportsApi,
                IdentityDocumentApi,
              ],
            },
          ],
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationStarted,
                onEvent: DefaultEvents.PAYMENT,
              },
            ],
          },
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DRAFT },
          [DefaultEvents.PAYMENT]: { target: States.PAYMENT },
        },
      },
      [States.PAYMENT]: buildPaymentState({
        organizationId: InstitutionNationalIds.SYSLUMENN,
        chargeItems: getCode,
        submitTarget: [
          {
            target: States.PARENT_B_CONFIRM,
            cond: hasReviewer,
          },
          {
            target: States.DONE,
          },
        ],
      }),
      [States.PARENT_B_CONFIRM]: {
        entry: 'assignToParentB',
        meta: {
          name: 'ParentB',
          status: 'inprogress',
          lifecycle: {
            ...pruneAfter(sevenDays),
            shouldDeleteChargeIfPaymentFulfilled: true,
          },
          onEntry: defineTemplateApi({
            action: ApiActions.assignParentB,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/WaitingForParentBConfirmation').then((val) =>
                  Promise.resolve(val.WaitingForParentBConfirmation),
                ),
              read: {
                answers: ['childsPersonalInfo'],
                externalData: ['submitPassportApplication'],
              },
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
              api: [
                NationalRegistryUserParentB,
                UserInfoApi,
                SyslumadurPaymentCatalogApi,
                PassportsApi,
                IdentityDocumentApi,
              ],
            },
          ],
          actionCard: {
            historyLogs: [
              {
                logMessage: m.confirmedByParentB,
                onEvent: DefaultEvents.SUBMIT,
                includeSubjectAndActor: true,
              },
            ],
            pendingAction: {
              title: m.waitingForConfirmationFromParentBTitle,
              content: m.waitingForConfirmationFromParentBDescription,
              displayStatus: 'warning',
            },
          },
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DONE },
        },
      },
      [States.DONE]: {
        meta: {
          name: 'Done',
          status: 'completed',
          lifecycle: pruneAfter(sixtyDays),
          onEntry: defineTemplateApi({
            action: ApiActions.submitPassportApplication,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Done').then((val) =>
                  Promise.resolve(val.Done),
                ),
              read: {
                externalData: ['submitPassportApplication'],
                answers: [
                  'submitPassportApplication',
                  'childsPersonalInfo',
                  'personalInfo',
                  'passport',
                ],
              },
            },
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/Done').then((val) =>
                  Promise.resolve(val.Done),
                ),
              read: {
                externalData: ['submitPassportApplication'],
                answers: ['passport', 'childsPersonalInfo'],
              },
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

export default PassportTemplate
