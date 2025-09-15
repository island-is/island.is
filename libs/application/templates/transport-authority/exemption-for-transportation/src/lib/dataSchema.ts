import { z } from 'zod'
import * as kennitala from 'kennitala'
import {
  coreErrorMessages,
  EMAIL_REGEX,
  YES,
} from '@island.is/application/core'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { DollyType, ExemptionFor, ExemptionType, RegionArea } from '../shared'
import { error } from './messages'

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return !!phone && phone.isValid()
}

const isValidEmail = (value: string) => EMAIL_REGEX.test(value)

const ApplicantSchema = z.object({
  nationalId: z
    .string()
    .refine((nationalId) => nationalId && kennitala.isValid(nationalId)),
  name: z.string().min(1),
  email: z.string().refine((v) => isValidEmail(v)),
  phoneNumber: z.string().refine((v) => isValidPhoneNumber(v)),
})

const ResponsiblePersonSchema = z
  .object({
    shouldShow: z.boolean(),
    isSameAsApplicant: z.array(z.enum([YES])).optional(),
    nationalId: z.string().optional(),
    name: z.string().optional(),
    email: z
      .string()
      .optional()
      .refine((v) => !v || isValidEmail(v)),
    phone: z
      .string()
      .optional()
      .refine((v) => !v || isValidPhoneNumber(v)),
  })
  .refine(
    ({ shouldShow, isSameAsApplicant, nationalId }) => {
      if (!shouldShow || isSameAsApplicant?.includes(YES)) return true
      return nationalId && kennitala.isValid(nationalId)
    },
    { path: ['nationalId'] },
  )
  .refine(
    ({ shouldShow, isSameAsApplicant, name }) => {
      if (!shouldShow || isSameAsApplicant?.includes(YES)) return true
      return !!name
    },
    { path: ['name'] },
  )
  .refine(
    ({ shouldShow, isSameAsApplicant, email }) => {
      if (!shouldShow || isSameAsApplicant?.includes(YES)) return true
      return !!email
    },
    { path: ['email'] },
  )
  .refine(
    ({ shouldShow, isSameAsApplicant, phone }) => {
      if (!shouldShow || isSameAsApplicant?.includes(YES)) return true
      return !!phone
    },
    { path: ['phone'] },
  )

