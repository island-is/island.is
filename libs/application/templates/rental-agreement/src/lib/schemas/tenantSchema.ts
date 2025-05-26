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
        isRepresentative: z.array(z.string()).optional(),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    // TODO: Uncomment this when validation in repeatable table is fixed
    // const filterNonRepresentatives =
    //   data.table &&
    //   data.table.filter(
    //     (tenant) => !tenant.isRepresentative?.includes(IS_REPRESENTATIVE),
    //   )
    if (data.table && data.table.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.tenantDetails.tenantEmptyTableError,
        path: ['table'],
      })
    }
    // TODO: Uncomment this when validation in repeatable table is fixed
    // else if (filterNonRepresentatives?.length === 0) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: 'Custom error message',
    //     params: m.tenantDetails.tenantOnlyRepresentativeTableError,
    //     path: ['table'],
    //   })
    // }
  })
