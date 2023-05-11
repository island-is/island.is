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
import { DefaultStateLifeCycle } from '@island.is/application/core'
import {
  EhicApplyForPhysicalAndTemporary,
  EhicCardResponseApi,
  EhicGetTemporaryCardApi,
} from '../dataProviders'

import { ApiActions } from '../dataProviders/apiActions.enum'
import { States } from './types'
import {
  someAreInsured,
  someCanApplyForPlasticOrPdf,
} from './helpers/applicantHelper'
import { dataSchema } from './dataSchema'
import { europeanHealthInsuranceCardApplicationMessages as e } from '../lib/messages'
import { Features } from '@island.is/feature-flags'

type Events = { type: DefaultEvents.SUBMIT } | { type: DefaultEvents.ABORT }

enum Roles {
  APPLICANT = 'applicant',
}

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.EUROPEAN_HEALTH_INSURANCE_CARD,
  name: e.application.applicationName,
  institution: e.application.institutionName,
  featureFlag: Features.europeanHealthInsuranceCard,
  dataSchema,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Prerequisites',
          status: 'draft',
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
                  name: 'data-submit',
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
              target: States.DRAFT,
              cond: (application) =>
                someAreInsured(application?.application?.externalData) &&
                someCanApplyForPlasticOrPdf(
                  application?.application?.externalData,
                ),
            },
            {
              target: States.DECLINED,
              cond: (application) =>
                !someAreInsured(application?.application?.externalData),
            },
            {
              target: States.NOAPPLICANTS,
              cond: (application) =>
                someAreInsured(application?.application?.externalData) &&
                !someCanApplyForPlasticOrPdf(
                  application?.application?.externalData,
                ),
            },
          ],
        },
      },

      [States.DRAFT]: {
        meta: {
          name: 'application',
          status: 'inprogress',
          onExit: EhicApplyForPhysicalAndTemporary,
          lifecycle: DefaultStateLifeCycle,
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
                  name: 'plastic-submit',
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
            target: States.COMPLETED,
          },
        },
      },

      [States.COMPLETED]: {
        meta: {
          name: 'Completed',
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
                  name: 'completed-submit',
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

      [States.NOAPPLICANTS]: {
        meta: {
          name: 'NoApplicants',
          status: 'completed',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/NoApplicants').then((val) => val.NoApplicants),
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
