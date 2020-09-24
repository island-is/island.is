import { ApplicationTemplate } from '../ApplicationTemplate'
import { ApplicationTypes } from '../../types/ApplicationTypes'
import {
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
} from '../../types/StateMachine'
import * as z from 'zod'

type Events =
  | { type: 'APPROVE' }
  | { type: 'REJECT' }
  | { type: 'SUBMIT' }
  | { type: 'ABORT' }

const ParentalLeave: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.PARENTAL_LEAVE,
  dataProviders: [],
  dataSchema: z.object({
    approveExternalData: z.boolean().refine((v) => v === true),
    usage: z
      .number()
      .min(0)
      .max(6),
    spread: z.number().max(24),
    periods: z.array(
      z.object({
        start: z.date(),
        end: z.date(),
        ratio: z
          .number()
          .min(1)
          .max(100),
      }),
    ),
  }),
  stateMachineConfig: {
    initial: 'draft',
    states: {
      draft: {
        meta: {
          name: 'draft',
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('./ParentalLeaveForm').then((val) =>
                  Promise.resolve(val.ParentalLeaveForm),
                ),
              actions: [{ event: 'SUBMIT', name: 'Submit', type: 'primary' }],
              write: {
                answers: ['usage', 'spread', 'periods'],
                externalData: ['expectedDateOfBirth', 'salary'],
              },
            },
          ],
        },
        on: {
          SUBMIT: { target: 'employerApproval' },
        },
      },
      employerApproval: {
        meta: {
          name: 'Employer Approval',
          roles: [
            {
              id: 'employer',
              read: { answers: ['periods'] },
              actions: [
                { event: 'APPROVE', name: 'Approve', type: 'primary' },
                { event: 'REJECT', name: 'Reject', type: 'reject' },
              ],
            },
            {
              id: 'applicant',
              read: {
                answers: ['usage', 'spread', 'periods'],
                externalData: ['expectedDateOfBirth', 'salary'],
              },
            },
          ],
        },
        on: {
          APPROVE: { target: 'inReview' },
          ABORT: { target: 'draft' },
        },
      },
      inReview: {
        meta: {
          name: 'In Review',
        },
        on: {
          APPROVE: { target: 'approved' },
          REJECT: { target: 'draft' },
        },
      },
      approved: {
        meta: {
          name: 'Approved',
        },
        type: 'final' as const,
      },
      rejected: {
        meta: {
          name: 'Rejected',
        },
      },
    },
  },
  mapUserToRole(): ApplicationRole {
    return 'applicant'
  },
}

export default ParentalLeave
