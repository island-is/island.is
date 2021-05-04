import * as kennitala from 'kennitala'
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
import * as z from 'zod'
import { ApiActions } from '../shared'

type Events =
  | { type: DefaultEvents.PAYMENT }
  | { type: DefaultEvents.SUBMIT }

enum States {
  DRAFT = 'draft',
  DONE = 'done',
}

const dataSchema = z.object({
  type: z.array(z.enum(['car', 'trailer', 'motorcycle'])).nonempty(),
  subType: z.array(z.string()).nonempty(),
  approveExternalData: z.boolean().refine((v) => v),
  juristiction: z.string(),
  healthDeclaration: z.object({
    usesContactGlasses: z.enum(['yes', 'no']),
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
  willBringAlongData: z.array(z.enum(['certificate', 'picture'])).nonempty(),
})

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.DRIVING_LICENSE,
  name: 'Umsókn um ökuskilríki',
  dataSchema,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Umsókn um ökuskilríki',
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
          onEntry: {
            apiModuleAction: ApiActions.submitApplication,
          },
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
  mapUserToRole(id: string, application: Application): ApplicationRole {
    return 'applicant'
  },
}

export default template
