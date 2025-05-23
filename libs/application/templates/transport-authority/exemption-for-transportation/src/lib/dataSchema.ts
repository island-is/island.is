import { z } from 'zod'
import * as kennitala from 'kennitala'
import { YES } from '@island.is/application/core'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { ExemptionFor, ExemptionType } from '../shared'
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

const FreightItemSchema = z.object({
  name: z.string().min(1).max(100),
  length: z.string(),
  weight: z.string(),
  height: z.string().optional(),
  width: z.string().optional(),
  totalLength: z.string().optional(),
  exemptionFor: z.array(z.nativeEnum(ExemptionFor)).optional(),
})

const getInvalidFreightItemIndex = (
  values: (string | undefined)[],
  maxValue: number | undefined,
): number => {
  return values.findIndex(
    (x) =>
      x &&
      !(
        !isNaN(Number(x)) &&
        Number(x) > 0 &&
        (!maxValue || Number(x) <= maxValue)
      ),
  )
}

const FreighSchema = z
  .object({
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
    items: z.array(FreightItemSchema),
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
      if (exemptionPeriodType === ExemptionType.SHORT_TERM) return true

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
      if (exemptionPeriodType === ExemptionType.SHORT_TERM) return true

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
      if (exemptionPeriodType === ExemptionType.SHORT_TERM) return true

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

const ConvoyItemSchema = z.object({
  vehicle: z.object({
    permno: z.string().length(5),
    makeAndColor: z.string().min(1),
    hasError: z.boolean().refine((v) => v !== true),
  }),
  trailer: z
    .object({
      permno: z.string().optional(),
      makeAndColor: z.string().optional(),
      hasError: z
        .boolean()
        .refine((v) => v !== true)
        .optional(),
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
    .optional(),
})

const ConvoySchema = z.object({
  items: z.array(ConvoyItemSchema),
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
  freight: FreighSchema,
  convoy: ConvoySchema,
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
