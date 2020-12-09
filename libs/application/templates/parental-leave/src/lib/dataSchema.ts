import * as z from 'zod'
import isValid from 'date-fns/isValid'
import parseISO from 'date-fns/parseISO'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import * as kennitala from 'kennitala'
import { NO, YES } from '../constants'

const PersonalAllowance = z
  .object({
    usage: z
      .string()
      .refine((x) => parseFloat(x) >= 0 && parseFloat(x) <= 100)
      .optional(),
    usedAmount: z
      .string()
      .refine((x) => parseInt(x, 10) >= 0)
      .optional(),
    periodFrom: z
      .string()
      .refine((d) => isValid(parseISO(d)))
      .optional(),
    periodTo: z
      .string()
      .refine((d) => isValid(parseISO(d)))
      .optional(),
  })
  .optional()

const Period = z.object({
  startDate: z.string().refine((d) => isValid(parseISO(d))),
  endDate: z.string().refine((d) => isValid(parseISO(d))),
  ratio: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && parseInt(val) > 0 && parseInt(val) <= 100,
    ),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: z.object({
    email: z.string().email(),
    phoneNumber: z.string().refine((p) => {
      const phoneNumber = parsePhoneNumberFromString(p, 'IS')
      return phoneNumber && phoneNumber.isValid()
    }, 'Símanúmer þarf að vera gilt'),
  }),
  personalAllowance: PersonalAllowance,
  personalAllowanceFromSpouse: PersonalAllowance,
  payments: z.object({
    bank: z.string().nonempty(),
    personalAllowanceUsage: z.enum(['100', '75', '50', '25']),
    pensionFund: z.string(),
    privatePensionFund: z.enum(['frjalsi', '']).optional(),
    privatePensionFundPercentage: z.enum(['2', '4', '']).optional(),
  }),
  shareInformationWithOtherParent: z.enum([YES, NO]),
  usePrivatePensionFund: z.enum([YES, NO]),
  periods: z.array(Period).nonempty(),
  employer: z.object({
    name: z.string().nonempty(),
    nationalRegistryId: z
      .string()
      .nonempty()
      .refine(
        (n) => kennitala.isValid(n) && kennitala.isCompany(n),
        'Kennitala þarf að vera gild',
      ),
    contact: z.string().optional(),
    contactId: z.string().optional(),
  }),
  requestRights: z.enum([YES, NO]),
  giveRights: z.enum([YES, NO]),
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
  usePersonalAllowance: z.enum([YES, NO]),
  usePersonalAllowanceFromSpouse: z.enum([YES, NO]),
})
export type SchemaFormValues = z.infer<typeof dataSchema>
