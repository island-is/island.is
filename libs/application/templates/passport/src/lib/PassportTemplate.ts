import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
} from '@island.is/application/core'
import { dataSchema } from './dataSchema'
import { Roles, States, Events, ApiActions } from './constants'
import { Features } from '@island.is/feature-flags'
import { m } from '../lib/messages'

const oneDay = 24 * 3600 * 1000
const thirtyDays = 24 * 3600 * 1000 * 30

const pruneAfter = (time: number) => {
  return {
    shouldBeListed: true,
    shouldBePruned: true,
    whenToPrune: time,
  }
}

const PassportTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.PASSPORT,
  name: m.formName.defaultMessage,
  featureFlag: Features.passportApplication,
  dataSchema,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      draft: {
        meta: {
          name: m.formName.defaultMessage,
          progress: 0.33,
          lifecycle: pruneAfter(oneDay),
          onExit: {
            apiModuleAction: ApiActions.checkForDiscount,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Draft').then((val) =>
                  Promise.resolve(val.Draft),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.confirm.defaultMessage,
                  type: 'primary',
                },
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
          [DefaultEvents.SUBMIT]: { target: States.DRAFT },
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
            apiModuleAction: ApiActions.submitPassportApplication,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Done').then((val) =>
                  Promise.resolve(val.Done),
                ),
              read: {
                externalData: ['submitPassportApplication'],
              },
            },
          ],
        },
        type: 'final' as const,
      },
    },
  },
  mapUserToRole(nationalId: string, application: Application) {
    if (application.applicant === nationalId) {
      return Roles.APPLICANT
    }
  },
}

export default PassportTemplate
