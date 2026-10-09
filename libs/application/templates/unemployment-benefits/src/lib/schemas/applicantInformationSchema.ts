import { z } from 'zod'
import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { YES } from '@island.is/application/core'
import { serviceErrors } from '../messages'

const isValidPhoneNumber = (phoneNumber: string) =>
  !!parsePhoneNumberFromString(phoneNumber)?.isValid()

export const applicantInformationSchema = z
  .object({
    nationalId: z
      .string()
      .refine(
        (nationalId) =>
          nationalId &&
          nationalId.length !== 0 &&
          kennitala.isValid(nationalId),
      ),
    name: z.string(),
    address: z.string(),
    city: z.string(),
    postalCode: z.string(),
    email: z.string(),
    phoneNumber: z.string().refine(isValidPhoneNumber, {
      params: serviceErrors.phoneNumberError,
    }),
    password: z.string().min(4),
    otherAddressCheckbox: z.array(z.string()).optional(),
    otherAddress: z.string().optional(),
    otherPostcode: z.string().optional().nullable(),
  })
  .refine(
    ({ otherAddressCheckbox, otherAddress }) => {
      if (otherAddressCheckbox && otherAddressCheckbox[0] === YES) {
        return !!otherAddress
      }
      return true
    },
    {
      path: ['otherAddress'],
    },
  )
  .refine(
    ({ otherAddressCheckbox, otherPostcode }) => {
      if (otherAddressCheckbox && otherAddressCheckbox[0] === YES) {
        return !!otherPostcode
      }
      return true
    },
    {
      path: ['otherPostcode'],
    },
  )
