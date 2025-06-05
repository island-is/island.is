import { z } from 'zod'
import * as kennitala from 'kennitala'
import { coreErrorMessages, YES } from '@island.is/application/core'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { DollyType, ExemptionFor, ExemptionType } from '../shared'
import { error } from './messages'

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const ApplicantSchema = z.object({
  nationalId: z
    .string()
    .refine((nationalId) => nationalId && kennitala.isValid(nationalId)),
  name: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().refine((v) => isValidPhoneNumber(v)),
})

const ResponsiblePersonSchema = z
  .object({
    isSameAsApplicant: z.array(z.enum([YES])).optional(),
    nationalId: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
  })
  .refine(
    ({ isSameAsApplicant, nationalId }) => {
      if (isSameAsApplicant?.includes(YES)) return true
      return nationalId && kennitala.isValid(nationalId)
    },
    { path: ['nationalId'] },
  )
  .refine(
    ({ isSameAsApplicant, name }) => {
      if (isSameAsApplicant?.includes(YES)) return true
      return !!name
    },
    { path: ['name'] },
  )
  .refine(
    ({ isSameAsApplicant, email }) => {
      if (isSameAsApplicant?.includes(YES)) return true
      return !!email
    },
    { path: ['email'] },
  )
  .refine(
    ({ isSameAsApplicant, phone }) => {
      if (isSameAsApplicant?.includes(YES)) return true
      return !!phone
    },
    { path: ['phone'] },
  )

const TransporterSchema = z
  .intersection(
    ResponsiblePersonSchema,
    z.object({
      address: z.string().max(100).optional(),
      postalCodeAndCity: z.string().optional(),
    }),
  )
  .refine(
    ({ isSameAsApplicant, address }) => {
      if (isSameAsApplicant?.includes(YES)) return true
      return !!address
    },
    { path: ['address'] },
  )
  .refine(
    ({ isSameAsApplicant, postalCodeAndCity }) => {
      if (isSameAsApplicant?.includes(YES)) return true
      return !!postalCodeAndCity
    },
    { path: ['postalCodeAndCity'] },
  )

const ConvoySchema = z.object({
  items: z.array(
    z.object({
      convoyId: z.string(),
      vehicle: z.object({
        permno: z.string().length(5),
        makeAndColor: z.string().min(1),
        numberOfAxles: z.number(),
        hasError: z.boolean().refine((v) => v !== true),
      }),
      trailer: z
        .object({
          permno: z.string().optional(),
          makeAndColor: z.string().optional(),
          numberOfAxles: z.number().optional(),
          hasError: z.boolean().optional(),
        })
        .refine(
          ({ permno }) => {
            if (!permno) return true
            return permno.length === 5
          },
          { path: ['permno'] },
        )
        .refine(
          ({ permno, makeAndColor }) => {
            if (!permno) return true
            return !!makeAndColor
          },
          { path: ['makeAndColor'] },
        )
        .refine(
          ({ permno, numberOfAxles }) => {
            if (!permno) return true
            return !!numberOfAxles
          },
          { path: ['numberOfAxles'] },
        )
        .refine(({ permno, hasError }) => {
          if (!permno) return true
          return hasError !== true
        })
        .optional(),
      dollyType: z.nativeEnum(DollyType),
    }),
  ),
})

