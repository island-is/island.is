import { z } from 'zod'
import * as kennitala from 'kennitala'
import { YES } from '@island.is/application/core'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { ExemptionType } from '../shared'

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

export const TransporterSchema = z
  .intersection(
    ResponsiblePersonSchema,
    z.object({
      address: z.string().optional(),
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
})

export type ExemptionForTransportation = z.TypeOf<
  typeof ExemptionForTransportationSchema
>
