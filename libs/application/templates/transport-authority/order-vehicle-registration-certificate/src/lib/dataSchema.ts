import { z } from 'zod'
import { YES, coreErrorMessages } from '@island.is/application/core'
import { getCountryByCode } from '@island.is/shared/utils'

const REQUIRED_ADDRESS_FIELDS = [
  'name',
  'address1',
  'postalCode',
  'city',
  'country',
] as const

const ADDRESS_MAX_LENGTHS = {
  name: 100,
  address1: 100,
  address2: 100,
  apartment: 20,
  postalCode: 20,
  city: 100,
} as const

const SendToAddressSchema = z
  .object({
    useOtherAddress: z.array(z.string()).optional(),
    name: z.string().optional(),
    address1: z.string().optional(),
    address2: z.string().optional(),
    apartment: z.string().optional(),
    postalCode: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.useOtherAddress?.includes(YES)) {
      return
    }

    REQUIRED_ADDRESS_FIELDS.forEach((key) => {
      if (!data[key]?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [key],
          params: coreErrorMessages.missingAnswer,
        })
      }
    })

    Object.entries(ADDRESS_MAX_LENGTHS).forEach(([key, max]) => {
      const value = data[key as keyof typeof ADDRESS_MAX_LENGTHS]
      if ((value?.length ?? 0) > max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [key],
          params: coreErrorMessages.defaultError,
        })
      }
    })

    if (data.country && !getCountryByCode(data.country)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['country'],
        params: coreErrorMessages.defaultError,
      })
    }
  })

export const OrderVehicleRegistrationCertificateSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  pickVehicle: z.object({
    vehicle: z.string().optional(),
    plate: z.string().min(1),
  }),
  vehicle: z.object({
    plate: z.string(),
    type: z.string(),
  }),
  sendToAddress: SendToAddressSchema.optional(),
})

export type OrderVehicleRegistrationCertificate = z.TypeOf<
  typeof OrderVehicleRegistrationCertificateSchema
>
