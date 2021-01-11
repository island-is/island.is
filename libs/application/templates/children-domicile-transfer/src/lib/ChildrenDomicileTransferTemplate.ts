import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
} from '@island.is/application/core'
import * as z from 'zod'

type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ABORT }

enum Roles {
  APPLICANT = 'applicant',
}
const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
})

const ChildrenDomicileTransferTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.CHILDREN_DOMICILE_TRANSFER,
  name: 'Children domicile transfer application',
  dataSchema: dataSchema,
  stateMachineConfig: {
    initial: 'draft',
    states: {
      draft: {
        meta: {
          name: 'Umsókn um breytt lögheimili barns',
          progress: 0.33,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ChildrenDomicileTransferForm').then((module) =>
                  Promise.resolve(module.ChildrenDomicileTransferForm),
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

  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    return Roles.APPLICANT
  },
}

export default ChildrenDomicileTransferTemplate
