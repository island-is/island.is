import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  ApplicationRole,
} from '@island.is/application/types'
import { dataSchema } from './dataSchema'
import { Roles, States, Events, ApiActions } from './constants'
import { m } from './messages'
import { Features } from '@island.is/feature-flags'
import { AuthDelegationType } from '../types/schema'

const oneDay = 24 * 3600 * 1000
const thirtyDays = 24 * 3600 * 1000 * 30

const pruneAfter = (time: number) => {
  return {
    shouldBeListed: true,
    shouldBePruned: true,
    whenToPrune: time,
  }
}

const OperatingLicenseTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.OPERATING_LCENSE,
  name: m.formName.defaultMessage,
  featureFlag: Features.operatingLicense,
  allowedDelegations: [{ type: AuthDelegationType.ProcurationHolder }],
  dataSchema,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: m.formName.defaultMessage,
          progress: 0.33,
          lifecycle: pruneAfter(oneDay),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/draft/index').then((val) =>
                  Promise.resolve(val.Draft),
                ),
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: m.confirm.defaultMessage,
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.PAYMENT]: { target: States.PAYMENT },
        },
      },
      [States.PAYMENT]: {
        meta: {
          name: 'Payment state',
          actionCard: {
            description: m.payment,
          },
          progress: 0.9,
          lifecycle: pruneAfter(thirtyDays),
          onEntry: {
            apiModuleAction: ApiActions.createCharge,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Payment').then((val) =>
                  Promise.resolve(val.payment),
                ),
              actions: [
                { event: DefaultEvents.SUBMIT, name: '', type: 'primary' },
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
          name: 'Done',
          progress: 1,
          lifecycle: pruneAfter(thirtyDays),
          onEntry: {
            apiModuleAction: ApiActions.submitOperatingLicenseApplication,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Done').then((val) =>
                  Promise.resolve(val.Done),
                ),
              read: {
                externalData: ['submitOperatingLicenseApplication'],
              },
            },
          ],
        },
        type: 'final' as const,
      },
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (nationalId === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default OperatingLicenseTemplate
