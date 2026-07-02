import { z } from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { errorMessages } from './messages'

const validatePhoneNumber = (value: string) => {
  const phoneNumber = parsePhoneNumberFromString(value, 'IS')
  return phoneNumber && phoneNumber.isValid()
}

const phoneNumberSchema = z
  .string()
  .refine((value) => validatePhoneNumber(value), {
    params: errorMessages.phoneNumber,
  })

const serviceProviderSchema = z.object({
  service: z.string(),
  serviceType: z.string(),
  contactPersonWorkEmail: z.string().email(),
  contactPersonWorkPhone: phoneNumberSchema,
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  serviceProvider: serviceProviderSchema,
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
