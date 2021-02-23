import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
} from '@island.is/application/core'
import { extractParentFromApplication } from './utils'
import { assign } from 'xstate'
import { error } from './messages/index'
import * as z from 'zod'

type Events =
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.SUBMIT }

enum States {
  DRAFT = 'draft',
  IN_REVIEW = 'inReview',
  SUBMIT = 'submit'
}

enum Roles {
  ParentA = 'parentA',
  ParentB = 'parentB',
}

export const dataSchema = z.object({
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
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Umsókn um breytt lögheimili barns',
          progress: 0.33,
          roles: [
            {
              id: Roles.ParentA,
              formLoader: () =>
                import('../forms/ChildrenResidenceChangeForm').then((module) =>
                  Promise.resolve(module.ChildrenResidenceChangeForm),
                ),
              actions: [
                { event: DefaultEvents.ASSIGN, name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          SUBMIT: {
            target: States.IN_REVIEW,
          },
        },
      },
      [States.IN_REVIEW]: {
        entry: 'assignToOtherParent',
        meta: {
          name: 'Umsókn um breytt lögheimili barns',
          progress: 0.66,
          roles: [
            {
              id: Roles.ParentB,
              formLoader: () =>
                import('../forms/ParentBForm').then((module) =>
                  Promise.resolve(module.ParentBForm),
                ),
              actions: [
                { event: DefaultEvents.SUBMIT, name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          SUBMIT: {
            target: DefaultEvents.SUBMIT,
          },
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      assignToOtherParent: assign((context) => {
        const otherParent = extractParentFromApplication(context.application)

          return {
            ...context,
            application: {
              ...context.application,
              assignees: [otherParent.ssn],
            },
          }
      }),
    },
  },

  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    console.log({id})
    if (id === application.applicant) {
      return Roles.ParentA
    }
    if (application.assignees.includes(id)) {
      return Roles.ParentB
    }
    return undefined
  },
}

export default ChildrenResidenceChangeTemplate
