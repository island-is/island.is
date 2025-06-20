import { z } from 'zod'
import * as m from '../messages'

export const tenantInfo = z
  .object({
    table: z.array(
      z.object({
        nationalIdWithName: z.object({
          nationalId: z.string().refine((x) => !!x && x.trim().length > 0, {
            params: m.tenantDetails.tenantNationalIdEmptyError,
          }),
          name: z.string(),
        }),
        phone: z
          .string()
          .optional()
          .refine((x) => !!x && x.trim().length > 0, {
            params: m.tenantDetails.tenantPhoneNumberEmptyError,
          }),
        email: z
          .string()
          .optional()
          .refine((x) => !!x && x.trim().length > 0, {
            params: m.tenantDetails.tenantEmailEmptyError,
          }),
        address: z
          .string()
          .optional()
          .refine((x) => !!x && x.trim().length > 0, {
            params: m.tenantDetails.tenantAddressEmptyError,
          }),
      }),
    ),
    representativeTable: z.array(
      z.object({
        nationalIdWithName: z.object({
          nationalId: z.string().refine((x) => !!x && x.trim().length > 0, {
            params: m.tenantDetails.tenantNationalIdEmptyError,
          }),
          name: z.string(),
        }),
        phone: z
          .string()
          .optional()
          .refine((x) => !!x && x.trim().length > 0, {
            params: m.tenantDetails.tenantPhoneNumberEmptyError,
          }),
        email: z
          .string()
          .optional()
          .refine((x) => !!x && x.trim().length > 0, {
            params: m.tenantDetails.tenantEmailEmptyError,
          }),
        address: z
          .string()
          .optional()
          .refine((x) => !!x && x.trim().length > 0, {
            params: m.tenantDetails.tenantAddressEmptyError,
          }),
      }),
    ),
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
