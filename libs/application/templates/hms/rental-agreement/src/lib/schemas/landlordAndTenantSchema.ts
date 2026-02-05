import { z } from 'zod'
import * as kennitala from 'kennitala'
import * as m from '../messages'
import { EMAIL_REGEX, YES } from '@island.is/application/core'
import { isValidMobileNumber } from '../../utils/utils'
import { ApplicantsRole } from '../../utils/enums'

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
    .refine((x) => x && isValidMobileNumber(x), {
      params: m.landlordAndTenantDetails.phoneNumberMobileError,
    }),
  email: z
    .string()
    .optional()
    .refine((val) => !!val && val.trim().length > 0 && isValidEmail(val), {
      params: m.landlordAndTenantDetails.emailInvalidError,
    }),
  isRemoved: z.boolean().optional(),
})

const representativeInfoSchema = z.object({
  nationalIdWithName: z.object({
    nationalId: z.string().optional(),
    name: z.string().optional(),
  }),
  phone: z.string().optional(),
  email: z.string().optional(),
  isRemoved: z.boolean().optional(),
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
    .refine((x) => x && isValidMobileNumber(x), {
      params: m.landlordAndTenantDetails.phoneNumberMobileError,
    }),
  email: z
    .string()
    .optional()
    .refine((val) => !!val && val.trim().length > 0 && isValidEmail(val), {
      params: m.landlordAndTenantDetails.emailInvalidError,
    }),
  isRemoved: z.boolean().optional(),
})

const landlordInfo = z.object({
  table: z.array(landLordInfoSchema),
  representativeTable: z.any().optional().default([]),
  shouldShowRepresentativeTable: z.array(z.string()).optional(),
})

const tenantInfo = z.object({
  table: z.array(personInfoSchema),
})

const signatory = z
  .object({
    nationalIdWithName: z.object({
      nationalId: z.string().optional(),
      name: z.string().optional(),
    }),
    phone: z.string().optional(),
    email: z.string().optional(),
  })
  .optional()

