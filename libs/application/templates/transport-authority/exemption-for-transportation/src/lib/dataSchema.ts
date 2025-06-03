import { z } from 'zod'
import * as kennitala from 'kennitala'
import { coreErrorMessages, YES } from '@island.is/application/core'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { DollyType, ExemptionFor, ExemptionType } from '../shared'
import { error } from './messages'
import { getInvalidFreightItemIndex } from '../utils'

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
  .refine(
    ({ limit, items }) => {
      const invalidItemIndex = getInvalidFreightItemIndex(
        items.map((x) => x.length),
        limit?.maxLength,
      )
      return invalidItemIndex === -1
    },
    ({ limit, items }) => {
      const invalidItemIndex = getInvalidFreightItemIndex(
        items.map((x) => x.length),
        limit?.maxLength,
      )
      return {
        path: ['items', invalidItemIndex, 'length'],
        params: {
          ...error.numberValueIsNotWithinLimit,
          values: { min: '0', max: limit?.maxLength },
        },
      }
    },
  )
  .refine(
    ({ limit, items }) => {
      const invalidItemIndex = getInvalidFreightItemIndex(
        items.map((x) => x.weight),
        limit?.maxWeight,
      )
      return invalidItemIndex === -1
    },
    ({ limit, items }) => {
      const invalidItemIndex = getInvalidFreightItemIndex(
        items.map((x) => x.weight),
        limit?.maxWeight,
      )
      return {
        path: ['items', invalidItemIndex, 'weight'],
        params: {
          ...error.numberValueIsNotWithinLimit,
          values: { min: '0', max: limit?.maxWeight },
        },
      }
    },
  )
  .refine(
    ({ exemptionPeriodType, limit, items }) => {
      // Since this field is validated in the pairing part for long-term
      if (exemptionPeriodType === ExemptionType.LONG_TERM) return true

      const invalidItemIndex = getInvalidFreightItemIndex(
        items.map((x) => x.height),
        limit?.maxHeight,
      )
      return invalidItemIndex === -1
    },
    ({ limit, items }) => {
      const invalidItemIndex = getInvalidFreightItemIndex(
        items.map((x) => x.height),
        limit?.maxHeight,
      )
      return {
        path: ['items', invalidItemIndex, 'height'],
        params: {
          ...error.numberValueIsNotWithinLimit,
          values: { min: '0', max: limit?.maxHeight },
        },
      }
    },
  )
  .refine(
    ({ exemptionPeriodType, limit, items }) => {
      // Since this field is validated in the pairing part for long-term
      if (exemptionPeriodType === ExemptionType.LONG_TERM) return true

      const invalidItemIndex = getInvalidFreightItemIndex(
        items.map((x) => x.width),
        limit?.maxWidth,
      )
      return invalidItemIndex === -1
    },
    ({ limit, items }) => {
      const invalidItemIndex = getInvalidFreightItemIndex(
        items.map((x) => x.width),
        limit?.maxWidth,
      )
      return {
        path: ['items', invalidItemIndex, 'width'],
        params: {
          ...error.numberValueIsNotWithinLimit,
          values: { min: '0', max: limit?.maxWidth },
        },
      }
    },
  )
  .refine(
    ({ exemptionPeriodType, limit, items }) => {
      // Since this field is validated in the pairing part for long-term
      if (exemptionPeriodType === ExemptionType.LONG_TERM) return true

      const invalidItemIndex = getInvalidFreightItemIndex(
        items.map((x) => x.totalLength),
        limit?.maxTotalLength,
      )
      return invalidItemIndex === -1
    },
    ({ limit, items }) => {
      const invalidItemIndex = getInvalidFreightItemIndex(
        items.map((x) => x.totalLength),
        limit?.maxTotalLength,
      )
      return {
        path: ['items', invalidItemIndex, 'totalLength'],
        params: {
          ...error.numberValueIsNotWithinLimit,
          values: { min: '0', max: limit?.maxTotalLength },
        },
      }
    },
  )

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
  .refine(
    ({ exemptionPeriodType, limit, items }) => {
      // Since this field is validated in the pairing part for long-term
      if (exemptionPeriodType !== ExemptionType.LONG_TERM) return true

      const invalidItemIndex = getInvalidFreightItemIndex(
        items.map((x) => x?.height),
        limit?.maxHeight,
      )
      return invalidItemIndex === -1
    },
    ({ limit, items }) => {
      const invalidItemIndex = getInvalidFreightItemIndex(
        items.map((x) => x?.height),
        limit?.maxHeight,
      )
      return {
        path: ['items', invalidItemIndex, 'height'],
        params: {
          ...error.numberValueIsNotWithinLimit,
          values: { min: '0', max: limit?.maxHeight },
        },
      }
    },
  )
  .refine(
    ({ exemptionPeriodType, limit, items }) => {
      // Since this field is validated in the pairing part for long-term
      if (exemptionPeriodType !== ExemptionType.LONG_TERM) return true

      const invalidItemIndex = getInvalidFreightItemIndex(
        items.map((x) => x?.width),
        limit?.maxWidth,
      )
      return invalidItemIndex === -1
    },
    ({ limit, items }) => {
      const invalidItemIndex = getInvalidFreightItemIndex(
        items.map((x) => x?.width),
        limit?.maxWidth,
      )
      return {
        path: ['items', invalidItemIndex, 'width'],
        params: {
          ...error.numberValueIsNotWithinLimit,
          values: { min: '0', max: limit?.maxWidth },
        },
      }
    },
  )
  .refine(
    ({ exemptionPeriodType, limit, items }) => {
      // Since this field is validated in the pairing part for long-term
      if (exemptionPeriodType !== ExemptionType.LONG_TERM) return true

      const invalidItemIndex = getInvalidFreightItemIndex(
        items.map((x) => x?.totalLength),
        limit?.maxTotalLength,
      )
      return invalidItemIndex === -1
    },
    ({ limit, items }) => {
      const invalidItemIndex = getInvalidFreightItemIndex(
        items.map((x) => x?.totalLength),
        limit?.maxTotalLength,
      )
      return {
        path: ['items', invalidItemIndex, 'totalLength'],
        params: {
          ...error.numberValueIsNotWithinLimit,
          values: { min: '0', max: limit?.maxTotalLength },
        },
      }
    },
  )

