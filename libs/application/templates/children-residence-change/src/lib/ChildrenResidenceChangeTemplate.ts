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
import { error } from './messages/index'

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
    message: error.validation.approveChildrenResidenceChange.defaultMessage,
  }),
  selectChild: z
    .array(z.string())
    .min(1, { message: error.validation.selectChild.defaultMessage }),
  email: z.string().email(error.validation.invalidEmail.defaultMessage),
  phoneNumber: z
    .string()
    .min(7, { message: error.validation.invalidPhoneNumber.defaultMessage }),
  confirmResidenceChangeInfo: z
    .array(z.string())
    .length(1, error.validation.approveChildrenResidenceChange.defaultMessage),
  // selectDuration: z
  //   .enum(['temporary', 'permanent'])
  //   .optional()
  //   .refine((v) => v, {
  //     message: 'Velja þarf valmöguleika',
  //   }),
  approveTerms: z
    .array(z.string())
    .length(3, error.validation.approveTerms.defaultMessage),
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
