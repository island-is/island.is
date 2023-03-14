import {
  Application,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  ChildrenCustodyInformationApi,
  DefaultEvents,
  NationalRegistrySpouseApi,
  NationalRegistryUserApi,
  defineTemplateApi,
} from '@island.is/application/types'
import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import {
  EhicApplyForPhysicalAndTemporary,
  EhicApplyForPhysicalCardApi,
  EhicApplyForTemporaryCardApi,
  EhicCardResponseApi,
  EhicGetTemporaryCardApi,
} from '../dataProviders'

import { ApiActions } from '../dataProviders/apiActions.enum'
import { States } from './types'
import { canApply } from './helpers/applicantHelper'
import { dataSchema } from './dataSchema'
import { europeanHealthInsuranceCardApplicationMessages as e } from '../lib/messages'

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
          name: 'EHIC-Prerequisites',
          status: 'draft',
          progress: 0.2,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/EuropeanHealthInsuranceCardPre').then((val) =>
                  Promise.resolve(val.EuropeanHealthInsuranceCardPre),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'EHIC-Prerequisites-submit',
                  type: 'primary',
                },
              ],
              api: [
                NationalRegistryUserApi,
                NationalRegistrySpouseApi,
                ChildrenCustodyInformationApi,
                EhicCardResponseApi,
              ],
              write: 'all',
              read: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: [
            {
              cond: canApply(true),
              target: States.PLASTIC,
            },
            {
              cond: canApply(false),
              target: States.DECLINED,
            },
          ],
        },
      },

      [States.PLASTIC]: {
        meta: {
          name: 'EHIC-FORM',
          status: 'draft',
          progress: 0.4,
          lifecycle: DefaultStateLifeCycle,
          onExit: defineTemplateApi({
            action: ApiActions.applyForPhysicalAndTemporary,
            shouldPersistToExternalData: true,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/EuropeanHealthInsuranceCardForm').then((val) =>
                  Promise.resolve(val.EuropeanHealthInsuranceCardForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'EHIC-Plastic-submit',
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
            target: States.REVIEW,
          },
        },
      },

      [States.REVIEW]: {
        meta: {
          name: 'EHIC-Review',
          status: 'draft',
          progress: 0.8,
          onExit: defineTemplateApi({
            action: ApiActions.applyForPhysicalAndTemporary,
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
              api: [EhicApplyForPhysicalAndTemporary],
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
          name: 'EHIC-Completed',
          status: 'completed',
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
                  '../forms/EuropeanHealthInsuranceCardCompleted'
                ).then((val) =>
                  Promise.resolve(val.EuropeanHealthInsuranceCardCompleted),
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

      [States.DECLINED]: {
        meta: {
          name: 'Declined',
          status: 'rejected',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Declined').then((val) => val.Declined),
              read: 'all',
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
