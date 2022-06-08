import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultStateLifeCycle,
  DefaultEvents,
} from '@island.is/application/core'
import { dataSchema } from './dataSchema'
import { Roles, States, Events, ApiActions } from './constants'
import { Features } from '@island.is/feature-flags'
import { m } from '../lib/messages'

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
          lifecycle: DefaultStateLifeCycle,
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
          lifecycle: DefaultStateLifeCycle,
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
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Done').then((val) =>
                  Promise.resolve(val.Done),
                ),
            },
          ],
        },
        type: 'final' as const,
      },
    },
  },
  mapUserToRole(_id: string, _application: Application): ApplicationRole {
    return Roles.APPLICANT
  },
}

export default PassportTemplate
