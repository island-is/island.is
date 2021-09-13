import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  DefaultStateLifeCycle,
  DefaultEvents,
} from '@island.is/application/core'
import * as z from 'zod'
import { ApiActions } from '../shared'
import { m } from './messages'

type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.PAYMENT }
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }

enum States {
  DRAFT = 'draft',
  DONE = 'done',
  PAYMENT = 'payment',
  PAYMENT_PENDING = 'paymentPending',
}

const dataSchema = z.object({
  type: z.array(z.enum(['car', 'trailer', 'motorcycle'])).nonempty(),
  subType: z.array(z.string()).nonempty(),
  approveExternalData: z.boolean().refine((v) => v),
  juristiction: z.string(),
  healthDeclaration: z.object({
    usesContactGlasses: z.enum(['yes', 'no']),
    hasReducedPeripheralVision: z.enum(['yes', 'no']),
    hasEpilepsy: z.enum(['yes', 'no']),
    hasHeartDisease: z.enum(['yes', 'no']),
    hasMentalIllness: z.enum(['yes', 'no']),
    usesMedicalDrugs: z.enum(['yes', 'no']),
    isAlcoholic: z.enum(['yes', 'no']),
    hasDiabetes: z.enum(['yes', 'no']),
    isDisabled: z.enum(['yes', 'no']),
    hasOtherDiseases: z.enum(['yes', 'no']),
  }),
  teacher: z.string().nonempty(),
  willBringQualityPhoto: z.union([
    z.array(z.enum(['yes', 'no'])),
    z.enum(['yes', 'no']),
  ]),
  certificate: z.array(z.enum(['yes', 'no'])).nonempty(),
  picture: z.array(z.enum(['yes', 'no'])).nonempty(),
})

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.DRIVING_LICENSE,
  name: 'Umsókn um fullnaðarskírteini',
  dataSchema,
  readyForProduction: true,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Umsókn um fullnaðarskírteini',
          progress: 0.33,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/application').then((val) =>
                  Promise.resolve(val.application),
                ),
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: m.continue,
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
          onExit: {
            apiModuleAction: ApiActions.submitApplication,
          },
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/payment').then((val) =>
                  Promise.resolve(val.payment),
                ),
              actions: [
                { event: DefaultEvents.SUBMIT, name: 'Panta', type: 'primary' },
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
              id: 'applicant',
              formLoader: () =>
                import('../forms/done').then((val) =>
                  Promise.resolve(val.done),
                ),
              read: 'all',
            },
          ],
        },
        type: 'final' as const,
      },
    },
  },
  mapUserToRole(): ApplicationRole {
    return 'applicant'
  },
}

export default template
