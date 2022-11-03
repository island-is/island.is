import { z } from 'zod'
import { error } from './error'
import { APPLICATION_TYPES, NO, OPERATION_CATEGORY, YES } from './constants'
import {
  isValid24HFormatTime,
  isValidEmail,
  isValidPhoneNumber,
  isValidVskNr,
  validateApplicationInfoCategory,
} from './utils'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const TimeRefine = z.object({
  from: z.string().refine((x) => (x ? isValid24HFormatTime(x) : false), {
    params: error.invalidValue,
  }),
  to: z.string().refine((x) => (x ? isValid24HFormatTime(x) : false), {
    params: error.invalidValue,
  }),
})

const OpeningHoursRefine = z.object({
  weekdays: TimeRefine,
  weekends: TimeRefine,
})

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

const refineOpeningHours = (oh: OpeningHours): boolean => {
  try {
    OpeningHoursRefine.parse(oh)
    return true
  } catch (e) {
    return false
  }
}

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicationInfo: z
    .object({
      operation: z.enum([APPLICATION_TYPES.HOTEL, APPLICATION_TYPES.RESTURANT]),
      hotel: z
        .object({
          type: z.string().optional(),
          category: z
            .array(z.enum([OPERATION_CATEGORY.ONE, OPERATION_CATEGORY.TWO]))
            .optional(),
        })
        .optional(),
      resturant: z
        .object({
          type: z.string().optional(),
          category: z
            .enum([OPERATION_CATEGORY.ONE, OPERATION_CATEGORY.TWO, ''])
            .optional(),
        })
        .optional(),
    })
    .partial()
    // Check category
    .refine(
      ({ operation, hotel, resturant }) =>
        (operation === APPLICATION_TYPES.HOTEL &&
          validateApplicationInfoCategory({ operation, hotel, resturant })) ||
        (operation === APPLICATION_TYPES.RESTURANT &&
          validateApplicationInfoCategory({ operation, hotel, resturant })),
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
          (!!hotel?.type || !hotel?.type) &&
          !!resturant?.type),
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
    operationName: z.string().min(1),
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
  openingHours: z
    .object({
      alcohol: OpeningHours,
      willServe: z.array(z.enum([YES, NO])).nonempty(),
      outside: OpeningHours.optional(),
    })
    .partial()
    .refine(
      ({ alcohol, willServe, outside }) => {
        return (
          (willServe?.includes(YES) &&
            refineOpeningHours(alcohol) &&
            refineOpeningHours(outside)) ||
          (!willServe?.includes(YES) &&
            refineOpeningHours(alcohol) &&
            (outside
              ? refineOpeningHours(outside) || !refineOpeningHours(outside)
              : true))
        )
      },
      {
        message: error.openingHours.defaultMessage,
        path: ['willServe'],
      },
    ),
  temporaryLicense: z.array(z.enum([YES, NO])).nonempty(),
  debtClaim: z.array(z.enum([YES, NO])).nonempty(),
  otherInfoText: z.string().optional(),
  attachments: z.object({
    healthLicense: z.object({
      file: z
        .array(FileSchema)
        .refine((v) => v.length > 0, { params: error.invalidValue }),
    }),
    formerLicenseHolderConfirmation: z.object({
      file: z
        .array(FileSchema)
        .refine((v) => v.length > 0, { params: error.invalidValue }),
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
  }),
  chargeItemCode: z.string(),
})
