import {
  Application,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
} from '@island.is/application/core'
import { States } from '../constants'
import { GeneralFishingLicenseSchema } from './dataSchema'
import { application } from './messages'
import * as z from 'zod'

enum Roles {
  APPLICANT = 'applicant',
}

type GeneralFishingLicenseEvent = { type: DefaultEvents.SUBMIT }

const GeneralFishingLicenseTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<GeneralFishingLicenseEvent>,
  GeneralFishingLicenseEvent
> = {
  type: ApplicationTypes.GENERAL_FISHING_LICENSE,
  name: application.general.name,
  institution: application.general.institutionName,
  readyForProduction: false,
  translationNamespaces: [
    ApplicationConfigurations.GeneralFishingLicense.translation,
  ],
  dataSchema: GeneralFishingLicenseSchema,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: application.general.name.defaultMessage,
          progress: 0.3,
          // Application is only suppose to live for an hour while building it, change later
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 3600 * 1000,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/GeneralFishingLicenseForm/index').then((val) =>
                  Promise.resolve(val.GeneralFishingLicenseForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.SUBMITTED,
          },
        },
      },
      [States.SUBMITTED]: {
        meta: {
          name: application.general.name.defaultMessage,
          progress: 1,
          // Application is only suppose to live for an hour while building it, change later
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 3600 * 1000,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import(
                  '../forms/GeneralFishingLicenseSubmittedForm'
                ).then((val) =>
                  Promise.resolve(val.GeneralFishingLicenseSubmittedForm),
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

export default GeneralFishingLicenseTemplate