const checkforDuplicatesHelper = (
  table: Array<{
    nationalIdWithName: { nationalId?: string | undefined }
    isRemoved?: boolean
  }>,
  nationalIds: Array<string>,
) => {
  let hasDuplicates = false
  let duplicateIndex = undefined
  table.forEach((party, i) => {
    // Skip items marked as removed in TableRepeaterField
    if (party.isRemoved) return

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
    applicantsRole: z.string(),
    applicant: z.object({
      name: z.string(),
      nationalId: z.string(),
      email: z.string(),
      phoneNumber: z.string(),
    }),
    landlordInfo,
    tenantInfo,
    signatory,
  }) // Cross reference between tables
  .superRefine((data, ctx) => {
    const { landlordInfo, tenantInfo, applicantsRole, applicant } = data

    const landlordTable = landlordInfo.table || []
    const representativeTable = landlordInfo.representativeTable || []
    const tenantTable = tenantInfo.table || []
    const applicantNationalId = applicant.nationalId

    // Create arrays of national IDs from representative and tenant tables
    const shouldShowRepresentativeTable =
      landlordInfo.shouldShowRepresentativeTable || []

    const landlordNationalIds = [
      ...(landlordTable
        .filter((rep) => !rep.isRemoved)
        .map((rep) => rep.nationalIdWithName?.nationalId)
        .filter((id) => !!id) as Array<string>),
      ...(applicantsRole === ApplicantsRole.LANDLORD
        ? [applicantNationalId]
        : []),
    ]

    const representativeNationalIds = [
      ...(shouldShowRepresentativeTable.includes(YES) &&
      representativeTable &&
      representativeTable.length > 0 &&
      typeof representativeTable[0] === 'object'
        ? ((
            representativeTable as Array<
              z.TypeOf<typeof representativeInfoSchema> & { isRemoved?: boolean }
            >
          )
            .filter((rep) => !rep.isRemoved)
            .map((rep) => rep.nationalIdWithName?.nationalId)
            .filter((id) => !!id) as Array<string>)
        : []),
      ...(applicantsRole === ApplicantsRole.REPRESENTATIVE
        ? [applicantNationalId]
        : []),
    ]

    const tenantNationalIds = [
      ...(tenantTable
        .filter((tenant) => !tenant.isRemoved)
        .map((tenant) => tenant.nationalIdWithName?.nationalId)
        .filter((id) => !!id) as Array<string>),
      ...(applicantsRole === ApplicantsRole.TENANT
        ? [applicantNationalId]
        : []),
    ]

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
  }) // Validate landlord table, including if the applicant is a landlord
  .superRefine((data, ctx) => {
    const { landlordInfo, applicantsRole, applicant } = data
    const { table } = landlordInfo

    const activeTable = table.filter((landlord) => !landlord.isRemoved)

    const landlordNationalIds = [
      ...(applicantsRole === ApplicantsRole.LANDLORD
        ? [applicant.nationalId]
        : []),
      ...(activeTable
        .map((landlord) => landlord.nationalIdWithName?.nationalId)
        .filter((id) => !!id) as Array<string>),
    ]
    if (landlordNationalIds.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.partiesDetails.partiesEmptyTableError,
        path: ['landlordInfo', 'table'],
      })
    }

    // Check for duplicate national IDs in landlord table
    if (landlordNationalIds.length > 1) {
      const nationalIds = new Set<string>()
      landlordNationalIds.forEach((nationalId, index) => {
        if (nationalIds.has(nationalId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Duplicate national ID found',
            params: m.partiesDetails.duplicateNationalIdError,
            path: [
              'landlordInfo',
              'table',
              applicantsRole === ApplicantsRole.LANDLORD ? index - 1 : index,
              'nationalIdWithName',
              'nationalId',
            ],
          })
        } else {
          nationalIds.add(nationalId)
        }
      })
    }
  }) // Validate tenant table, including if the applicant is a tenant
  .superRefine((data, ctx) => {
    const { tenantInfo, applicantsRole, applicant } = data
    const { table } = tenantInfo

    const activeTable = table.filter((tenant) => !tenant.isRemoved)

    const tenantNationalIds = [
      ...(applicantsRole === ApplicantsRole.TENANT
        ? [applicant.nationalId]
        : []),
      ...(activeTable
        .map((tenant) => tenant.nationalIdWithName?.nationalId)
        .filter((id) => !!id) as Array<string>),
    ]

    if (tenantNationalIds.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.partiesDetails.tenantEmptyTableError,
        path: ['tenantInfo', 'table'],
      })
    }

    // Check for duplicate national IDs in tenant table
    if (tenantNationalIds.length > 1) {
      const nationalIds = new Set<string>()
      tenantNationalIds.forEach((nationalId, index) => {
        if (nationalIds.has(nationalId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Duplicate national ID found',
            params: m.partiesDetails.duplicateNationalIdError,
            path: [
              'tenantInfo',
              'table',
              applicantsRole === ApplicantsRole.TENANT ? index - 1 : index,
              'nationalIdWithName',
              'nationalId',
            ],
          })
        } else {
          nationalIds.add(nationalId)
        }
      })
    }
  }) // Validate signatory
  .superRefine((data, ctx) => {
    const { applicant, signatory } = data
    const { nationalIdWithName, phone, email } = signatory || {}
    if (kennitala.isCompany(applicant.nationalId)) {
      if (!nationalIdWithName?.nationalId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Company signatory missing',
          params: m.partiesDetails.companySignatoryError,
          path: ['signatory', 'nationalIdWithName', 'nationalId'],
        })
      }
      if (!phone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Company signatory phone missing',
          params: m.landlordAndTenantDetails.phoneNumberEmptyError,
          path: ['signatory', 'phone'],
        })
      }
      if (phone && !isValidMobileNumber(phone)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Company signatory phone is not a mobile number',
          params: m.landlordAndTenantDetails.phoneNumberMobileError,
          path: ['signatory', 'phone'],
        })
      }
      if (!email) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Company signatory email missing',
          params: m.landlordAndTenantDetails.emailInvalidError,
          path: ['signatory', 'email'],
        })
      }
    }
  })
