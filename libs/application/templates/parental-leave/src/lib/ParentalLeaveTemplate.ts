import {
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTypes,
  ApplicationTemplate,
} from '@island.is/application/core'
import * as z from 'zod'
import { isValid, parseISO } from 'date-fns'

type Events =
  | { type: 'APPROVE' }
  | { type: 'REJECT' }
  | { type: 'SUBMIT' }
  | { type: 'ABORT' }

const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: z.object({
    email: z.string().email(),
    phoneNumber: z.string(),
  }),
  payments: z.object({
    bank: z.string().nonempty(),
    personalAllowanceUsage: z.enum(['100', '75', '50', '25']),
    pensionFund: z.string().optional(),
    privatePensionFund: z.enum(['frjalsi']).optional(),
    privatePensionFundPercentage: z.enum(['2', '4']).optional(),
  }),
  shareInformationWithOtherParent: z.enum(['yes', 'no']),
  usePrivatePensionFund: z.enum(['yes', 'no']),
  periods: z.array(
    z.object({
      startDate: z.string().refine((d) => isValid(parseISO(d))),
      endDate: z.string().refine((d) => isValid(parseISO(d))),
      ratio: z
        .string()
        .refine(
          (val) =>
            !isNaN(Number(val)) && parseInt(val) > 0 && parseInt(val) <= 100,
        ),
    }),
  ),
  employer: z.object({
    name: z.string().nonempty(),
    nationalRegistryId: z.string().nonempty(),
  }),
  requestExtraTime: z.enum(['yes', 'no']),
  giveExtraTime: z.enum(['yes', 'no']),
  singlePeriod: z.enum(['yes', 'no']),
  firstPeriodStart: z.enum(['dateOfBirth', 'specificDate']),
  confirmLeaveDuration: z.enum(['duration', 'specificDate']),
  secondaryParentName: z.string().optional(),
  secondaryParentId: z.string().optional(),
})

const ParentalLeaveTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.PARENTAL_LEAVE,
  name: 'Umsókn um fæðingarorlof',
  dataProviders: [],
  dataSchema,
  stateMachineConfig: {
    initial: 'draft',
    states: {
      draft: {
        meta: {
          name: 'draft',
          progress: 0.25,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('./ParentalLeaveForm').then((val) =>
                  Promise.resolve(val.ParentalLeaveForm),
                ),
              actions: [{ event: 'SUBMIT', name: 'Submit', type: 'primary' }],
              write: 'all',
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
          progress: 0.5,
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
          progress: 0.75,
        },
        on: {
          APPROVE: { target: 'approved' },
          REJECT: { target: 'draft' },
        },
      },
      approved: {
        meta: {
          name: 'Approved',
          progress: 1,
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

export default ParentalLeaveTemplate
