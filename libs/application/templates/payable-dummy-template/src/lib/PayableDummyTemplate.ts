import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  DefaultStateLifeCycle,
  ApplicationConfigurations,
} from '@island.is/application/core'
import * as z from 'zod'

import { ApiActions } from '../shared'
import { m } from './messages'

const States = {
  draft: 'draft',
  paymentPending: 'paymentPending',
  paid: 'paid',
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
  dataSchema: Schema,
  stateMachineConfig: {
    initial: States.draft,
    states: {
      [States.draft]: {
        meta: {
          name: 'Umsókn um greiðslu',
          actionCard: {
            title: m.draftTitle,
            description: m.draftDescription,
          },
          progress: 0.25,
          lifecycle: DefaultStateLifeCycle,
          onExit: {
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
            target: States.paymentPending,
          },
        },
      },
      [States.paymentPending]: {
        meta: {
          name: 'Greiða',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/PaymentPending').then((val) =>
                  Promise.resolve(val.PaymentPending),
                ),
              read: 'all',
            },
          ],
        },
      },
    },
  },
  mapUserToRole(): ApplicationRole | undefined {
    return Roles.APPLICANT
  },
}

export default PayableDummyTemplate