const AxleSpacingSchema = z
  .object({
    exemptionPeriodType: z.string(),
    dollyType: z.nativeEnum(DollyType),
    convoyId: z.string(),
    vehicle: z.array(z.string().min(1)),
    dolly: z.array(z.string()).optional(),
    trailer: z.array(z.string().optional()),
    useSameSpacingForTrailer: z.array(z.enum([YES])).optional(),
  })
  .refine(
    ({ exemptionPeriodType, dollyType, dolly }) => {
      // Since dolly is only allowed in short-term
      if (exemptionPeriodType !== ExemptionType.SHORT_TERM) return true
      // Since there is only axle space for double dolly
      if (dollyType !== DollyType.DOUBLE) return true

      return !!dolly?.[0]
    },
    { path: ['dolly', '0'] },
  )
  .refine(
    ({ trailer }) => {
      return !!trailer?.[0]
    },
    { path: ['trailer', '0'] },
  )
  .superRefine((data, ctx) => {
    if (data.useSameSpacingForTrailer?.includes(YES)) {
      if (!data.trailer?.[0]) {
        ctx.addIssue({
          path: ['trailer', 0],
          code: z.ZodIssueCode.custom,
          params: coreErrorMessages.defaultError,
        })
      }
    } else {
      data.trailer?.forEach((item, index) => {
        if (!item) {
          ctx.addIssue({
            path: ['trailer', index],
            code: z.ZodIssueCode.custom,
            params: coreErrorMessages.defaultError,
          })
        }
      })
    }
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
  axleSpacing: z.array(AxleSpacingSchema),
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
