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
import { ApiActions } from '../shared'

import { m } from './messages'

const States = {
  prerequisites: 'prerequisites',
  review: 'review',
  approved: 'approved',
}

type Events = { type: DefaultEvents.SUBMIT }

enum Roles {
  TEACHER = 'teacher',
}

const Schema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  student: z.object({
    nationalId: z.string().refine((n) => n && kennitala.isValid(n), {
      params: m.dataSchemeNationalId,
    }),
    email: z.string().email(),
  }),
  drivingAssessmentConfirmationCheck: z
    .array(z.string())
    .refine((v) => v.includes('confirmed'), {
      params: m.dataSchemeDrivingAssmentApprovalCheck,
    }),
})

const ReferenceApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.DRIVING_ASSESSMENT_APPROVAL,
  name: m.name,
  readyForProduction: true,
  translationNamespaces: [
    ApplicationConfigurations[ApplicationTypes.DRIVING_ASSESSMENT_APPROVAL]
      .translation,
  ],
  dataSchema: Schema,
  stateMachineConfig: {
    initial: States.prerequisites,
    states: {
      [States.prerequisites]: {
        meta: {
          name: 'Skilyrði',
          progress: 0.2,
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            // Applications that stay in this state for 24 hours will be pruned automatically
            whenToPrune: 24 * 3600 * 1000,
          },
          roles: [
            {
              id: Roles.TEACHER,
              formLoader: () =>
                import('../forms/FormPrimary').then((module) =>
                  Promise.resolve(module.FormPrimary),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Samþykkja', type: 'primary' },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          SUBMIT: {
            target: States.approved,
          },
        },
      },
      [States.approved]: {
        meta: {
          name: 'Samþykkt akstursmat',
          progress: 1.0,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            // Applications that stay in this state for 24 hours will be pruned automatically
            whenToPrune: 24 * 3600 * 1000,
          },
          onEntry: {
            apiModuleAction: ApiActions.submitAssessmentConfirmation,
          },
          roles: [
            {
              id: Roles.TEACHER,
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
  mapUserToRole: () => Roles.TEACHER,
}

export default ReferenceApplicationTemplate
