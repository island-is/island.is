import {
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTypes,
  ApplicationTemplate,
} from '@island.is/application/core'
import * as z from 'zod'
import isValid from 'date-fns/isValid'
import parseISO from 'date-fns/parseISO'
import { assign } from 'xstate'
import assignParentTemplate from '../emailTemplates/assignToParent'
import assignEmployerTemplate from '../emailTemplates/assignToEmployer'

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
    privatePensionFund: z.enum(['frjalsi', '']).optional(),
    privatePensionFundPercentage: z.enum(['2', '4', '']).optional(),
  }),
  shareInformationWithOtherParent: z.enum(['yes', 'no']),
  usePrivatePensionFund: z.enum(['yes', 'no']),
  periods: z
    .array(
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
    )
    .nonempty(),
  employer: z.object({
    name: z.string().nonempty(),
    nationalRegistryId: z.string().nonempty(),
    contact: z.string().nonempty(),
    contactId: z.string().nonempty(),
  }),
  requestRights: z.enum(['yes', 'no']),
  giveRights: z.enum(['yes', 'no']),
  singlePeriod: z.enum(['yes', 'no']),
  firstPeriodStart: z.enum(['dateOfBirth', 'specificDate']),
  confirmLeaveDuration: z.enum(['duration', 'specificDate']),
  otherParent: z.enum(['spouse', 'no', 'manual']).optional(),
  otherParentName: z.string().optional(),
  otherParentId: z.string().optional(),
})

type SchemaFormValues = z.infer<typeof dataSchema>

function needsOtherParentApproval(context: ApplicationContext) {
  const currentApplicationAnswers = context.application
    .answers as SchemaFormValues
  return currentApplicationAnswers.requestRights === 'yes'
}

const ParentalLeaveTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.PARENTAL_LEAVE,
  name: 'Umsókn um fæðingarorlof',
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
                import('../forms/ParentalLeaveForm').then((val) =>
                  Promise.resolve(val.ParentalLeaveForm),
                ),
              actions: [{ event: 'SUBMIT', name: 'Submit', type: 'primary' }],
              write: 'all',
            },
          ],
        },
        on: {
          SUBMIT: [
            {
              target: 'otherParentApproval',
              cond: needsOtherParentApproval,
            },
            { target: 'employerApproval' },
          ],
        },
      },
      otherParentApproval: {
        entry: 'assignToOtherParent',
        invoke: {
          src: {
            type: 'emailService',
            template: assignParentTemplate,
          },
        },
        meta: {
          name: 'Needs other parent approval',
          progress: 0.4,
          roles: [
            {
              id: 'otherParent',
              formLoader: () =>
                import('../forms/OtherParentApproval').then((val) =>
                  Promise.resolve(val.OtherParentApproval),
                ),
              actions: [
                { event: 'APPROVE', name: 'Approve', type: 'primary' },
                { event: 'REJECT', name: 'Reject', type: 'reject' },
              ],
            },
          ],
        },
        on: {
          APPROVE: { target: 'employerApproval' },
          REJECT: { target: 'draft' },
        },
      },
      employerApproval: {
        entry: 'assignToEmployer',
        invoke: {
          src: {
            type: 'emailService',
            template: assignEmployerTemplate,
          },
        },
        meta: {
          name: 'Employer Approval',
          progress: 0.5,
          roles: [
            {
              id: 'employer',
              formLoader: () =>
                import('../forms/EmployerApproval').then((val) =>
                  Promise.resolve(val.EmployerApproval),
                ),
              read: { answers: ['periods'] },
              actions: [
                { event: 'APPROVE', name: 'Approve', type: 'primary' },
                { event: 'REJECT', name: 'Reject', type: 'reject' },
              ],
            },
            {
              id: 'applicant',
              read: {
                answers: ['spread', 'periods'],
                externalData: ['pregnancyStatus', 'parentalLeaves'],
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
  stateMachineOptions: {
    actions: {
      assignToOtherParent: assign((context) => {
        const currentApplicationAnswers = context.application
          .answers as SchemaFormValues
        if (
          currentApplicationAnswers.requestRights === 'yes' &&
          currentApplicationAnswers.otherParentId !== undefined &&
          currentApplicationAnswers.otherParentId !== ''
        ) {
          return {
            ...context,
            application: {
              ...context.application,
              assignees: [currentApplicationAnswers.otherParentId],
            },
          }
        }
        return context
      }),
      assignToEmployer: assign((context) => {
        // here we might go the email route instead.
        const currentApplicationAnswers = context.application
          .answers as SchemaFormValues
        if (
          currentApplicationAnswers.employer.nationalRegistryId !== undefined &&
          currentApplicationAnswers.employer.nationalRegistryId !== ''
        ) {
          return {
            ...context,
            application: {
              ...context.application,
              assignees: [
                currentApplicationAnswers.employer.nationalRegistryId,
              ],
            },
          }
        }
        return context
      }),
    },
  },
  mapUserToRole(id, state): ApplicationRole {
    if (state === 'employerApproval') {
      return 'employer'
    } else if (state === 'otherParentApproval') {
      return 'otherParent'
    }
    return 'applicant'
  },
}

export default ParentalLeaveTemplate
