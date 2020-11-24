import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
} from '@island.is/application/core'
import * as z from 'zod'

type Events =
  | { type: 'APPROVE' }
  | { type: 'REJECT' }
  | { type: 'SUBMIT' }
  | { type: 'ABORT' }

const dataSchema = z.object({
  personalInfo: z.object({
    name: z.string().nonempty(),
  }),
})

const PassportTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.PASSPORT,
  name: 'Umsókn um vegabréf',
  dataSchema,
  stateMachineConfig: {
    initial: 'draft',
    states: {
      draft: {
        meta: {
          name: 'Umsókn um vegabréf',
          progress: 0.33,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/PassportApplication').then((val) =>
                  Promise.resolve(val.PassportApplication),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          SUBMIT: {
            target: 'inReview',
          },
        },
      },
    },
  },
  mapUserToRole(id: string, state: string): ApplicationRole {
    if (state === 'inReview') {
      return 'reviewer'
    }
    return 'applicant'
  },
}

export default PassportTemplate
