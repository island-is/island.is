import {
  DefaultStateLifeCycle,
  coreHistoryMessages,
} from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTypes,
  ApplicationRole,
  Application,
  DefaultEvents,
  defineTemplateApi,
  NationalRegistryV3UserApi,
  UserProfileApi,
  DistrictsApi,
  QualityPhotoApi,
} from '@island.is/application/types'
import { Events, States, Roles } from './constants'
import { dataSchema } from './dataSchema'
import { ApiActions } from './constants'
import { AuthDelegationType } from '@island.is/shared/types'
import { DoctorsNoteApi } from '../dataProviders'
import { CodeOwners } from '@island.is/shared/constants'

const PSignTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.P_SIGN,
  name: 'Stæðiskort',
  codeOwner: CodeOwners.Juni,
  dataSchema: dataSchema,
  allowedDelegations: [{ type: AuthDelegationType.LegalGuardian }],
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Draft',
          status: 'draft',
          progress: 0.33,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 24 * 3600 * 1000,
          },
          onExit: defineTemplateApi({
            action: ApiActions.submitApplication,
            shouldPersistToExternalData: true,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/application').then((val) =>
                  Promise.resolve(val.getApplication()),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
              api: [
                NationalRegistryV3UserApi,
                UserProfileApi,
                DistrictsApi,
                QualityPhotoApi,
                DoctorsNoteApi,
              ],
              delete: true,
            },
            {
              id: Roles.ACTOR,
              formLoader: () =>
                import('../forms/applicationWithActor').then((val) =>
                  Promise.resolve(val.getApplication()),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
              api: [
                NationalRegistryV3UserApi,
                UserProfileApi,
                DistrictsApi,
                QualityPhotoApi,
                DoctorsNoteApi,
              ],
              delete: true,
            },
          ],
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationStarted,
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
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () => import('../forms/done').then((val) => val.done),
              read: 'all',
            },
            {
              id: Roles.ACTOR,
              formLoader: () => import('../forms/done').then((val) => val.done),
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
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (
      application.applicant === nationalId &&
      application.applicantActors.length > 0
    ) {
      return Roles.ACTOR
    } else if (application.applicant === nationalId) {
      return Roles.APPLICANT
    }
  },
}

export default PSignTemplate
