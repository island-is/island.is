import { z } from 'zod'
import * as kennitala from 'kennitala'
import * as m from '../messages'
import { EMAIL_REGEX } from '@island.is/application/core'
import { isValidPhoneNumber } from '../../utils/utils'

export const isValidEmail = (value: string) => EMAIL_REGEX.test(value)

const personInfoSchema = z.object({
  nationalIdWithName: z.object({
    nationalId: z
      .string()
      .optional()
      .refine((val) => (val ? kennitala.info(val).age >= 18 : false), {
        params: m.landlordAndTenantDetails.nationalIdAgeError,
      })
      .refine((val) => (val ? kennitala.isValid(val) : false), {
        params: m.landlordAndTenantDetails.nationalIdError,
      }),
    name: z
      .string()
      .optional()
      .refine((name) => !!name && name.trim().length > 0),
  }),
  phone: z
    .string()
    .optional()
    .refine((x) => !!x && x.trim().length > 0, {
      params: m.landlordAndTenantDetails.phoneNumberEmptyError,
    })
    .refine((x) => x && isValidPhoneNumber(x), {
      params: m.landlordAndTenantDetails.phoneNumberInvalidError,
    }),
  email: z
    .string()
    .optional()
    .refine((val) => !!val && val.trim().length > 0 && isValidEmail(val), {
      params: m.landlordAndTenantDetails.emailInvalidError,
    }),
  address: z
    .string()
    .optional()
    .refine((x) => !!x && x.trim().length > 0, {
      params: m.landlordAndTenantDetails.addressEmptyError,
    }),
})

export const tenantInfo = z
  .object({
    table: z.array(personInfoSchema),
    representativeTable: z.array(personInfoSchema),
  })
  .superRefine((data, ctx) => {
    if (data.table && data.table.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.tenantDetails.tenantEmptyTableError,
        path: ['table'],
      })
    }
  })

export const landlordInfo = z
  .object({
    table: z.array(personInfoSchema),
    representativeTable: z.array(personInfoSchema),
  })
  .superRefine((data, ctx) => {
    if (data.table && data.table.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.landlordDetails.landlordEmptyTableError,
        path: ['table'],
      })
    }
  })
