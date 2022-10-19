import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
  getValueViaPath,
} from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationConfigurations,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
} from '@island.is/application/types'
import * as z from 'zod'
import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { Features } from '@island.is/feature-flags'
import { ApiActions } from '../shared'
import { m } from './messages'
import { assign } from 'xstate'

const States = {
  prerequisites: 'prerequisites',
  draft: 'draft',
  inReview: 'inReview',
  approved: 'approved',
  rejected: 'rejected',
  waitingToAssign: 'waitingToAssign',
}

type ReferenceTemplateEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.EDIT }

enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}

const careerHistoryCompaniesValidation = (data: any) => {
  // Applicant selected other but didnt supply the reason so we dont allow it
  if (
    data.careerHistoryCompanies?.includes('other') &&
    !data.careerHistoryOther
  ) {
    return false
  }
  return true
}
const ExampleSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  person: z.object({
    name: z.string().nonempty().max(256),
    age: z.string().refine((x) => {
      const asNumber = parseInt(x)
      if (isNaN(asNumber)) {
        return false
      }
      return asNumber > 15
    }),
    nationalId: z
      .string()
      /**
       * We are depending on this template for the e2e tests on the application-system-api.
       * Because we are not allowing committing valid kennitala, I reversed the condition
       * to check for invalid kenitala so it passes the test.
       */
      .refine((n) => n && !kennitala.isValid(n), {
        params: m.dataSchemeNationalId,
      }),
    phoneNumber: z.string().refine(
      (p) => {
        const phoneNumber = parsePhoneNumberFromString(p, 'IS')
        return phoneNumber && phoneNumber.isValid()
      },
      { params: m.dataSchemePhoneNumber },
    ),
    email: z.string().email(),
  }),
  careerHistory: z.enum(['yes', 'no']).optional(),
  careerHistoryDetails: z
    .object({
      careerHistoryCompanies: z
        .array(
          // TODO checkbox answers are [undefined, 'aranja', undefined] and we need to do something about it...
          z.union([
            z.enum(['government', 'aranja', 'advania', 'other']),
            z.undefined(),
          ]),
        )
        .nonempty(),
      careerHistoryOther: z.string(),
    })
    .partial()
    .refine((data) => careerHistoryCompaniesValidation(data), {
      params: m.careerHistoryOtherError,
      path: ['careerHistoryOther'],
    }),
  dreamJob: z.string().optional(),
})

const determineMessageFromApplicationAnswers = (application: Application) => {
  const careerHistory = getValueViaPath(
    application.answers,
    'careerHistory',
    undefined,
  ) as string | undefined
  if (careerHistory === 'no') {
    return m.nameApplicationNeverWorkedBefore
  }
  return m.name
}

const ReferenceApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<ReferenceTemplateEvent>,
  ReferenceTemplateEvent
> = {
  type: ApplicationTypes.EXAMPLE,
  name: determineMessageFromApplicationAnswers,
  institution: m.institutionName,
  translationNamespaces: [ApplicationConfigurations.ExampleForm.translation],
  dataSchema: ExampleSchema,
  featureFlag: Features.exampleApplication,
  allowMultipleApplicationsInDraft: true,
  stateMachineConfig: {
    initial: States.prerequisites,
    states: {
      [States.prerequisites]: {
        meta: {
          name: 'Skilyrði',
          progress: 0,
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            // Applications that stay in this state for 24 hours will be pruned automatically
            whenToPrune: 24 * 3600 * 1000,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Prerequisites').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          SUBMIT: {
            target: States.draft,
          },
        },
      },
      [States.draft]: {
        meta: {
          name: 'Umsókn um ökunám',
          actionCard: {
            description: m.draftDescription,
          },
          progress: 0.25,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ExampleForm').then((module) =>
                  Promise.resolve(module.ExampleForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          SUBMIT: [
            {
              target: States.waitingToAssign,
            },
          ],
        },
      },
      [States.waitingToAssign]: {
        meta: {
          name: 'Waiting to assign',
          progress: 0.75,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: ApiActions.createApplication,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/WaitingToAssign').then((val) =>
                  Promise.resolve(val.PendingReview),
                ),
              read: 'all',
            },
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/WaitingToAssign').then((val) =>
                  Promise.resolve(val.PendingReview),
                ),
              read: 'all',
            },
          ],
        },
        on: {
          SUBMIT: { target: States.inReview },
          ASSIGN: { target: States.inReview },
          EDIT: { target: States.draft },
        },
      },
      [States.inReview]: {
        meta: {
          name: 'In Review',
          progress: 0.75,
          lifecycle: DefaultStateLifeCycle,
          onExit: {
            apiModuleAction: ApiActions.completeApplication,
          },
          roles: [
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/ReviewApplication').then((val) =>
                  Promise.resolve(val.ReviewApplication),
                ),
              actions: [
                { event: 'APPROVE', name: 'Samþykkja', type: 'primary' },
                { event: 'REJECT', name: 'Hafna', type: 'reject' },
              ],
              write: { answers: ['careerHistoryCompanies'] },
              read: 'all',
              shouldBeListedForRole: false,
            },
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/PendingReview').then((val) =>
                  Promise.resolve(val.PendingReview),
                ),
              read: 'all',
            },
          ],
        },
        on: {
          APPROVE: { target: States.approved },
          REJECT: { target: States.rejected },
        },
      },
      [States.approved]: {
        meta: {
          name: 'Approved',
          progress: 1,
          lifecycle: EphemeralStateLifeCycle,
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
      [States.rejected]: {
        meta: {
          name: 'Rejected',
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Rejected').then((val) =>
                  Promise.resolve(val.Rejected),
                ),
            },
          ],
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      clearAssignees: assign((context) => ({
        ...context,
        application: {
          ...context.application,
          assignees: [],
        },
      })),
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (application.assignees.includes(nationalId)) {
      return Roles.ASSIGNEE
    }
    if (application.applicant === nationalId) {
      if (application.state === 'inReview') {
        return Roles.ASSIGNEE
      }

      return Roles.APPLICANT
    }
  },
}

export default ReferenceApplicationTemplate
