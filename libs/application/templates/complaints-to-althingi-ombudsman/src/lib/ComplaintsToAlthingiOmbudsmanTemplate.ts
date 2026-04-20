import {
  DefaultStateLifeCycle,
  coreHistoryMessages,
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
  FormModes,
  defineTemplateApi,
} from '@island.is/application/types'
import { ApiActions } from '../shared'
import { ComplaintsToAlthingiOmbudsmanSchema } from './dataSchema'
import { NationalRegistryV3UserApi, UserProfileApi } from '../dataProviders'
import { Features } from '@island.is/feature-flags'
import { application as applicationMessage } from './messages'
import { CodeOwners } from '@island.is/shared/constants'

const States = {
  prerequisites: 'prerequisites',
  draft: 'draft',
  submitted: 'submitted',
}

type ComplaintsToAlthingiOmbudsmanEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }

enum Roles {
  APPLICANT = 'applicant',
}

const ComplaintsToAlthingiOmbudsmanTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<ComplaintsToAlthingiOmbudsmanEvent>,
  ComplaintsToAlthingiOmbudsmanEvent
> = {
  type: ApplicationTypes.COMPLAINTS_TO_ALTHINGI_OMBUDSMAN,
  name: applicationMessage.general.name,
  codeOwner: CodeOwners.NordaApplications,
  translationNamespaces:
    ApplicationConfigurations.ComplaintsToAlthingiOmbudsman.translation,
  dataSchema: ComplaintsToAlthingiOmbudsmanSchema,
  featureFlag: Features.complaintsToAlthingiOmbudsman,
  stateMachineConfig: {
    initial: States.prerequisites,
    states: {
      [States.prerequisites]: {
        meta: {
          name: applicationMessage.general.name.defaultMessage,
          status: FormModes.DRAFT,
          lifecycle: DefaultStateLifeCycle,
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
              api: [UserProfileApi, NationalRegistryV3UserApi],
            },
          ],
        },
        on: {
          SUBMIT: {
            target: States.draft,
          },
        },
      },
      [States.draft]: {
        meta: {
          name: States.draft,
          status: FormModes.DRAFT,
          progress: 0.5,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import(
                  '../forms/ComplaintsToAlthingiOmbudsmanApplication'
                ).then((val) =>
                  Promise.resolve(val.ComplaintsToAlthingiOmbudsmanApplication),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              api: [NationalRegistryV3UserApi, UserProfileApi],
              delete: true,
            },
          ],
        },
        on: {
          SUBMIT: {
            target: States.submitted,
          },
        },
      },
      [States.submitted]: {
        meta: {
          name: States.submitted,
          progress: 1,
          status: 'completed',
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: ApiActions.submitApplication,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ComplaintsToAlthingiOmbudsmanSubmitted').then(
                  (val) =>
                    Promise.resolve(val.ComplaintsToAlthingiOmbudsmanSubmitted),
                ),
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
}

export default ComplaintsToAlthingiOmbudsmanTemplate
