import {
  coreHistoryMessages,
  DefaultStateLifeCycle,
} from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  defineTemplateApi,
  NationalRegistryUserApi,
  HealthInsuranceApi,
  UserProfileApi,
} from '@island.is/application/types'
import { API_MODULE } from '../shared'
import { answerValidators } from './answerValidators'
import { m } from '../forms/messages'
import { HealthInsuranceSchema } from './dataSchema'

type Events = { type: DefaultEvents.SUBMIT }

enum Roles {
  APPLICANT = 'applicant',
}

enum ApplicationStates {
  PREREQUESITES = 'prerequisites',
  DRAFT = 'draft',
  IN_REVIEW = 'inReview',
}

const applicationName = m.formTitle.defaultMessage

const HealthInsuranceTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.HEALTH_INSURANCE,
  name: applicationName,
  dataSchema: HealthInsuranceSchema,
  allowMultipleApplicationsInDraft: false,
  stateMachineConfig: {
    initial: ApplicationStates.PREREQUESITES,
    states: {
      [ApplicationStates.PREREQUESITES]: {
        meta: {
          name: applicationName,
          status: 'draft',
          progress: 0,
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            // If application stays in this state for 24 hours it will be pruned automatically
            whenToPrune: 24 * 3600 * 1000,
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
                import('../forms/PrerequisitesForm').then((module) =>
                  Promise.resolve(module.PrerequisitesForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Hefja umsókn',
                  type: 'primary',
                },
              ],
              delete: true,
              write: 'all',
              api: [
                NationalRegistryUserApi,
                HealthInsuranceApi,
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
          progress: 0.25,
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
                import('../forms/HealthInsuranceForm').then((module) =>
                  Promise.resolve(module.HealthInsuranceForm),
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
            target: ApplicationStates.IN_REVIEW,
          },
        },
      },
      [ApplicationStates.IN_REVIEW]: {
        meta: {
          status: 'completed',
          name: applicationName,
          onEntry: defineTemplateApi({
            action: API_MODULE.sendApplyHealthInsuranceApplication,
            throwOnError: false,
          }),
          actionCard: {
            pendingAction: {
              title: coreHistoryMessages.applicationReceived,
              content: m.actionCardSuccessFullSubmissionDescription,
              displayStatus: 'success',
            },
          },
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ConfirmationScreen').then((module) =>
                  Promise.resolve(module.HealthInsuranceConfirmation),
                ),
              read: 'all',
            },
          ],
        },
      },
    },
  },
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (id === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
  answerValidators,
}

export default HealthInsuranceTemplate
