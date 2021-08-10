import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  DefaultEvents,
  DefaultStateLifeCycle,
  ApplicationConfigurations,
} from '@island.is/application/core'
import * as z from 'zod'

import { ApiActions } from '../shared'
import { m } from './messages'

enum States {
  DRAFT = 'draft',
  DONE = 'done',
  PAYMENT = 'payment',
  PAID = 'paid,',
}

type ReferenceTemplateEvent = { type: DefaultEvents.PAYMENT }

enum Roles {
  APPLICANT = 'applicant',
}

const Schema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  subject: z.string().nonempty().max(256),
  isPaid: z.boolean().nullable(),
})

const PayableDummyTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<ReferenceTemplateEvent>,
  ReferenceTemplateEvent
> = {
  type: ApplicationTypes.PAYABLE_DUMMY_TEMPLATE,
  name: m.name,
  institution: m.institutionName,
  translationNamespaces: [ApplicationConfigurations.ExampleForm.translation],
  readyForProduction: true,
  dataSchema: Schema,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Umsókn um greiðslu',
          actionCard: {
            title: m.draftTitle,
            description: m.draftDescription,
          },
          progress: 0.33,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: ApiActions.createCharge,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Draft').then((module) =>
                  Promise.resolve(module.Draft),
                ),
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: 'Áfram',
                  type: 'primary',
                },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.PAYMENT]: {
            target: States.PAYMENT,
          },
        },
      },
      [States.PAYMENT]: {
        meta: {
          name: 'Payment state',
          progress: 0.7,
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
                { event: DefaultEvents.SUBMIT, name: 'Panta', type: 'primary' },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          '*': { target: States.DONE },
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
  mapUserToRole(): ApplicationRole | undefined {
    return Roles.APPLICANT
  },
}

export default PayableDummyTemplate
