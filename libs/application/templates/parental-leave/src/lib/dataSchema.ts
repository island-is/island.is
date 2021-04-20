import * as z from 'zod'
import * as kennitala from 'kennitala'
import { NO, YES } from '../constants'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

/**
 * TODO: zod has a way to overwrite the default errors messages e.g. "Field is required" etc..
 * We might want to define it for all primitives and add localization to it
 */
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
  selectedChild: z.string(),
  applicant: z.object({
    email: z.string().email(),
    phoneNumber: z.string().refine((p) => {
      const phoneNumber = parsePhoneNumberFromString(p, 'IS')
      return phoneNumber && phoneNumber.isValid()
    }, 'Símanúmerið þarf að vera gilt.'),
  }),
  personalAllowance: PersonalAllowance,
  personalAllowanceFromSpouse: PersonalAllowance,
  payments: z.object({
    bank: z.string().nonempty(),
    pensionFund: z.string(),
    privatePensionFund: z.string().optional(),
    privatePensionFundPercentage: z.enum(['2', '4', '']).optional(),
    union: z.string().optional(),
  }),
  shareInformationWithOtherParent: z.enum([YES, NO]),
  usePrivatePensionFund: z.enum([YES, NO]),
  employerInformation: z.object({ email: z.string().email() }).optional(),
  requestRights: z.object({
    isRequestingRights: z.enum([YES, NO]),
    requestDays: z.number().optional(),
  }),
  giveRights: z.object({
    isGivingRights: z.enum([YES, NO]),
    giveDays: z.number().optional(),
  }),
  singlePeriod: z.enum([YES, NO]),
  firstPeriodStart: z.enum(['dateOfBirth', 'specificDate']),
  confirmLeaveDuration: z.enum(['duration', 'specificDate']),
  otherParent: z.enum(['spouse', NO, 'manual']).optional(),
  otherParentName: z.string().optional(),
  otherParentId: z
    .string()
    .optional()
    .refine(
      (n) => n && kennitala.isValid(n) && kennitala.isPerson(n),
      'Kennitala þarf að vera gild',
    ),
  otherParentRightOfAccess: z.enum([YES, NO]).optional(),
  usePersonalAllowance: z.enum([YES, NO]),
  usePersonalAllowanceFromSpouse: z.enum([YES, NO]),
})
export type SchemaFormValues = z.infer<typeof dataSchema>
