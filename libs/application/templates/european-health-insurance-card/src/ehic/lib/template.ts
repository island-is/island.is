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
import { Roles, States } from '../constants'

type Events = { type: DefaultEvents.SUBMIT } | { type: DefaultEvents.ABORT }

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
      [States.DRAFT]: {
        meta: {
          name: 'EhicApplication.Draft',
          status: States.DRAFT,
          progress: 0.43,
          lifecycle: DefaultStateLifeCycle,
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
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              api: [NationalRegistryUserApi],
              write: 'all',
              read: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.APPROVED,
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
                  './../forms/european-health-insurance-card'
                ).then((val) =>
                  Promise.resolve(val.EuropeanHealthInsuranceCard),
                ),
            },
          ],
          onEntry: defineTemplateApi({
            action: TEMPLATE_API_ACTIONS.sendApplication,
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
