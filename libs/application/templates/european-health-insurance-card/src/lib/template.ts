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
  EhicApplyForTemporaryCardApi,
  EhicCardResponseApi,
  EhicGetTemporaryCardApi,
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
    initial: States.PLASTIC,
    states: {
      [States.PLASTIC]: {
        meta: {
          name: 'EHIC-Plastic',
          status: 'draft',
          progress: 0.33,
          lifecycle: DefaultStateLifeCycle,
          onExit: defineTemplateApi({
            action: ApiActions.applyForPhysicalCard,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import(
                  '../forms/EuropeanHealthInsuranceCardApplyPlastic'
                ).then((val) =>
                  Promise.resolve(val.EuropeanHealthInsuranceCardApplyPlastic),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'EHIC-Plastic-submit',
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
            target: States.PDF,
          },
        },
      },
      [States.PDF]: {
        meta: {
          name: 'Ehic-PDF',
          status: 'draft',
          progress: 0.66,
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: ApiActions.applyForPhysicalCard,
          }),
          onExit: defineTemplateApi({
            action: ApiActions.applyForTemporaryCard,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import(
                  '../forms/EuropeanHealthInsuranceCardApplyPDF'
                ).then((val) =>
                  Promise.resolve(val.EuropeanHealthInsuranceCardApplyPDF),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Ehic-PDF-submit',
                  type: 'primary',
                },
              ],
              api: [EhicApplyForPhysicalCardApi, EhicApplyForTemporaryCardApi],
              write: 'all',
              read: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.COMPLETED,
          },
        },
      },

      [States.COMPLETED]: {
        meta: {
          name: 'EHIC-Approved',
          status: States.COMPLETED,
          progress: 1,
          onEntry: defineTemplateApi({
            action: ApiActions.getTemporaryCard,
          }),
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,

              formLoader: () =>
                import(
                  '../forms/EuropeanHealthInsuranceCardReview'
                ).then((val) =>
                  Promise.resolve(val.EuropeanHealthInsuranceCardReview),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'EHIC-Approved-Submit',
                  type: 'primary',
                },
              ],
              api: [EhicGetTemporaryCardApi],
              write: 'all',
              read: 'all',
              delete: true,
            },
          ],
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
