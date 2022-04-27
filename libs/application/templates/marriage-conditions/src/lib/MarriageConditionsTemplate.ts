import {
  ApplicationTemplate,
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTypes,
  ApplicationRole,
  DefaultStateLifeCycle,
  Application,
  DefaultEvents,
} from '@island.is/application/core'
import { Events, States, Roles } from './constants'
import { dataSchema } from './dataSchema'
import { m } from '../lib/messages'
import { ApiActions } from './constants'

const MarriageConditionsTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.MARRIAGE_CONDITIONS,
  name: m.applicationTitle,
  dataSchema: dataSchema,
  readyForProduction: true,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Draft',
          actionCard: {
            title: m.applicationTitle,
          },
          progress: 0.33,
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            whenToPrune: 24 * 3600 * 1000,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/application').then((val) =>
                  Promise.resolve(val.getApplication()),
                ),
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: 'Áfram í greiðslu',
                  type: 'primary',
                },
              ],
              write: 'all',
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
          progress: 0.9,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: ApiActions.createCharge,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/payment').then((val) =>
                  Promise.resolve(val.getPayment()),
                ),
              actions: [
                { event: DefaultEvents.SUBMIT, name: 'Panta', type: 'primary' },
                {
                  event: DefaultEvents.ABORT,
                  name: 'Hætta við',
                  type: 'reject',
                },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.APPLICANT_DONE },
        },
      },
      [States.APPLICANT_DONE]: {
        meta: {
          name: 'Done',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () => import('../forms/done').then((val) => val.done),
              read: 'all',
            },
            {
              id: Roles.ASSIGNED_SPOUSE,
              formLoader: () =>
                import('../forms/spouseConfirmation').then(
                  (val) => val.spouseConfirmation,
                ),
              read: 'all',
              write: 'all',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Senda inn umsókn',
                  type: 'primary',
                },
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.SPOUSE_CONFIRMED },
        },
      },
      [States.SPOUSE_CONFIRMED]: {
        meta: {
          name: 'spouse_confirmed',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.ASSIGNED_SPOUSE,
              formLoader: () => import('../forms/done').then((val) => val.done),
              read: 'all',
              write: 'all',
            },
            {
              id: Roles.WITNESS_ONE,
              formLoader: () =>
                import('../forms/witnessOneConfirmation').then(
                  (val) => val.witnessOneConfirmation,
                ),
              read: 'all',
              write: 'all',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Senda inn umsókn',
                  type: 'primary',
                },
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.WITNESS_ONE_CONFIRMED },
        },
      },
      [States.WITNESS_ONE_CONFIRMED]: {
        meta: {
          name: 'witness_one_confirmed',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.WITNESS_ONE,
              formLoader: () => import('../forms/done').then((val) => val.done),
              read: 'all',
              write: 'all',
            },
            {
              id: Roles.WITNESS_TWO,
              formLoader: () =>
                import('../forms/witnessTwoConfirmation').then(
                  (val) => val.witnessTwoConfirmation,
                ),
              read: 'all',
              write: 'all',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Senda inn umsókn',
                  type: 'primary',
                },
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.WITNESS_TWO_CONFIRMED },
        },
      },
      [States.WITNESS_TWO_CONFIRMED]: {
        meta: {
          name: 'witness_two_confirmed',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,

          roles: [
            {
              id: Roles.WITNESS_TWO,
              formLoader: () => import('../forms/done').then((val) => val.done),
              read: 'all',
              write: 'all',
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
    if (application.state === States.APPLICANT_DONE) {
      return Roles.ASSIGNED_SPOUSE
    } else if (application.state === States.SPOUSE_CONFIRMED) {
      return Roles.WITNESS_ONE
    } else if (application.state === States.WITNESS_ONE_CONFIRMED) {
      return Roles.WITNESS_TWO
    } else if (application.state === States.WITNESS_TWO_CONFIRMED) {
      return Roles.WITNESS_TWO
    } else if (application.applicant === nationalId) {
      return Roles.APPLICANT
    }
  },
}

export default MarriageConditionsTemplate
