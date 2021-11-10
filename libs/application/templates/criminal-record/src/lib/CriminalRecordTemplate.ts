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
import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

import { ApiActions } from '../shared'
import { m } from './messages'

enum States {
  DRAFT = 'draft',
  DONE = 'done',
  PAYMENT = 'payment',
}

type CriminalRecordTemplateEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.PAYMENT }

enum Roles {
  APPLICANT = 'applicant',
}

const CriminalRecordSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  // person: z.object({
  //   name: z.string().nonempty().max(256),
  //   age: z.string().refine((x) => {
  //     const asNumber = parseInt(x)
  //     if (isNaN(asNumber)) {
  //       return false
  //     }
  //     return asNumber > 15
  //   }),
  //   nationalId: z.string().refine((n) => n && kennitala.isValid(n), {
  //     params: m.dataSchemeNationalId,
  //   }),
  //   phoneNumber: z.string().refine(
  //     (p) => {
  //       const phoneNumber = parsePhoneNumberFromString(p, 'IS')
  //       return phoneNumber && phoneNumber.isValid()
  //     },
  //     { params: m.dataSchemePhoneNumber },
  //   ),
  //   email: z.string().email(),
  // }),
  // careerHistory: z.enum(['yes', 'no']).optional(),
  // careerHistoryCompanies: z
  //   .array(
  //     // TODO checkbox answers are [undefined, 'aranja', undefined] and we need to do something about it...
  //     z.union([z.enum(['government', 'aranja', 'advania']), z.undefined()]),
  //   )
  //   .nonempty(),
  // dreamJob: z.string().optional(),
})

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<CriminalRecordTemplateEvent>,
  CriminalRecordTemplateEvent
> = {
  type: ApplicationTypes.CRIMINAL_RECORD,
  name: m.name,
  institution: m.institutionName,
  translationNamespaces: [ApplicationConfigurations.CriminalRecord.translation],
  dataSchema: CriminalRecordSchema,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Umsókn um sakavottorð',
          onExit: {
            apiModuleAction: ApiActions.getCriminalRecord,
            throwOnError: true,
          },
          actionCard: {
            description: m.draftDescription,
          },
          progress: 0.25,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/CriminalRecordForm').then((module) =>
                  Promise.resolve(module.CriminalRecordForm),
                ),
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: 'Staðfesta',
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
          [DefaultEvents.SUBMIT]: { target: States.DONE },
        },
      },
      [States.PAYMENT]: {
        meta: {
          name: 'Payment state',
          actionCard: {
            description: m.actionCardPayment,
          },
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
                import('../forms/Payment').then((val) => val.Payment),
              actions: [
                { event: DefaultEvents.SUBMIT, name: 'Áfram', type: 'primary' },
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
          name: 'Approved',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Approved').then((val) =>
                  Promise.resolve(val.Approved),
                ),
              read: 'all',
            },
          ],
        },
        type: 'final' as const,
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

export default template