const FreightSchema = z
  .object({
    // Note: we are only saving exemptionPeriodType and limit in answers to be able to display
    // pretty zod error message (without the usage of custom component)
    exemptionPeriodType: z.string(),
    limit: z
      .object({
        maxLength: z.number().optional(),
        maxWeight: z.number().optional(),
        maxHeight: z.number().optional(),
        maxWidth: z.number().optional(),
        maxTotalLength: z.number().optional(),
      })
      .optional(),
    items: z.array(
      z.object({
        freightId: z.string(),
        name: z.string().min(1).max(100),
        length: z.string().min(1),
        weight: z.string().min(1),
        // Short-term only:
        height: z.string().optional(),
        width: z.string().optional(),
        totalLength: z.string().optional(),
        exemptionFor: z.array(z.nativeEnum(ExemptionFor).nullable()).optional(),
      }),
    ),
  })
  .superRefine(({ items, limit, exemptionPeriodType }, ctx) => {
    if (!limit) return

    let keysToCheck: {
      key: keyof NonNullable<typeof items[number]>
      limitKey: keyof NonNullable<typeof limit>
    }[] = []

    if (exemptionPeriodType === ExemptionType.SHORT_TERM) {
      keysToCheck = [
        { key: 'length', limitKey: 'maxLength' },
        { key: 'weight', limitKey: 'maxWeight' },
        { key: 'height', limitKey: 'maxHeight' },
        { key: 'width', limitKey: 'maxWidth' },
        { key: 'totalLength', limitKey: 'maxTotalLength' },
      ]
    } else if (exemptionPeriodType === ExemptionType.LONG_TERM) {
      keysToCheck = [
        { key: 'length', limitKey: 'maxLength' },
        { key: 'weight', limitKey: 'maxWeight' },
        // Note: Exclude height, width and totalLength, since those fields are validated in the pairing part for long-term
      ]
    }

    keysToCheck.forEach(({ key, limitKey }) => {
      const max = limit[limitKey]
      if (max === undefined) return

      items.forEach((item, index) => {
        const valueStr = item[key]
        if (valueStr === undefined) return

        const valueNum = Number(valueStr)

        if (isNaN(valueNum) || valueNum <= 0 || valueNum > max) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            params: {
              ...error.numberValueIsNotWithinLimit,
              values: { min: '0', max },
            },
            path: ['items', index, key],
          })
        }
      })
    })
  })

const FreightPairingSchema = z
  .object({
    // Note: we are only saving exemptionPeriodType and limit in answers to be able to display
    // pretty zod error message (without the usage of custom component)
    exemptionPeriodType: z.string(),
    limit: z
      .object({
        maxLength: z.number().optional(),
        maxWeight: z.number().optional(),
        maxHeight: z.number().optional(),
        maxWidth: z.number().optional(),
        maxTotalLength: z.number().optional(),
      })
      .optional(),
    freightId: z.string(),
    convoyIdList: z.array(z.string()),
    items: z.array(
      z
        .object({
          convoyId: z.string(),
          // Long-term only:
          height: z.string().min(1),
          width: z.string().min(1),
          totalLength: z.string().min(1),
          exemptionFor: z
            .array(z.nativeEnum(ExemptionFor).nullable())
            .optional(),
        })
        .optional()
        .nullable(),
    ),
  })
  .superRefine(({ exemptionPeriodType, limit, items }, ctx) => {
    // Note: Skipping if not long-term, since these fields are validated in the freight part of the schema
    if (exemptionPeriodType !== ExemptionType.LONG_TERM || !limit) return

    const keysToCheck: {
      key: keyof NonNullable<typeof items[number]>
      limitKey: keyof NonNullable<typeof limit>
    }[] = [
      { key: 'height', limitKey: 'maxHeight' },
      { key: 'width', limitKey: 'maxWidth' },
      { key: 'totalLength', limitKey: 'maxTotalLength' },
    ]
    keysToCheck.forEach(({ key, limitKey }) => {
      const max = limit[limitKey]
      if (max === undefined) return

      items.forEach((item, index) => {
        if (!item) return

        const valueStr = item[key]
        if (valueStr === undefined) return

        const valueNum = Number(valueStr)

        if (isNaN(valueNum) || valueNum <= 0 || valueNum > max) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            params: {
              ...error.numberValueIsNotWithinLimit,
              values: { min: '0', max },
            },
            path: ['items', index, key],
          })
        }
      })
    })
  })

const AxleSpacingSchema = z
  .object({
    exemptionPeriodType: z.string(),
    vehicleList: z.array(
      z.object({
        permno: z.string(),
        values: z.array(z.string().min(1)),
      }),
    ),
    dolly: z.object({
      type: z.nativeEnum(DollyType),
      // Note: keeping this as array in case we want to allow triple dolly in the future
      values: z.array(z.string().optional()).optional(),
    }),
    trailerList: z.array(
      z.object({
        useSameValues: z.array(z.enum([YES])).optional(),
        permno: z.string(),
        singleValue: z.string().optional(),
        values: z.array(z.string().optional()),
      }),
    ),
  })
  .refine(
    ({ exemptionPeriodType, dolly }) => {
      // Since dolly is only allowed in short-term
      if (exemptionPeriodType !== ExemptionType.SHORT_TERM) return true
      // Since there is only axle space for double dolly
      if (dolly.type !== DollyType.DOUBLE) return true

      return !!dolly?.values?.[0]
    },
    { path: ['dolly', 'values', '0'] },
  )
  .superRefine((data, ctx) => {
    data.trailerList.forEach((trailer, index) => {
      if (trailer.permno) {
        if (trailer.useSameValues?.includes(YES)) {
          if (!trailer.values?.[0]) {
            ctx.addIssue({
              path: ['trailerList', index, 'singleValue'],
              code: z.ZodIssueCode.custom,
              params: coreErrorMessages.defaultError,
            })
          }
        } else {
          trailer.values?.forEach((value, valueIndex) => {
            if (!value) {
              ctx.addIssue({
                path: ['trailerList', index, 'values', valueIndex],
                code: z.ZodIssueCode.custom,
                params: coreErrorMessages.defaultError,
              })
            }
          })
        }
      }
    })
  })

