import {
  ApplicationTemplate,
  ApplicationContext,
  ApplicationStateSchema,
  Application,
  ApplicationTypes,
  ApplicationConfigurations,
  ApplicationRole,
  DefaultEvents,
  NationalRegistryUserApi,
  NationalRegistrySpouseApi,
} from '@island.is/application/types'

import {
  EphemeralStateLifeCycle,
  pruneAfterDays,
} from '@island.is/application/core'
import {
  Events,
  Roles,
  States,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { dataSchema } from './dataSchema'
import { survivorsBenefitsFormMessage } from './messages'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { SocialInsuranceAdministrationApplicantApi } from '../dataProviders'

const SurvivorsBenefitsTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.SURVIVORS_BENEFITS,
  name: survivorsBenefitsFormMessage.shared.applicationTitle,
  institution: socialInsuranceAdministrationMessage.shared.institution,
  translationNamespaces:
    ApplicationConfigurations.SurvivorsBenefits.translation,
  dataSchema,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: States.PREREQUISITES,
          status: 'draft',
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Prerequisites').then((val) =>
                  Promise.resolve(val.PrerequisitesForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Hefja umsókn',
                  type: 'primary',
                },
              ],
              write: 'all',
              api: [
                NationalRegistryUserApi,
                NationalRegistrySpouseApi,
                SocialInsuranceAdministrationApplicantApi,
              ],
              delete: true,
            },
          ],
        },
        on: {
          SUBMIT: States.DRAFT,
        },
      },
      [States.DRAFT]: {
        meta: {
          name: States.DRAFT,
          status: 'draft',
          lifecycle: pruneAfterDays(30), // how long should application live in draft mode?
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/SurvivorsBenefitsForm').then((val) =>
                  Promise.resolve(val.SurvivorsBenefitsForm),
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
            },
          ],
        },
        // on: {
        //   SUBMIT: [],
        // },
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

export default SurvivorsBenefitsTemplate
