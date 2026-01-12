import { EphemeralStateLifeCycle } from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  DefaultEvents,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import { Events, States, Roles } from './constants'
import { application } from './messages'
import { dataSchema } from './dataSchema'
import { Features } from '@island.is/feature-flags'
import { externalData } from '../lib/messages'
import { CodeOwners } from '@island.is/shared/constants'

const AlcoholTaxRedemptionTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.ALCOHOL_TAX_REDEMPTION,
  name: application.applicationTitle,
  codeOwner: CodeOwners.NordaApplications,
  institution: application.institutionName,
  featureFlag: Features.alcoholTaxRedemption,
  dataSchema,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          status: 'draft',
          name: 'Draft',
          progress: 0.1,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: async () =>
                import('../forms/prerequisites').then((val) =>
                  Promise.resolve(val.prerequisitesForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: '',
                  type: 'primary',
                },
              ],
              api: [
                NationalRegistryUserApi.configure({
                  params: {
                    ageToValidate: 20,
                    ageToValidateError: {
                      title: externalData.userProfileTitleValidateAgeError,
                      summary: externalData.userProfileSubTitleValidateAgeError,
                    },
                  },
                }),
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
      [States.DRAFT]: {
        meta: {
          name: 'Draft state',
          status: 'inprogress',
          progress: 0.4,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/draft').then((val) =>
                  Promise.resolve(val.draftForm),
                ),
              actions: [
                { event: DefaultEvents.SUBMIT, name: 'Panta', type: 'primary' },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DONE },
        },
      },
      [States.DONE]: {
        meta: {
          status: 'completed',
          name: 'Done',
          progress: 1,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/overview').then((val) => val.overviewForm),
              read: 'all',
              delete: true,
            },
          ],
        },
      },
    },
  },
  mapUserToRole(nationalId, { applicant }) {
    if (nationalId === applicant) {
      return Roles.APPLICANT
    }

    return undefined
  },
}

export default AlcoholTaxRedemptionTemplate
