import * as z from 'zod'
import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

import { NO, YES, MANUAL, SPOUSE } from '../constants'
import { errorMessages } from './messages'

const PersonalAllowance = z
  .object({
    usage: z
      .string()
      .refine((x) => parseFloat(x) >= 0 && parseFloat(x) <= 100)
      .optional(),
    useAsMuchAsPossible: z.enum([YES, NO]).optional(),
  })
  .optional()

/**
 * Both periods and employer objects had been removed from here, and the logic has
 * been moved to the answerValidators because it needs to be more advanced than
 * what zod can handle.
 */
export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  selectedChild: z.string().nonempty(),
  applicant: z.object({
    email: z.string().email(),
    phoneNumber: z.string().refine(
      (p) => {
        const phoneNumber = parsePhoneNumberFromString(p, 'IS')
        return phoneNumber && phoneNumber.isValid()
      },
      { params: errorMessages.phoneNumber },
    ),
  }),
  personalAllowance: PersonalAllowance,
  personalAllowanceFromSpouse: PersonalAllowance,
  payments: z.object({
    bank: z.string().refine(
      (b) => {
        const bankAccount = b.toString()

        return bankAccount.length === 12 // 4 (bank) + 2 (ledger) + 6 (number)
      },
      { params: errorMessages.bank },
    ),
    pensionFund: z.string(),
    privatePensionFund: z.string().optional(),
    privatePensionFundPercentage: z.enum(['2', '4', '']).optional(),
    union: z.string().optional(),
  }),
  shareInformationWithOtherParent: z.enum([YES, NO]),
  usePrivatePensionFund: z.enum([YES, NO]),
  employerNationalRegistryId: z
    .string()
    .refine((n) => n && kennitala.isValid(n), {
      params: errorMessages.employerNationalRegistryId,
    }),
  requestRights: z.object({
    isRequestingRights: z.enum([YES, NO]),
    requestDays: z
      .string()
      .refine((v) => !isNaN(Number(v)))
      .optional(),
  }),
  giveRights: z
    .object({
      isGivingRights: z.enum([YES, NO]),
      giveDays: z
        .string()
        .refine((v) => !isNaN(Number(v)))
        .optional(),
    })
    .optional(),
  singlePeriod: z.enum([YES, NO]),
  confirmLeaveDuration: z.enum(['duration', 'specificDate']),
  otherParent: z.enum([SPOUSE, NO, MANUAL]).optional(),
  otherParentName: z.string().optional(),
  otherParentId: z
    .string()
    .optional()
    .refine((n) => n && kennitala.isValid(n) && kennitala.isPerson(n), {
      params: errorMessages.otherParentId,
    }),
  otherParentRightOfAccess: z.enum([YES, NO]).optional(),
  otherParentEmail: z.string().email(),
  usePersonalAllowance: z.enum([YES, NO]),
  usePersonalAllowanceFromSpouse: z.enum([YES, NO]),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
