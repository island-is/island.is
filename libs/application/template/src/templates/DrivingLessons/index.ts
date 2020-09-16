import { ApplicationTemplate } from '../ApplicationTemplate'
import { ApplicationTypes } from '../../types/ApplicationTypes'
import {
  ApplicationContext,
  ApplicationStateSchema,
} from '../../types/StateMachine'
import * as z from 'zod'
import { DrivingLessonsApplication } from './forms/DrivingLessonsApplication'
import { nationalIdRegex } from '../examples/constants'
import { ParentalLeaveForm } from '../ParentalLeave/ParentalLeaveForm'

type Events =
  | { type: 'APPROVE' }
  | { type: 'REJECT' }
  | { type: 'SUBMIT' }
  | { type: 'ABORT' }

const dataSchema = z.object({
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
  useGlasses: z.enum(['yes', 'no']),
  damagedEyeSight: z.enum(['yes', 'no']),
  limitedFieldOfView: z.enum(['yes', 'no']),
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
              form: DrivingLessonsApplication,
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
          roles: [{ id: 'reviewer', form: ParentalLeaveForm }],
        },
        on: {
          APPROVE: { target: 'payment' },
          REJECT: { target: 'draft' },
        },
      },
      payment: {
        meta: {
          name: 'Greiðsla',
          roles: [{ id: 'applicant', write: { externalData: ['payment'] } }],
        },
        on: { SUBMIT: { target: 'approved' } },
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
}
