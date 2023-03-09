import {
  ApplicationConfigurations,
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  defineTemplateApi,
  IdentityApi,
} from '@island.is/application/types'
import {
  EphemeralStateLifeCycle,
  getValueViaPath,
  pruneAfterDays,
} from '@island.is/application/core'
import { Events, States, Roles } from './constants'
import { application as applicationMessage } from './messages'
import { Features } from '@island.is/feature-flags'
import { ApiActions } from '../shared'
import { LicensePlateRenewalSchema } from './dataSchema'
import {
  SamgongustofaPaymentCatalogApi,
  MyPlateOwnershipsApi,
} from '../dataProviders'
import { AuthDelegationType } from '@island.is/shared/types'

const determineMessageFromApplicationAnswers = (application: Application) => {
  const regno = getValueViaPath(
    application.answers,
    'pickPlate.regno',
    undefined,
  ) as string | undefined
  return {
    name: applicationMessage.name,
    value: regno ? `- ${regno}` : '',
  }
}

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.LICENSE_PLATE_RENEWAL,
  name: determineMessageFromApplicationAnswers,
  institution: applicationMessage.institutionName,
  translationNamespaces: [
    ApplicationConfigurations.LicensePlateRenewal.translation,
  ],
  dataSchema: LicensePlateRenewalSchema,
  allowedDelegations: [
    {
      type: AuthDelegationType.ProcurationHolder,
      featureFlag: Features.transportAuthorityLicensePlateRenewalDelegations,
    },
  ],
  featureFlag: Features.transportAuthorityLicensePlateRenewal,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Endurnýja einkanúmer',
          status: 'draft',
          actionCard: {
            tag: {
              label: applicationMessage.actionCardDraft,
              variant: 'blue',
            },
          },
          progress: 0.25,
          lifecycle: EphemeralStateLifeCycle,
          onExit: defineTemplateApi({
            action: ApiActions.validateApplication,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import(
                  '../forms/LicensePlateRenewalForm/index'
                ).then((module) =>
                  Promise.resolve(module.LicensePlateRenewalForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
              api: [
                SamgongustofaPaymentCatalogApi,
                MyPlateOwnershipsApi,
                IdentityApi,
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.PAYMENT },
        },
      },
      [States.PAYMENT]: {
        meta: {
          name: 'Greiðsla',
          status: 'inprogress',
          actionCard: {
            tag: {
              label: applicationMessage.actionCardPayment,
              variant: 'red',
            },
          },
          progress: 0.8,
          lifecycle: pruneAfterDays(1 / 24),
          onEntry: defineTemplateApi({
            action: ApiActions.createCharge,
          }),
          onExit: defineTemplateApi({
            action: ApiActions.submitApplication,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Payment').then((val) => val.Payment),
              actions: [
                { event: DefaultEvents.SUBMIT, name: 'Áfram', type: 'primary' },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.COMPLETED },
          [DefaultEvents.ABORT]: { target: States.DRAFT },
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: 'Completed',
          status: 'completed',
          progress: 1,
          lifecycle: pruneAfterDays(3 * 30),
          actionCard: {
            tag: {
              label: applicationMessage.actionCardDone,
              variant: 'blueberry',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Conclusion').then((val) =>
                  Promise.resolve(val.Conclusion),
                ),
              read: 'all',
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

export default template
