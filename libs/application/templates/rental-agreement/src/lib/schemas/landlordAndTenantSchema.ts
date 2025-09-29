import { z } from 'zod'
import * as kennitala from 'kennitala'
import * as m from '../messages'
import { EMAIL_REGEX, YES } from '@island.is/application/core'
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
})

const representativeInfoSchema = z.object({
  nationalIdWithName: z.object({
    nationalId: z.string().optional(),
    name: z.string().optional(),
  }),
  phone: z.string().optional(),
  email: z.string().optional(),
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
})

const landlordInfo = z
  .object({
    table: z.array(landLordInfoSchema),
    representativeTable: z.any().optional().default([]),
    shouldShowRepresentativeTable: z.array(z.string()),
  })
  .superRefine((data, ctx) => {
    const { table, representativeTable, shouldShowRepresentativeTable } = data

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

    // Check for duplicate national IDs in representative table
    // Only validate if representativeTable contains objects (not strings from clearOnChange)
    if (
      representativeTable &&
      Array.isArray(representativeTable) &&
      representativeTable.length > 1 &&
      shouldShowRepresentativeTable?.includes(YES) &&
      representativeTable[0] &&
      typeof representativeTable[0] === 'object'
    ) {
      const nationalIds = new Set<string>()
      representativeTable.forEach((representative, index) => {
        const nationalId = representative.nationalIdWithName?.nationalId
        if (nationalId) {
          if (nationalIds.has(nationalId)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Duplicate national ID found',
              params: m.partiesDetails.duplicateNationalIdError,
              path: [
                'landlordInfo',
                'representativeTable',
                index,
                'nationalIdWithName',
                'nationalId',
              ],
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

export const partiesSchema = z
  .object({
    landlordInfo,
    tenantInfo,
  })
  .superRefine((data, ctx) => {
    const { landlordInfo, tenantInfo } = data

    const landlordTable = landlordInfo.table || []
    const representativeTable = landlordInfo.representativeTable || []
    const tenantTable = tenantInfo.table || []

    // Create arrays of national IDs from representative and tenant tables
    const shouldShowRepresentativeTable =
      landlordInfo.shouldShowRepresentativeTable || []

    const landlordNationalIds = landlordTable
      .map((rep) => rep.nationalIdWithName?.nationalId)
      .filter((id) => !!id) as string[]

    const representativeNationalIds =
      shouldShowRepresentativeTable.includes(YES) &&
      representativeTable &&
      representativeTable.length > 0 &&
      typeof representativeTable[0] === 'object'
        ? ((
            representativeTable as Array<
              z.TypeOf<typeof representativeInfoSchema>
            >
          )
            .map((rep) => rep.nationalIdWithName?.nationalId)
            .filter((id) => !!id) as string[])
        : []

    const tenantNationalIds = tenantTable
      .map((tenant) => tenant.nationalIdWithName?.nationalId)
      .filter((id) => !!id) as string[]

    const representativeAndTenantNationalIds = [
      ...representativeNationalIds,
      ...tenantNationalIds,
    ]
    const landlordAndTenantNationalIds = [
      ...landlordNationalIds,
      ...tenantNationalIds,
    ]
    const landlordAndRepresentativeNationalIds = [
      ...landlordNationalIds,
      ...representativeNationalIds,
    ]

    // Check landlordTable for duplicates in representativeTable and tenantTable
    const {
      hasDuplicates: hasDuplicatesInLandlordTable,
      duplicateIndex: duplicateIndexInLandlordTable,
    } = checkforDuplicatesHelper(
      landlordTable,
      representativeAndTenantNationalIds,
    )
    // Check representativeTable for duplicates in landlordTable and tenantTable
    // Only check if shouldShowRepresentativeTable includes YES
    const {
      hasDuplicates: hasDuplicatesInRepresentativeTable,
      duplicateIndex: duplicateIndexInRepresentativeTable,
    } =
      shouldShowRepresentativeTable.includes(YES) &&
      representativeTable &&
      representativeTable.length > 0 &&
      typeof representativeTable[0] === 'object'
        ? checkforDuplicatesHelper(
            representativeTable as Array<
              z.TypeOf<typeof representativeInfoSchema>
            >,
            landlordAndTenantNationalIds,
          )
        : { hasDuplicates: false, duplicateIndex: undefined }
    // Check tenantTable for duplicates in landlordTable and representativeTable
    // Only check against representative table if shouldShowRepresentativeTable includes YES
    const {
      hasDuplicates: hasDuplicatesInTenantTable,
      duplicateIndex: duplicateIndexInTenantTable,
    } = checkforDuplicatesHelper(
      tenantTable,
      landlordAndRepresentativeNationalIds,
    )

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

    if (
      hasDuplicatesInRepresentativeTable &&
      duplicateIndexInRepresentativeTable !== undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        params: m.partiesDetails.duplicateNationalIdError,
        path: [
          'landlordInfo',
          'representativeTable',
          duplicateIndexInRepresentativeTable,
          'nationalIdWithName',
          'nationalId',
        ],
      })
    }

    if (
      hasDuplicatesInTenantTable &&
      duplicateIndexInTenantTable !== undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        params: m.partiesDetails.duplicateNationalIdError,
        path: [
          'tenantInfo',
          'table',
          duplicateIndexInTenantTable,
          'nationalIdWithName',
          'nationalId',
        ],
      })
    }
  })
