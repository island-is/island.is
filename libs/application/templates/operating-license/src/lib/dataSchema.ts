import * as z from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { error } from './error'
import { APPLICATION_TYPES, OPERATION_CATEGORY, YES } from './constants'

const nationalIdRegex = /([0-9]){6}-?([0-9]){4}/
const vskNrRegex = /([0-9]){6}/
const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
const timeRegex = /^$|^(([01][0-9])|(2[0-3])):[0-5][0-9]$/
const isValidEmail = (value: string) => emailRegex.test(value)
const isValidVskNr = (value: string) => vskNrRegex.test(value)
const isValidTime = (value: string) => timeRegex.test(value)
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
  openingHours: z.object({
    alcohol: z.object({
      weekdays: z.object({
        from: z.string(),
        // .refine((v) => isValidTime(v), { params: error.invalidValue }),
        to: z.string(),
        // .refine((v) => isValidTime(v), { params: error.invalidValue }),
      }),
      holidays: z.object({
        from: z.string(),
        // .refine((v) => isValidTime(v), { params: error.invalidValue }),
        to: z.string(),
        // .refine((v) => isValidTime(v), { params: error.invalidValue }),
      }),
    }),
    willServe: z.enum([YES]).optional(),
    outside: z
      .object({
        weekdays: z.object({
          from: z.string().optional(),
          // .refine((v) => isValidTime(v), { params: error.invalidValue }),
          to: z.string().optional(),
          // .refine((v) => isValidTime(v), { params: error.invalidValue }),
        }),
        holidays: z.object({
          from: z.string().optional(),
          // .refine((v) => isValidTime(v), { params: error.invalidValue }),
          to: z.string().optional(),
          // .refine((v) => isValidTime(v), { params: error.invalidValue }),
        }),
      })
      .optional(),
  }),
  temporaryLicense: z.enum([YES]).optional(),
  debtClaim: z.enum([YES]).optional(),
  otherInfoText: z.string().optional(),
})

export type PassportSchema = z.TypeOf<typeof dataSchema>
