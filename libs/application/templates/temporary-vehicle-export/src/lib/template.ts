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
import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
  pruneAfterDays,
} from '@island.is/application/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Features } from '@island.is/feature-flags'
import { AuthDelegationType } from '@island.is/shared/types'
import { ApiScope } from '@island.is/auth/scopes'
import { dataSchema } from './dataSchema'
import { m } from './messages'
import { EligibleVehiclesApi } from '../dataProviders'
import { ApiActions, Events, Roles, States } from '../types'
import { MAX_DAYS_ABROAD } from '../utils/constants'
import { getSelectedPermno } from '../utils/helpers'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.TEMPORARY_VEHICLE_EXPORT,
  name: (application: Application) => {
    const permno = getSelectedPermno(application.answers)
    return { name: m.application.name, value: permno ? `- ${permno}` : '' }
  },
  codeOwner: CodeOwners.Advania,
  institution: m.application.institution,
  featureFlag: Features.isTemporaryVehicleExportEnabled,
  translationNamespaces:
    ApplicationConfigurations.TemporaryVehicleExport.translation,
  dataSchema,
  allowedDelegations: [
    { type: AuthDelegationType.ProcurationHolder },
    { type: AuthDelegationType.Custom },
  ],
  requiredScopes: [ApiScope.samgongustofaVehicles],
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: States.PREREQUISITES,
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
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              api: [EligibleVehiclesApi],
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DEPARTURE },
        },
      },
      [States.DEPARTURE]: {
        meta: {
          name: States.DEPARTURE,
          progress: 0.33,
          status: FormModes.DRAFT,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: m.application.historyDepartureRegistered,
              },
            ],
          },
          onExit: [
            defineTemplateApi({
              action: ApiActions.registerDepartureMileage,
              triggerEvent: DefaultEvents.SUBMIT,
            }),
          ],
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/departureForm').then((module) =>
                  Promise.resolve(module.DepartureForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: { answers: ['vehicle', 'departure'] },
              read: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.AWAITING_ARRIVAL },
        },
      },
      [States.AWAITING_ARRIVAL]: {
        meta: {
          name: States.AWAITING_ARRIVAL,
          progress: 0.66,
          status: FormModes.IN_PROGRESS,
          // The application stays open for the whole trip abroad
          lifecycle: pruneAfterDays(MAX_DAYS_ABROAD),
          actionCard: {
            pendingAction: {
              title: m.application.pendingArrivalTitle,
              content: m.application.pendingArrivalContent,
              button: m.application.pendingArrivalButton,
              displayStatus: 'info',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: m.application.historyArrivalRegistered,
              },
            ],
          },
          onExit: [
            defineTemplateApi({
              action: ApiActions.registerArrivalMileage,
              triggerEvent: DefaultEvents.SUBMIT,
            }),
            defineTemplateApi({
              action: ApiActions.submitToSkatturinn,
              triggerEvent: DefaultEvents.SUBMIT,
            }),
          ],
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/arrivalForm').then((module) =>
                  Promise.resolve(module.ArrivalForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: { answers: ['arrival', 'proofOfTravel'] },
              read: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.COMPLETED },
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: States.COMPLETED,
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

export default template
