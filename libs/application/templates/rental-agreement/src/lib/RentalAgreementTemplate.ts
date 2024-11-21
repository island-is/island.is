import {
  Application,
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  DefaultEvents,
  UserProfileApi,
} from '@island.is/application/types'
import { pruneAfterDays } from '@island.is/application/core'
import { Features } from '@island.is/feature-flags'
import { States, Roles } from './constants'
import { dataSchema } from './dataSchema'
import {
  NationalRegistryUserApi,
  NationalRegistrySpouseApi,
} from '../dataProviders'
import { AuthDelegationType } from '@island.is/shared/types'

type Events = { type: DefaultEvents.SUBMIT } | { type: DefaultEvents.EDIT }

const RentalAgreementTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.RENTAL_AGREEMENT,
  name: 'Leigusamningur',
  institution: 'Húsnæðis- og mannvirkjastofnun',
  dataSchema,
  featureFlag: Features.rentalAgreement,
  allowedDelegations: [{ type: AuthDelegationType.GeneralMandate }],
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: States.PREREQUISITES,
          progress: 0,
          status: 'draft',
          lifecycle: pruneAfterDays(1),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/prerequisitesForm').then((module) =>
                  Promise.resolve(module.PrerequisitesForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              delete: true,
              api: [
                UserProfileApi,
                NationalRegistryUserApi,
                NationalRegistrySpouseApi,
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: [{ target: States.DRAFT }],
        },
      },
      [States.DRAFT]: {
        meta: {
          name: States.DRAFT,
          status: 'draft',
          lifecycle: pruneAfterDays(1),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/rentalAgreementForm').then((module) =>
                  Promise.resolve(module.RentalAgreementForm),
                ),
              write: 'all',
              read: 'all',
              delete: true,
            },
          ],
        },

        on: {
          [DefaultEvents.SUBMIT]: {
            target: 'draft',
          },
        },
      },
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): Roles | undefined {
    if (application.applicant === nationalId) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default RentalAgreementTemplate
