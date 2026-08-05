import * as z from 'zod'
import { applicantInformation } from './messages'
import { isValidNumber } from 'libphonenumber-js'
import { applicantInformationProps } from './types'
import { EMAIL_REGEX } from '@island.is/application/core'

const isValidEmail = (value: string) => EMAIL_REGEX.test(value)

const bankAccountSchema = z.object({
  bankNumber: z.string().optional(),
  ledger: z.string().optional(),
  accountNumber: z.string().optional(),
})

export const applicantInformationSchema = (
  props?: applicantInformationProps,
) => {
  const {
    phoneRequired = false,
    emailRequired = true,
    includeBankAccount = false,
    bankAccountRequired = false,
  } = props ?? {}

  const baseApplicantSchema = z.object({
    name: z.string(),
    nationalId: z.string(),
    address: z.string(),
    postalCode: z.string(),
    city: z.string(),
    email: z
      .string()
      .refine(
        (x) => (emailRequired ? isValidEmail(x) : !x || isValidEmail(x)),
        {
          params: applicantInformation.error.email,
        },
      ),
    phoneNumber: z
      .string()
      .refine(
        (x) => (phoneRequired ? isValidNumber(x) : !x || isValidNumber(x)),
        {
          params: applicantInformation.error.phoneNumber,
        },
      ),
  })

  if (!includeBankAccount) {
    return baseApplicantSchema
  }

  const applicantWithBankSchema = baseApplicantSchema.extend({
    bankAccount: bankAccountSchema.optional(),
  })

  if (bankAccountRequired) {
    return applicantWithBankSchema.superRefine((data, ctx) => {
      const acc = data.bankAccount
      const bankNumber = acc?.bankNumber?.trim() ?? ''
      const ledger = acc?.ledger?.trim() ?? ''
      const accountNumber = acc?.accountNumber?.trim() ?? ''
      if (!bankNumber || !ledger || !accountNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['bankAccount'],
          params: applicantInformation.error.bankAccountRequired,
        })
      }
    })
  }

  return applicantWithBankSchema.superRefine((data, ctx) => {
    const acc = data.bankAccount
    if (!acc) return
    const bankNumber = acc.bankNumber?.trim() ?? ''
    const ledger = acc.ledger?.trim() ?? ''
    const accountNumber = acc.accountNumber?.trim() ?? ''
    const anyPart = !!(bankNumber || ledger || accountNumber)
    const complete = !!(bankNumber && ledger && accountNumber)
    if (anyPart && !complete) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['bankAccount'],
        params: applicantInformation.error.bankAccountIncomplete,
      })
    }
  })
}
