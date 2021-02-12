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
  approveExternalData: z.boolean().refine((v) => v, {
    message: 'Samþykkja þarf gagnaöflun til að halda áfram',
  }),
  selectChild: z
    .array(z.string())
    .min(1, { message: 'Velja þarf að lágmarki eitt barn' }),
  email: z
    .string()
    .email('Netfang þarf að vera löglegt, t.d. netfang@netfang.is'),
  phoneNumber: z
    .string()
    .min(7, { message: 'Símanúmer þarf að vera 7 tölustafir' }),
  confirmResidenceChangeInfo: z
    .array(z.string())
    .length(1, 'Samþykkja þarf breytingu'),
  selectDuration: z
    .enum(['temporary', 'permanent'])
    .optional()
    .refine((v) => v, {
      message: 'Velja þarf valmöguleika',
    }),
  approveTerms: z.array(z.string()).length(3, 'Samþykkja þarf alla skilmála'),
})

const ChildrenResidenceChangeTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.CHILDREN_RESIDENCE_CHANGE,
  name: 'Children residence change application',
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
                import('../forms/ChildrenResidenceChangeForm').then((module) =>
                  Promise.resolve(module.ChildrenResidenceChangeForm),
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

export default ChildrenResidenceChangeTemplate
