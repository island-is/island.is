import { ApplicationTemplate } from '../ApplicationTemplate'
import { ApplicationTypes } from '../../types/ApplicationTypes'
import {
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
} from '../../types/StateMachine'
import * as z from 'zod'
import { nationalIdRegex } from '../examples/constants'

type Events =
  | { type: 'APPROVE' }
  | { type: 'REJECT' }
  | { type: 'SUBMIT' }
  | { type: 'ABORT' }

const dataSchema = z.object({
  passportPicture: z.any().optional(),
  school: z.string().nonempty(),
  teacher: z.string().nonempty(),
  type: z.enum(['B', 'AM', 'A', 'A1', 'A2', 'T']),
  student: z.object({
    name: z.string().nonempty(),
    parentEmail: z
      .string()
      .email()
      .nonempty(),
    nationalId: z.string().refine((x) => (x ? nationalIdRegex.test(x) : false)),
    phoneNumber: z.string().min(7),
    address: z.string().nonempty(),
    zipCode: z.string().nonempty(),
  }),
  approveExternalData: z.boolean().refine((v) => v === true),
  useGlasses: z.enum(['yes', 'no']),
  damagedEyeSight: z.enum(['yes', 'no']),
  limitedFieldOfView: z.enum(['yes', 'no']),
  approvedByReviewer: z.enum(['APPROVE', 'REJECT']),
})

export const DrivingLessons: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.DRIVING_LESSONS,
  dataProviders: [],
  dataSchema,
  stateMachineConfig: {
    initial: 'draft',
    states: {
      draft: {
        meta: {
          name: 'Umsókn um ökunám',
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('./forms/DrivingLessonsApplication').then((val) =>
                  Promise.resolve(val.DrivingLessonsApplication),
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
      inReview: {
        meta: {
          name: 'In Review',
          roles: [
            {
              id: 'reviewer',
              formLoader: () =>
                import('./forms/ReviewApplication').then((val) =>
                  Promise.resolve(val.ReviewApplication),
                ),
              actions: [
                { event: 'APPROVE', name: 'Samþykkja', type: 'primary' },
                { event: 'REJECT', name: 'Hafna', type: 'reject' },
              ],
              read: 'all',
            },
            {
              id: 'applicant',
              formLoader: () =>
                import('./forms/PendingReview').then((val) =>
                  Promise.resolve(val.PendingReview),
                ),
              read: 'all',
            },
          ],
        },
        on: {
          APPROVE: { target: 'approved' },
          REJECT: { target: 'rejected' },
        },
      },
      approved: {
        meta: {
          name: 'Approved',
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('./forms/Approved').then((val) =>
                  Promise.resolve(val.Approved),
                ),
            },
          ],
        },
        type: 'final' as const,
      },
      rejected: {
        meta: {
          name: 'Rejected',
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('./forms/Rejected').then((val) =>
                  Promise.resolve(val.Rejected),
                ),
            },
          ],
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
