import { z } from 'zod'
import * as m from '../messages'

const personInfoSchema = z.object({
  nationalIdWithName: z.object({
    nationalId: z
      .string()
      .optional()
      .refine((x) => !!x && x.trim().length > 0, {
        params: m.landlordAndTenantDetails.nationalIdEmptyError,
      }),
    name: z.string().optional(),
  }),
  phone: z
    .string()
    .optional()
    .refine((x) => !!x && x.trim().length > 0, {
      params: m.landlordAndTenantDetails.phoneNumberEmptyError,
    }),
  email: z
    .string()
    .optional()
    .refine((x) => !!x && x.trim().length > 0, {
      params: m.landlordAndTenantDetails.emailEmptyError,
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