const FileDocumentSchema = z.object({
  name: z.string(),
  key: z.string(),
})

const LocationSchema = z
  .object({
    exemptionPeriodType: z.string(),
    shortTerm: z
      .object({
        addressFrom: z.string().optional(),
        postalCodeAndCityFrom: z.string().optional(),
        addressTo: z.string().optional(),
        postalCodeAndCityTo: z.string().optional(),
        directions: z.string().optional(),
      })
      .optional(),
    longTerm: z
      .object({
        regions: z.array(z.string()).optional().nullable(),
        directions: z.string().optional(),
        files: z.array(FileDocumentSchema).optional(),
      })
      .optional(),
  })
  .refine(
    ({ exemptionPeriodType, shortTerm }) => {
      if (exemptionPeriodType !== ExemptionType.SHORT_TERM) return true
      return !!shortTerm?.addressFrom
    },
    { path: ['shortTerm', 'addressFrom'] },
  )
  .refine(
    ({ exemptionPeriodType, shortTerm }) => {
      if (exemptionPeriodType !== ExemptionType.SHORT_TERM) return true
      return !!shortTerm?.postalCodeAndCityFrom
    },
    { path: ['shortTerm', 'postalCodeAndCityFrom'] },
  )
  .refine(
    ({ exemptionPeriodType, shortTerm }) => {
      if (exemptionPeriodType !== ExemptionType.SHORT_TERM) return true
      return !!shortTerm?.addressTo
    },
    { path: ['shortTerm', 'addressTo'] },
  )
  .refine(
    ({ exemptionPeriodType, shortTerm }) => {
      if (exemptionPeriodType !== ExemptionType.SHORT_TERM) return true
      return !!shortTerm?.postalCodeAndCityTo
    },
    { path: ['shortTerm', 'postalCodeAndCityTo'] },
  )
  .refine(
    ({ exemptionPeriodType, shortTerm }) => {
      if (exemptionPeriodType !== ExemptionType.SHORT_TERM) return true
      return !!shortTerm?.directions
    },
    { path: ['shortTerm', 'directions'] },
  )
  .refine(
    ({ exemptionPeriodType, longTerm }) => {
      if (exemptionPeriodType !== ExemptionType.LONG_TERM) return true
      return longTerm?.regions?.length || longTerm?.directions
    },
    { path: ['longTerm', 'regions'] },
  )
  .refine(
    ({ exemptionPeriodType, longTerm }) => {
      if (exemptionPeriodType !== ExemptionType.LONG_TERM) return true
      return longTerm?.regions?.length || longTerm?.directions
    },
    { path: ['longTerm', 'directions'] },
  )

export const ExemptionForTransportationSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: ApplicantSchema,
  transporter: TransporterSchema,
  responsiblePerson: ResponsiblePersonSchema,
  exemptionPeriod: z.object({
    type: z.nativeEnum(ExemptionType),
    dateFrom: z.string().min(1),
    dateTo: z.string().min(1),
  }),
  convoy: ConvoySchema,
  freight: FreightSchema,
  freightPairing: z
    .array(FreightPairingSchema.optional().nullable())
    .optional(),
  axleSpacing: AxleSpacingSchema,
  location: LocationSchema,
  supportingDocuments: z.object({
    files: z.array(FileDocumentSchema).optional(),
    comments: z.string().optional(),
  }),
  agreementCheckbox: z.array(z.string()).refine((v) => v.includes(YES)),
})

export type ExemptionForTransportation = z.TypeOf<
  typeof ExemptionForTransportationSchema
>
