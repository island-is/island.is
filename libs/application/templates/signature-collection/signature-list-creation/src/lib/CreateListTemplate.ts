import { DefaultStateLifeCycle } from '@island.is/application/core'
import {
  Application,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'
import { Events, Roles, States } from './constants'
import { dataSchema } from './dataSchema'
import { m } from './messages'

const CreateListTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.SIGNATURE_LIST_CREATION,
  name: m.applicationName,
  institution: m.institution,
  featureFlag: Features.signatureListCreation,
  dataSchema,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: m.applicationName.defaultMessage,
          status: 'draft',
          lifecycle: DefaultStateLifeCycle,
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
                  name: m.createList,
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
              api: [NationalRegistryUserApi, UserProfileApi],
            },
          ],
          actionCard: {
            historyLogs: [
              {
                logMessage: m.logListCreated,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
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
          progress: 1,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: false,
          },
          /* Add when ready
          onEntry: defineTemplateApi({
            action: ApiActions.submitApplication,
            shouldPersistToExternalData: true,
            throwOnError: true,
          })*/
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Done').then((val) =>
                  Promise.resolve(val.Done),
                ),
              read: 'all',
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
    }
    return undefined
  },
}

export default CreateListTemplate
