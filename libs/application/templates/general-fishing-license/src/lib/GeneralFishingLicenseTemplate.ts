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
  readyForProduction: true,
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
          progress: 0.2,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: false,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/index').then((val) =>
                  Promise.resolve(val.GeneralFishingLicenseForm),
                ),
              write: 'all',
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
