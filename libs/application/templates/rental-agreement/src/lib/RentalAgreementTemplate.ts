import { pruneAfterDays } from '@island.is/application/core'
import { Features } from '@island.is/feature-flags'
import { AuthDelegationType } from '@island.is/shared/types'
import {
  Application,
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  DefaultEvents,
  UserProfileApi,
  ApplicationConfigurations,
} from '@island.is/application/types'
import { States, Roles } from './constants'
import { dataSchema } from './dataSchema'
import {
  NationalRegistryUserApi,
  NationalRegistrySpouseApi,
} from '../dataProviders'
import { CodeOwners } from '@island.is/shared/constants'

type Events = { type: DefaultEvents.SUBMIT } | { type: DefaultEvents.EDIT }

const RentalAgreementTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.RENTAL_AGREEMENT,
  codeOwner: CodeOwners.KolibriKotid,
  name: 'Leigusamningur',
  institution: 'Húsnæðis- og mannvirkjastofnun',
  translationNamespaces: [
    ApplicationConfigurations.RentalAgreement.translation,
  ],
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
          lifecycle: pruneAfterDays(30),
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
          progress: 75,
          status: 'draft',
          lifecycle: pruneAfterDays(30),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/rentalAgreementForm').then((module) =>
                  Promise.resolve(module.RentalAgreementForm),
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
