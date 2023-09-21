import {
  ApplicationTemplate,
  ApplicationContext,
  ApplicationStateSchema,
  Application,
  ApplicationTypes,
  ApplicationConfigurations,
  ApplicationRole,
  DefaultEvents,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'

import {
  coreHistoryMessages,
  pruneAfterDays,
} from '@island.is/application/core'

import { Events, Roles, States } from './constants'
import { dataSchema } from './dataSchema'
import { childPensionFormMessage } from './messages'
import { NationalRegistryResidenceHistoryApi } from '../dataProviders'

const ChildPensionTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.CHILD_PENSION,
  name: childPensionFormMessage.shared.applicationTitle,
  institution: childPensionFormMessage.shared.institution,
  translationNamespaces: [ApplicationConfigurations.childPension.translation],
  dataSchema,
  stateMachineConfig: {
    initial: States.PREREQUESITES,
    states: {
      [States.PREREQUESITES]: {
        meta: {
          name: States.PREREQUESITES,
          status: 'draft',
          lifecycle: pruneAfterDays(1),
          progress: 0.25,
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationStarted,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
          //onExit: defineTemplateApi - kalla á TR
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Prerequisites').then((val) =>
                  Promise.resolve(val.PrerequisitesForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              write: 'all',
              api: [
                NationalRegistryUserApi,
                UserProfileApi,
                NationalRegistryResidenceHistoryApi,
              ],
              delete: true,
            },
          ],
        },
        on: {
          SUBMIT: States.DRAFT,
        },
      },
      [States.DRAFT]: {
        meta: {
          name: States.DRAFT,
          status: 'draft',
          lifecycle: pruneAfterDays(30),
          progress: 0.25,
          actionCard: {
            historyLogs: {
              onEvent: DefaultEvents.SUBMIT,
              logMessage: coreHistoryMessages.applicationSent,
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ChildPensionForm').then((val) =>
                  Promise.resolve(val.ChildPensionForm),
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
            },
          ],
        },
        // on: {
        //   SUBMIT: [],
        // },
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
}

export default ChildPensionTemplate
