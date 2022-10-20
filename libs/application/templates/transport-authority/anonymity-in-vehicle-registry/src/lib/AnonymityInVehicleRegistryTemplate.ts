import {
  ApplicationConfigurations,
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { EphemeralStateLifeCycle } from '@island.is/application/core'
import { Events, States, Roles } from './constants'
import * as z from 'zod'
import { m } from './messages'
import { Features } from '@island.is/feature-flags'

const AnonymityInVehicleRegistrySchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
})

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.ANONYMITY_IN_VEHICLE_REGISTRY,
  name: m.name,
  institution: m.institutionName,
  translationNamespaces: [
    ApplicationConfigurations.AnonymityInVehicleRegistry.translation,
  ],
  dataSchema: AnonymityInVehicleRegistrySchema,
  featureFlag: Features.transportAuthorityAnonymityInVehicleRegistry,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Nafnleynd í ökutækjaskrá',
          actionCard: {
            tag: {
              label: m.actionCardDraft,
              variant: 'blue',
            },
          },
          progress: 0.25,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import(
                  '../forms/AnonymityInVehicleRegistryForm'
                ).then((module) =>
                  Promise.resolve(module.AnonymityInVehicleRegistryForm),
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
              api: [NationalRegistryUserApi, UserProfileApi],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.COMPLETED },
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: 'Completed',
          progress: 1,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            // Applications that stay in this state for 3x30 days (approx. 3 months) will be pruned automatically
            whenToPrune: 3 * 30 * 24 * 3600 * 1000,
          },
          actionCard: {
            tag: {
              label: m.actionCardDone,
              variant: 'blueberry',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Approved').then((val) =>
                  Promise.resolve(val.Approved),
                ),
              read: 'all',
            },
          ],
        },
        type: 'final' as const,
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

export default template
