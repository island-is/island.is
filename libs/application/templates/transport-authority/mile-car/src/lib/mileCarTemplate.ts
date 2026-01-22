import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  FormModes,
  UserProfileApi,
  ApplicationConfigurations,
  defineTemplateApi,
} from '@island.is/application/types'
import { Events, Roles, States } from '../utils/constants'
import { CodeOwners } from '@island.is/shared/constants'
import { dataSchema } from './dataSchema'
import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
  getValueViaPath,
} from '@island.is/application/core'
import { application as applicationMessages } from '../lib/messages/application'
import { ApiActions } from '../shared'
import { Features } from '@island.is/feature-flags'
import { CurrentVehiclesApi } from '../dataProviders'
import { AuthDelegationType } from '@island.is/shared/types'

const determineMessageFromApplicationAnswers = (application: Application) => {
  const plate = getValueViaPath(
    application.answers,
    'pickVehicle.plate',
    undefined,
  ) as string | undefined

  return {
    name: applicationMessages.name,
    value: plate ? `- ${plate}` : '',
  }
}

const mileCarTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.MILE_CAR,
  featureFlag: Features.isMileCarEnabled,
  name: determineMessageFromApplicationAnswers,
  codeOwner: CodeOwners.Origo,
  institution: applicationMessages.institutionName,
  translationNamespaces: ApplicationConfigurations.MileCar.translation,
  allowedDelegations: [
    {
      type: AuthDelegationType.ProcurationHolder,
    },
    {
      type: AuthDelegationType.Custom,
    },
  ],
  dataSchema,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Skilyrði',
          progress: 0,
          status: FormModes.DRAFT,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/prerequisitesForm').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              api: [UserProfileApi, CurrentVehiclesApi],
              delete: true,
            },
          ],
        },

        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.DRAFT,
          },
        },
      },
      [States.DRAFT]: {
        meta: {
          name: 'Main form',
          progress: 0.4,
          status: FormModes.DRAFT,
          lifecycle: DefaultStateLifeCycle,
          onExit: defineTemplateApi({
            action: ApiActions.submitApplication,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/mainForm').then((module) =>
                  Promise.resolve(module.MainForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              delete: true,
            },
          ],
        },

        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.COMPLETED,
          },
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: 'Completed form',
          progress: 1,
          status: FormModes.COMPLETED,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/completedForm').then((module) =>
                  Promise.resolve(module.completedForm),
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

export default mileCarTemplate
