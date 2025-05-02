import { z } from 'zod'
import { error } from './error'
import { ApplicationTypes, OperationCategory } from './constants'
import {
  isValid24HFormatTime,
  isValidEmail,
  isValidPhoneNumber,
  isValidVskNr,
  validateApplicationInfoCategory,
} from './utils'
import { m } from './messages'
import { NO, YES } from '@island.is/application/core'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const checkIfFilledOut = (arr: Array<string | undefined>) => {
  if (arr.every((v) => v === '')) {
    return false
  } else if (arr.every((v) => v !== '')) {
    return true
  } else {
    return false
  }
}

const Properties = z
  .object({
    propertyNumber: z.string(),
    address: z.string(),
    spaceNumber: z.string(),
    customerCount: z.string(),
  })
  .refine(
    ({ propertyNumber, address, spaceNumber, customerCount }) => {
      return checkIfFilledOut([
        propertyNumber,
        address,
        spaceNumber,
        customerCount,
      ])
    },
    { params: error.invalidValue },
  )
  .array()

const Time = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
})

const OpeningHours = z
  .object({
    weekdays: Time.optional(),
    weekends: Time.optional(),
  })
  .optional()

type OpeningHours = z.infer<typeof OpeningHours>
type Time = z.infer<typeof Time>

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicationInfo: z
    .object({
      operation: z.enum([ApplicationTypes.HOTEL, ApplicationTypes.RESTURANT]),
      typeHotel: z.string().optional(),
      typeResturant: z.array(z.string()).optional(),
      category: z.enum([
        OperationCategory.TWO,
        OperationCategory.THREE,
        OperationCategory.FOUR,
      ]),
      willServe: z.array(z.enum([YES, NO])).optional(),
    })
    .partial()
    // Check category
    .refine(
      ({ operation, category }) =>
        (operation === ApplicationTypes.HOTEL &&
          validateApplicationInfoCategory({ operation, category })) ||
        (operation === ApplicationTypes.RESTURANT &&
          validateApplicationInfoCategory({ operation, category })),
      {
        message: error.invalidValue.defaultMessage,
        path: ['category'],
      },
    )
    // Check type for hotel
    .refine(
      ({ operation, typeHotel }) =>
        (operation === ApplicationTypes.HOTEL && !!typeHotel) ||
        operation === ApplicationTypes.RESTURANT,
      {
        message: error.invalidValue.defaultMessage,
        path: ['typeHotel'],
      },
    )
    // Check type for resturant
    .refine(
      ({ operation, typeResturant }) =>
        operation === ApplicationTypes.HOTEL ||
        (operation === ApplicationTypes.RESTURANT &&
          typeResturant?.length &&
          typeResturant?.length > 0),
      {
        message: error.invalidValue.defaultMessage,
        path: ['typeResturant'],
      },
    )

    // check operation
    .refine(({ operation }) => !!operation, {
      message: error.invalidValue.defaultMessage,
      path: ['operation'],
    }),

  info: z.object({
    operationName: z.string().min(1),
    vskNr: z
      .string()
      .refine((v) => isValidVskNr(v), { params: m.vskNrInvalid }),
    email: z
      .string()
      .refine((v) => isValidEmail(v), { params: error.invalidValue }),
    phoneNumber: z
      .string()
      .min(7)
      .refine((v) => isValidPhoneNumber(v), { params: error.invalidValue }),
  }),
  properties: z.object({
    stay: Properties.optional(),
    dining: Properties.optional(),
    outside: Properties.optional(),
  }),
  openingHours: z
    .object({
      alcohol: OpeningHours,
      willServe: z.array(z.enum([YES, NO])).nonempty(),
      outside: OpeningHours.optional(),
    })
    .partial()
    .refine(
      ({ alcohol }) => isValid24HFormatTime(alcohol?.weekdays?.from ?? ''),
      {
        message: error.hoursFormat.defaultMessage,
        path: ['alcohol', 'weekdays', 'from'],
      },
    )
    .refine(
      ({ alcohol }) => isValid24HFormatTime(alcohol?.weekdays?.to ?? ''),
      {
        message: error.hoursFormat.defaultMessage,
        path: ['alcohol', 'weekdays', 'to'],
      },
    )
    .refine(
      ({ alcohol }) => isValid24HFormatTime(alcohol?.weekends?.from ?? ''),
      {
        message: error.hoursFormat.defaultMessage,
        path: ['alcohol', 'weekends', 'from'],
      },
    )
    .refine(
      ({ alcohol }) => isValid24HFormatTime(alcohol?.weekends?.to ?? ''),
      {
        message: error.hoursFormat.defaultMessage,
        path: ['alcohol', 'weekends', 'to'],
      },
    )
    .refine(
      ({ outside, willServe }) => {
        if (willServe?.includes(YES)) {
          return isValid24HFormatTime(outside?.weekdays?.from ?? '')
        }
        return true
      },
      {
        message: error.hoursFormat.defaultMessage,
        path: ['outside', 'weekdays', 'from'],
      },
    )
    .refine(
      ({ outside, willServe }) => {
        if (willServe?.includes(YES)) {
          return isValid24HFormatTime(outside?.weekdays?.to ?? '')
        }
        return true
      },
      {
        message: error.hoursFormat.defaultMessage,
        path: ['outside', 'weekdays', 'to'],
      },
    )
    .refine(
      ({ outside, willServe }) => {
        if (willServe?.includes(YES)) {
          return isValid24HFormatTime(outside?.weekends?.from ?? '')
        }
        return true
      },
      {
        message: error.hoursFormat.defaultMessage,
        path: ['outside', 'weekends', 'from'],
      },
    )
    .refine(
      ({ outside, willServe }) => {
        if (willServe?.includes(YES)) {
          return isValid24HFormatTime(outside?.weekends?.to ?? '')
        }
        return true
      },
      {
        message: error.hoursFormat.defaultMessage,
        path: ['outside', 'weekends', 'to'],
      },
    ),

  temporaryLicense: z.array(z.enum([YES, NO])).optional(),
  debtClaim: z.array(z.enum([YES, NO])).optional(),
  otherInfoText: z.string().optional(),
  attachments: z.object({
    healthLicense: z.object({
      file: z.array(FileSchema).optional(),
    }),
    formerLicenseHolderConfirmation: z.object({
      file: z.array(FileSchema).optional(),
    }),
    houseBlueprints: z.object({
      file: z
        .array(FileSchema)
        .refine((v) => v.length > 0, { params: error.invalidValue }),
    }),
    outsideBlueprints: z
      .object({
        file: z.array(FileSchema),
      })
      .optional(),
    otherFiles: z
      .object({
        file: z.array(FileSchema),
      })
      .optional(),
  }),
  chargeItemCode: z.string(),
})
