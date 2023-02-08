import {
  Application,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  ChildrenCustodyInformationApi,
  DefaultEvents,
  defineTemplateApi,
  NationalRegistrySpouseApi,
  NationalRegistryUserApi,
} from '@island.is/application/types'

import { DefaultStateLifeCycle } from '@island.is/application/core'
import { dataSchema } from './dataSchema'
import { europeanHealthInsuranceCardApplicationMessages as e } from '../lib/messages'
import {
  EhicApplyForPhysicalCardApi,
  EhicCardResponseApi,
} from '../dataProviders'
import { ApiActions } from '../dataProviders/apiActions'
import { States } from './types'

type Events = { type: DefaultEvents.SUBMIT } | { type: DefaultEvents.ABORT }

enum Roles {
  APPLICANT = 'applicant',
}

enum TEMPLATE_API_ACTIONS {
  // Has to match name of action in template API module
  // (will be refactored when state machine is a part of API module)
  sendApplication = 'sendApplication',
}
const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.EUROPEAN_HEALTH_INSURANCE_CARD,
  name: e.application.applicationName,
  institution: e.application.institutionName,
  readyForProduction: false,
  dataSchema,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Umsókn um Umsokn',
          status: 'draft',
          progress: 0.43,
          lifecycle: DefaultStateLifeCycle,
          onExit: defineTemplateApi({
            action: ApiActions.applyForPhysicalCard,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import(
                  './../forms/EuropeanHealthInsurancePrerequisitiesForm'
                ).then((val) =>
                  Promise.resolve(
                    val.EuropeanHealthInsurancePrerequisitiesForm,
                  ),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              api: [
                NationalRegistryUserApi,
                NationalRegistrySpouseApi,
                ChildrenCustodyInformationApi,
                EhicCardResponseApi,
                EhicApplyForPhysicalCardApi,
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
          name: 'Umsókn um Umsokn',
          status: 'draft',
          progress: 0.43,
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: ApiActions.applyForPhysicalCard,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import(
                  './../forms/european-health-insurance-card'
                ).then((val) =>
                  Promise.resolve(val.EuropeanHealthInsuranceCard),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              api: [EhicApplyForPhysicalCardApi],
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

      [States.APPROVED]: {
        meta: {
          name: 'Approved',
          status: 'approved',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              read: 'all',
              formLoader: () =>
                import(
                  './../forms/european-health-insurance-review-card'
                ).then((val) =>
                  Promise.resolve(val.EuropeanHealthInsuranceReviewCard),
                ),
            },
          ],
          onEntry: defineTemplateApi({
            action: ApiActions.applyForPhysicalCard,
          }),
        },
      },
    },
  },
  mapUserToRole(
    nationalRegistryIdOfAuthenticatedUser: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (nationalRegistryIdOfAuthenticatedUser === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default template
