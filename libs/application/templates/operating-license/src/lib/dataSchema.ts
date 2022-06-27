import * as z from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { error } from './error'
import { APPLICATION_TYPES, OPERATION_CATEGORY } from './constants'

const nationalIdRegex = /([0-9]){6}-?([0-9]){4}/
const vskNrRegex = /([0-9]){6}/
const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
const isValidEmail = (value: string) => emailRegex.test(value)
const isValidVskNr = (value: string) => vskNrRegex.test(value)
const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicationInfo: z
    .object({
      operation: z.enum([APPLICATION_TYPES.HOTEL, APPLICATION_TYPES.RESTURANT]),
      hotel: z.object({
        type: z.string().nonempty(),
        category: z
          .array(z.enum([OPERATION_CATEGORY.ONE, OPERATION_CATEGORY.TWO]))
          .optional(),
      }),
      resturant: z.object({
        type: z.string().nonempty(),
        category: z.enum([OPERATION_CATEGORY.ONE, OPERATION_CATEGORY.TWO]),
      }),
    })
    .partial()
    // Check category
    .refine(
      ({ operation, hotel, resturant }) =>
        (operation === APPLICATION_TYPES.HOTEL &&
          (!!resturant?.category || !resturant?.category)) ||
        (operation === APPLICATION_TYPES.RESTURANT &&
          !!resturant?.category &&
          resturant?.category?.length === 1),
      {
        message: error.invalidValue.defaultMessage,
        path: ['resturant', 'category'],
      },
    )
    // Check type for hotel
    .refine(
      ({ operation, hotel, resturant }) =>
        (operation === APPLICATION_TYPES.HOTEL &&
          (!!resturant?.type || !resturant?.type) &&
          !!hotel?.type) ||
        (operation === APPLICATION_TYPES.RESTURANT &&
          (!!hotel?.type || !hotel?.type)),
      { message: error.invalidValue.defaultMessage, path: ['hotel', 'type'] },
    )
    // Check type for resturant
    .refine(
      ({ operation, hotel, resturant }) =>
        (operation === APPLICATION_TYPES.HOTEL &&
          (!!resturant?.type || !resturant?.type)) ||
        (operation === APPLICATION_TYPES.RESTURANT &&
          (!!hotel?.type || !hotel?.type) &&
          !!resturant?.type),
      {
        message: error.invalidValue.defaultMessage,
        path: ['resturant', 'type'],
      },
    )
    // check operation
    .refine(({ operation }) => !!operation, {
      message: error.invalidValue.defaultMessage,
      path: ['operation'],
    }),

  info: z.object({
    operationName: z.string().nonempty(),
    vskNr: z
      .string()
      .refine((v) => isValidVskNr(v), { params: error.invalidValue }),
    email: z
      .string()
      .refine((v) => isValidEmail(v), { params: error.invalidValue }),
    phoneNumber: z
      .string()
      .min(7)
      .refine((v) => isValidPhoneNumber(v), { params: error.invalidValue }),
  }),
  properties: z
    .object({
      propertyNumber: z.string(),
      address: z.string(),
      spaceNumber: z.string(),
      customerCount: z.string(),
    })
    .array(),
})

export type PassportSchema = z.TypeOf<typeof dataSchema>
