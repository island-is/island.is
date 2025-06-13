import { z } from 'zod'
import * as m from '../messages'

export const landlordInfo = z
  .object({
    table: z.array(
      z.object({
        nationalIdWithName: z.object({
          nationalId: z
            .string()
            .optional()
            .refine((x) => !!x && x.trim().length > 0, {
              params: m.landlordDetails.landlordNationalIdEmptyError,
            }),
          name: z.string().optional(),
        }),
        phone: z
          .string()
          .optional()
          .refine((x) => !!x && x.trim().length > 0, {
            params: m.landlordDetails.landlordPhoneNumberEmptyError,
          }),
        email: z
          .string()
          .optional()
          .refine((x) => !!x && x.trim().length > 0, {
            params: m.landlordDetails.landlordEmailEmptyError,
          }),
        address: z
          .string()
          .optional()
          .refine((x) => !!x && x.trim().length > 0, {
            params: m.landlordDetails.landlordAddressEmptyError,
          }),
        isRepresentative: z.array(z.string()).optional(),
      }),
    ),
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