const TransporterSchema = z
  .object({
    isSameAsApplicant: z.array(z.enum([YES])).optional(),
    nationalId: z.string().optional(),
    name: z.string().optional(),
    email: z
      .string()
      .optional()
      .refine((v) => !v || isValidEmail(v)),
    phone: z
      .string()
      .optional()
      .refine((v) => !v || isValidPhoneNumber(v)),
    address: z.string().max(100).optional(),
    postalCodeAndCity: z.string().optional(),
  })
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
      // Note: this field is actually required, but setting as optional so it is possible to use onSubmitLoad in tableRepeater
      convoyId: z.string().optional(),
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
    // Note: we are only saving limit in answers to be able to display
    // pretty zod error message (without the usage of custom component)
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
      }),
    ),
  })
  .superRefine(({ items, limit }, ctx) => {
    if (!limit) return

    const keysToCheck: {
      key: keyof NonNullable<typeof items[number]>
      limitKey: keyof NonNullable<typeof limit>
    }[] = [
      { key: 'length', limitKey: 'maxLength' },
      { key: 'weight', limitKey: 'maxWeight' },
    ]

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
    // Note: we are only saving limit in answers to be able to display
    // pretty zod error message (without the usage of custom component)
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
          // Note: these fields need to be nullable in case convoy is selected in dropdown
          // and then removed without filling in all fields
          height: z.string().nullable(),
          width: z.string().nullable(),
          totalLength: z.string().nullable(),
          exemptionFor: z
            .array(z.nativeEnum(ExemptionFor).nullable())
            .optional()
            .nullable(),
        })
        // Note: need to be optional/nullable, since there can be items/convoys in between that are not selected and therefor undefined/null
        // (needs to be optional for zod validation, and nullable for graphql validation)
        .optional()
        .nullable(),
    ),
  })
  .superRefine(({ limit, items, convoyIdList }, ctx) => {
    if (!items) return

    items.forEach((item, index) => {
      if (!item) return

      const shouldValidateFields = convoyIdList.includes(item.convoyId)
      if (!shouldValidateFields) return

      // Limit check
      if (!limit) return
      const keysToCheck: {
        key: keyof typeof item
        limitKey: keyof typeof limit
      }[] = [
        { key: 'height', limitKey: 'maxHeight' },
        { key: 'width', limitKey: 'maxWidth' },
        { key: 'totalLength', limitKey: 'maxTotalLength' },
      ]
      keysToCheck.forEach(({ key, limitKey }) => {
        const max = limit[limitKey]
        if (max === undefined) return
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

      // Required field checks
      const fields = [
        { key: 'height', value: item.height },
        { key: 'width', value: item.width },
        { key: 'totalLength', value: item.totalLength },
      ]
      fields.forEach(({ key, value }) => {
        if (!value || value.trim() === '') {
          ctx.addIssue({
            path: ['items', index, key],
            code: z.ZodIssueCode.custom,
            params: coreErrorMessages.defaultError,
          })
        }
      })
      if (!item.exemptionFor?.length) {
        ctx.addIssue({
          path: ['items', index, 'exemptionFor'],
          code: z.ZodIssueCode.custom,
          params: coreErrorMessages.defaultError,
        })
      }
    })
  })

const AxleSpacingSchema = z
  .object({
    hasExemptionForWeight: z.boolean(),
    exemptionPeriodType: z.string(),
    vehicleList: z.array(
      z.object({
        permno: z.string(),
        values: z.array(z.string().min(1)),
      }),
    ),
    // Note: Not array, since dolly is only allowed in short-term where there is max one convoy
    dolly: z.object({
      type: z.nativeEnum(DollyType).optional(),
      value: z.string().optional(),
    }),
    trailerList: z.array(
      z.object({
        useSameValues: z.array(z.enum([YES])).optional(),
        permno: z.string(),
        values: z.array(z.string().optional()),
        singleValue: z.string().optional(),
        axleCount: z.number().optional(),
      }),
    ),
  })
  .refine(
    ({ hasExemptionForWeight, exemptionPeriodType, dolly, trailerList }) => {
      if (!hasExemptionForWeight) return true

      // Since dolly is only allowed in short-term
      if (exemptionPeriodType !== ExemptionType.SHORT_TERM) return true

      // Since dolly can only be included if there is a trailer
      const hasTrailer = trailerList.some((x) => !!x.permno)
      if (!hasTrailer) return true

      // Since there is only axle space for double dolly
      if (dolly.type !== DollyType.DOUBLE) return true

      return !!dolly?.value
    },
    { path: ['dolly', 'value'] },
  )
  .superRefine((data, ctx) => {
    if (!data.hasExemptionForWeight) return

    data.trailerList.forEach((trailer, index) => {
      if (!trailer.permno) return

      const useSame = trailer.useSameValues?.includes(YES)

      if (useSame && !trailer.singleValue) {
        ctx.addIssue({
          path: ['trailerList', index, 'singleValue'],
          code: z.ZodIssueCode.custom,
          params: coreErrorMessages.defaultError,
        })
      } else if (!useSame && trailer.values) {
        trailer.values.forEach((value, valueIndex) => {
          if (!value) {
            ctx.addIssue({
              path: ['trailerList', index, 'values', valueIndex],
              code: z.ZodIssueCode.custom,
              params: coreErrorMessages.defaultError,
            })
          }
        })
      }
    })
  })

const VehicleSpacingSchema = z
  .object({
    hasExemptionForWeight: z.boolean(),
    exemptionPeriodType: z.string(),
    convoyList: z.array(
      z.object({
        convoyId: z.string(),
        hasTrailer: z.boolean(),
        dollyType: z.nativeEnum(DollyType).optional(),
        vehicleToDollyValue: z.string().optional(),
        dollyToTrailerValue: z.string().optional(),
        vehicleToTrailerValue: z.string().optional(),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    if (!data.hasExemptionForWeight) return

    data.convoyList.forEach((convoy, index) => {
      if (!convoy.hasTrailer) return

      const hasDolly =
        data.exemptionPeriodType === ExemptionType.SHORT_TERM &&
        (convoy.dollyType === DollyType.SINGLE ||
          convoy.dollyType === DollyType.DOUBLE)

      if (hasDolly && !convoy.vehicleToDollyValue) {
        ctx.addIssue({
          path: ['convoyList', index, 'vehicleToDollyValue'],
          code: z.ZodIssueCode.custom,
          params: coreErrorMessages.defaultError,
        })
      } else if (hasDolly && !convoy.dollyToTrailerValue) {
        ctx.addIssue({
          path: ['convoyList', index, 'dollyToTrailerValue'],
          code: z.ZodIssueCode.custom,
          params: coreErrorMessages.defaultError,
        })
      } else if (!hasDolly && !convoy.vehicleToTrailerValue) {
        ctx.addIssue({
          path: ['convoyList', index, 'vehicleToTrailerValue'],
          code: z.ZodIssueCode.custom,
          params: coreErrorMessages.defaultError,
        })
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
        regions: z.array(z.nativeEnum(RegionArea)).optional().nullable(),
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
  // Note: Needs to be nullable, since we are updating each freightPairing index separately,
  // per subsection, and then all items in the array before the selected subsection is null
  freightPairing: z.array(FreightPairingSchema.nullable()),
  axleSpacing: AxleSpacingSchema,
  vehicleSpacing: VehicleSpacingSchema,
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
