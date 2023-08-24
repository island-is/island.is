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
import { m } from './messages'

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
      typeHotel: z.string().optional(),
      typeResturant: z.array(z.string()).optional(),
      category: z.enum([
        OPERATION_CATEGORY.TWO,
        OPERATION_CATEGORY.THREE,
        OPERATION_CATEGORY.FOUR,
      ]),
      willServe: z.array(z.enum([YES, NO])).optional(),
    })
    .partial()
    // Check category
    .refine(
      ({ operation, category }) =>
        (operation === APPLICATION_TYPES.HOTEL &&
          validateApplicationInfoCategory({ operation, category })) ||
        (operation === APPLICATION_TYPES.RESTURANT &&
          validateApplicationInfoCategory({ operation, category })),
      {
        message: error.invalidValue.defaultMessage,
        path: ['category'],
      },
    )
    // Check type for hotel
    .refine(
      ({ operation, typeHotel }) =>
        (operation === APPLICATION_TYPES.HOTEL && !!typeHotel) ||
        operation === APPLICATION_TYPES.RESTURANT,
      {
        message: error.invalidValue.defaultMessage,
        path: ['typeHotel'],
      },
    )
    // Check type for resturant
    .refine(
      ({ operation, typeResturant }) =>
        operation === APPLICATION_TYPES.HOTEL ||
        (operation === APPLICATION_TYPES.RESTURANT &&
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
