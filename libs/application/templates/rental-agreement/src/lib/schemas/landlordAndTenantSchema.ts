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

const landLordInfoSchema = z.object({
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
  isRepresentative: z.array(z.string().optional()).optional(),
})

const landlordInfo = z
  .object({
    table: z.array(landLordInfoSchema),
  })
  .superRefine((data, ctx) => {
    const { table } = data

    if (table && table.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.partiesDetails.partiesEmptyTableError,
        path: ['table'],
      })
    }

    // Check for duplicate national IDs in landlord table
    if (table && table.length > 1) {
      const nationalIds = new Set<string>()
      table.forEach((landlord, index) => {
        const nationalId = landlord.nationalIdWithName?.nationalId
        if (nationalId) {
          if (nationalIds.has(nationalId)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Duplicate national ID found',
              params: m.partiesDetails.duplicateNationalIdError,
              path: ['table', index, 'nationalIdWithName', 'nationalId'],
            })
          } else {
            nationalIds.add(nationalId)
          }
        }
      })
    }
  })

const tenantInfo = z
  .object({
    table: z.array(personInfoSchema),
  })
  .superRefine((data, ctx) => {
    const { table } = data

    if (table && table.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.partiesDetails.tenantEmptyTableError,
        path: ['table'],
      })
    }

    // Check for duplicate national IDs in tenant table
    if (table && table.length > 1) {
      const nationalIds = new Set<string>()
      table.forEach((tenant, index) => {
        const nationalId = tenant.nationalIdWithName?.nationalId
        if (nationalId) {
          if (nationalIds.has(nationalId)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Duplicate national ID found',
              params: m.partiesDetails.duplicateNationalIdError,
              path: ['table', index, 'nationalIdWithName', 'nationalId'],
            })
          } else {
            nationalIds.add(nationalId)
          }
        }
      })
    }
  })

const checkforDuplicatesHelper = (
  table: Array<{ nationalIdWithName: { nationalId?: string | undefined } }>,
  nationalIds: Array<string>,
) => {
  let hasDuplicates = false
  let duplicateIndex = undefined
  table.forEach((party, i) => {
    const nationalId = party.nationalIdWithName?.nationalId
    if (!nationalId) return

    if (nationalIds.includes(nationalId)) {
      hasDuplicates = true
      duplicateIndex = i
    }
  })
  return { hasDuplicates, duplicateIndex }
}

export const parties = z
  .object({
    landlordInfo,
    tenantInfo,
  })
  .superRefine((data, ctx) => {
    const { landlordInfo, tenantInfo } = data

    const landlordTable = landlordInfo.table || []
    const tenantTable = tenantInfo.table || []

    const tenantNationalIds = tenantTable
      .map((tenant) => tenant.nationalIdWithName?.nationalId)
      .filter((id) => !!id) as string[]

    // Check landlordTable for duplicates in tenantTable
    const {
      hasDuplicates: hasDuplicatesInLandlordTable,
      duplicateIndex: duplicateIndexInLandlordTable,
    } = checkforDuplicatesHelper(landlordTable, tenantNationalIds)

    if (
      hasDuplicatesInLandlordTable &&
      duplicateIndexInLandlordTable !== undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        params: m.partiesDetails.duplicateNationalIdError,
        path: [
          'landlordInfo',
          'table',
          duplicateIndexInLandlordTable,
          'nationalIdWithName',
          'nationalId',
        ],
      })
    }
  })
