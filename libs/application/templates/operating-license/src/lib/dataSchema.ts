import * as z from 'zod'
import { error } from './error'
import { APPLICATION_TYPES, NO, OPERATION_CATEGORY, YES } from './constants'
import {
  hasYes,
  isValid24HFormatTime,
  isValidEmail,
  isValidPhoneNumber,
  isValidVskNr,
} from './utils'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const Time = z.object({
  from: z.string().refine((x) => (x ? isValid24HFormatTime(x) : false), {
    params: error.invalidValue,
  }),
  to: z.string().refine((x) => (x ? isValid24HFormatTime(x) : false), {
    params: error.invalidValue,
  }),
})

const OpeningHours = z.object({
  weekdays: Time,
  weekends: Time,
})

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
    alcohol: OpeningHours,
    willServe: z.array(z.enum([YES, NO])).nonempty(),
    outside: OpeningHours.optional(),
  }),
  temporaryLicense: z.array(z.enum([YES, NO])).nonempty(),
  debtClaim: z.array(z.enum([YES, NO])).nonempty(),
  otherInfoText: z.string().optional(),
  attachments: z
    .array(FileSchema)
    .refine((v) => v.length >= 3, { params: error.attachments }),
})
