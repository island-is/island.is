import * as z from 'zod'
import * as kennitala from 'kennitala'
import { NO, YES } from './constants'
import {
  customZodError,
  isValidEmail,
  isValidPhoneNumber,
  isValidString,
  valueToNumber,
} from './utils/helpers'
import { m } from './messages'

const deceasedShare = {
  deceasedShare: z.string().optional(),
  deceasedShareEnabled: z.array(z.enum([YES])).optional(),
  deceasedShareAmount: z.number().optional(),
}

const validateDeceasedShare = ({
  deceasedShare,
  deceasedShareEnabled,
}: {
  deceasedShare: string | undefined
  deceasedShareEnabled: 'Yes'[] | undefined
}) => {
  if (
    Array.isArray(deceasedShareEnabled) &&
    deceasedShareEnabled.includes(YES)
  ) {
    const value = valueToNumber(deceasedShare)
    return value > 0 && value <= 100
  }

  return true
}

const assetSchema = ({ withShare }: { withShare?: boolean } = {}) =>
  z
    .object({
      data: z
        .object({
          assetNumber: z.string(),
          description: z.string(),
          propertyValuation: z.string(),
          ...(withShare ? { share: z.string() } : {}),
          ...deceasedShare,
        })
        .refine(
          ({ propertyValuation }) => {
            return propertyValuation !== ''
          },
          {
            path: ['propertyValuation'],
          },
        )
        .refine(
          ({ assetNumber }) => {
            return isValidString(assetNumber)
          },
          {
            path: ['assetNumber'],
          },
        )
        .refine(
          ({ share = undefined }) => {
            if (withShare && typeof share === 'string') {
              const num = parseInt(share, 10)

              const value = isNaN(num) ? 0 : num

              return value >= 0 && value <= 100
            }

            return true
          },
          {
            path: ['share'],
          },
        )
        .refine(
          ({ description }) => {
            return isValidString(description)
          },
          {
            path: ['description'],
          },
        )
        .refine(
          ({ deceasedShare, deceasedShareEnabled }) => {
            return validateDeceasedShare({
              deceasedShare,
              deceasedShareEnabled,
            })
          },
          {
            path: ['deceasedShare'],
          },
        )
        .array()
        .optional(),
      total: z.number().optional(),
    })
    .optional()

const asset = assetSchema()
const assetWithShare = assetSchema({ withShare: true })

export const inheritanceReportSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),

  applicant: z.object({
    email: z.string().email(),
    phone: z.string().refine((v) => isValidPhoneNumber(v)),
    nationalId: z.string(),
    relation: z.string(),
  }),

  /* assets */
  assets: z.object({
    realEstate: assetWithShare,
    vehicles: asset,
    guns: asset,
    inventory: z
      .object({
        info: z.string().optional(),
        value: z.string().optional(),
        ...deceasedShare,
      })
      .refine(
        ({ deceasedShare, deceasedShareEnabled }) => {
          return validateDeceasedShare({
            deceasedShare,
            deceasedShareEnabled,
          })
        },
        {
          path: ['deceasedShare'],
        },
      )
      .optional(),
    bankAccounts: z
      .object({
        data: z
          .object({
            foreignBankAccount: z.array(z.enum([YES])).optional(),
            assetNumber: z.string().refine((v) => v),
            propertyValuation: z.string().refine((v) => v),
            exchangeRateOrInterest: z.string().refine((v) => v),
            ...deceasedShare,
          })
          .refine(
            ({ deceasedShare, deceasedShareEnabled }) => {
              return validateDeceasedShare({
                deceasedShare,
                deceasedShareEnabled,
              })
            },
            {
              path: ['deceasedShare'],
            },
          )
          .array()
          .optional(),
        total: z.number().optional(),
      })
      .optional(),
    claims: z
      .object({
        data: z
          .object({
            description: z.string(),
            assetNumber: z.string(),
            propertyValuation: z.string().refine((v) => v),
            ...deceasedShare,
          })
          .refine(
            ({ assetNumber }) => {
              return assetNumber && assetNumber !== ''
                ? kennitala.isValid(assetNumber)
                : true
            },
            {
              path: ['assetNumber'],
            },
          )
          .refine(
            ({ deceasedShare, deceasedShareEnabled }) => {
              return validateDeceasedShare({
                deceasedShare,
                deceasedShareEnabled,
              })
            },
            {
              path: ['deceasedShare'],
            },
          )
          .array()
          .optional(),
        total: z.number().optional(),
      })
      .optional(),
    stocks: z
      .object({
        data: z
          .object({
            description: z.string(),
            nationalId: z.string(),
            amount: z.string(),
            exchangeRateOrInterest: z.string(),
            value: z.string().refine((v) => v),
            ...deceasedShare,
          })
          .refine(
            ({ nationalId }) => {
              return nationalId === ''
                ? true
                : nationalId && kennitala.isValid(nationalId)
            },
            {
              params: m.errorNationalIdIncorrect,
              path: ['nationalId'],
            },
          )
          .refine(
            ({ deceasedShare, deceasedShareEnabled }) => {
              return validateDeceasedShare({
                deceasedShare,
                deceasedShareEnabled,
              })
            },
            {
              path: ['deceasedShare'],
            },
          )
          .array()
          .optional(),
        total: z.number().optional(),
      })
      .optional(),
    money: z
      .object({
        info: z.string().optional(),
        value: z.string().optional(),
        ...deceasedShare,
      })
      .refine(
        ({ deceasedShare, deceasedShareEnabled }) => {
          return validateDeceasedShare({
            deceasedShare,
            deceasedShareEnabled,
          })
        },
        {
          path: ['deceasedShare'],
        },
      )
      .optional(),
    otherAssets: z
      .object({
        data: z
          .object({
            info: z.string().optional(),
            value: z.string().optional(),
            ...deceasedShare,
          })
          .refine(
            ({ info }) => {
              return !!info
            },
            {
              path: ['info'],
            },
          )
          .refine(
            ({ value }) => {
              return !!value
            },
            {
              path: ['value'],
            },
          )
          .refine(
            ({ deceasedShare, deceasedShareEnabled }) => {
              return validateDeceasedShare({
                deceasedShare,
                deceasedShareEnabled,
              })
            },
            {
              path: ['deceasedShare'],
            },
          )
          .array()
          .optional(),
        total: z.number().optional(),
      })
      .optional(),
    assetsTotal: z.number().optional(),
  }),

  /* debts */
  debts: z.object({
    domesticAndForeignDebts: z
      .object({
        data: z
          .object({
            description: z.string(),
            nationalId: z.string(),
            assetNumber: z.string(),
            propertyValuation: z.string(),
          })
          .refine(
            ({ nationalId }) => {
              return nationalId === ''
                ? true
                : nationalId && kennitala.isValid(nationalId)
            },
            {
              params: m.errorNationalIdIncorrect,
              path: ['nationalId'],
            },
          )
          .refine(
            ({ description, nationalId, propertyValuation, assetNumber }) => {
              return nationalId !== '' ||
                description !== '' ||
                propertyValuation !== ''
                ? isValidString(assetNumber)
                : true
            },
            {
              path: ['assetNumber'],
            },
          )
          .refine(
            ({ description, nationalId, propertyValuation, assetNumber }) => {
              return nationalId !== '' ||
                description !== '' ||
                assetNumber !== ''
                ? isValidString(propertyValuation)
                : true
            },
            {
              path: ['propertyValuation'],
            },
          )
          .refine(
            ({ description, nationalId, propertyValuation, assetNumber }) => {
              return nationalId !== '' ||
                propertyValuation !== '' ||
                assetNumber !== ''
                ? isValidString(description)
                : true
            },
            {
              path: ['description'],
            },
          )
          .array()
          .optional(),
        total: z.number().optional(),
      })
      .optional(),
    publicCharges: z.string().optional(),
    debtsTotal: z.number().optional(),
  }),

  funeralCost: z
    .object({
      build: z.string().optional(),
      cremation: z.string().optional(),
      print: z.string().optional(),
      flowers: z.string().optional(),
      music: z.string().optional(),
      rent: z.string().optional(),
      food: z.string().optional(),
      tombstone: z.string().optional(),
      hasOther: z.array(z.enum([YES])).optional(),
      other: z.string().optional(),
      otherDetails: z.string().optional(),
      total: z.string().optional(),
    })
    .refine(
      ({ hasOther, other }) => {
        if (hasOther && hasOther.length > 0) {
          return !!other
        }

        return true
      },
      {
        path: ['other'],
      },
    )
    .refine(
      ({ hasOther, otherDetails }) => {
        if (hasOther && hasOther.length > 0) {
          return !!otherDetails
        }

        return true
      },
      {
        path: ['otherDetails'],
      },
    )
    .optional(),

  /* heirs */
  heirs: z.object({
    data: z
      .object({
        name: z.string(),
        relation: customZodError(z.string().min(1), m.errorRelation),
        nationalId: z.string().optional(),
        foreignCitizenship: z.string().array().min(0).max(1).optional(),
        dateOfBirth: z.string().optional(),
        initial: z.boolean(),
        enabled: z.boolean(),
        phone: z.string().optional(),
        email: z.string(),
        heirsPercentage: z.string().refine((v) => {
          if (!v) return true

          const num = parseInt(v, 10) ?? 0
          return num > -1 && num < 101
        }),
        taxFreeInheritance: z.string(),
        inheritance: z.string(),
        taxableInheritance: z.string(),
        inheritanceTax: z.string(),
        // Málsvari
        advocate: z
          .object({
            name: z.string().optional(),
            nationalId: z.string().optional(),
            phone: z.string().optional(),
            email: z.string().optional(),
          })
          .optional(),
      })
      .refine(
        ({ enabled, foreignCitizenship, dateOfBirth }) => {
          if (!enabled) return true

          return foreignCitizenship?.length && !dateOfBirth ? false : true
        },
        {
          path: ['dateOfBirth'],
        },
      )
      .refine(
        ({ enabled, foreignCitizenship, nationalId }) => {
          if (!enabled) return true

          return !foreignCitizenship?.length
            ? nationalId && kennitala.isValid(nationalId)
            : true
        },
        {
          path: ['nationalId'],
        },
      )

      /* Validating email and phone of member depending on whether the field is 
          enabled and whether member has advocate */
      .refine(
        ({ enabled, advocate, phone }) => {
          return enabled && !advocate?.nationalId
            ? isValidPhoneNumber(phone ?? '')
            : true
        },
        {
          path: ['phone'],
        },
      )
      .refine(
        ({ enabled, advocate, email }) => {
          return enabled && !advocate?.nationalId ? isValidEmail(email) : true
        },
        {
          path: ['email'],
        },
      )

      /* validation for advocates */
      .refine(
        ({ enabled, advocate }) => {
          return enabled && (advocate?.phone || advocate?.nationalId)
            ? isValidPhoneNumber(advocate?.phone ?? '')
            : true
        },
        {
          path: ['advocate', 'phone'],
        },
      )
      .refine(
        ({ enabled, advocate }) => {
          return enabled && advocate?.email
            ? isValidEmail(advocate.email)
            : true
        },
        {
          path: ['advocate', 'email'],
        },
      )
      .array()
      .optional(),
    total: z.number().refine((v) => {
      const val = typeof v === 'string' ? parseInt(v, 10) ?? 0 : v

      return val === 100
    }),
  }),

  heirsAdditionalInfo: z.string().optional(),

  spouse: z
    .object({
      wasInCohabitation: z.string().optional(),
      hadSeparateProperty: z.string().optional(),
      spouseTotalDeduction: z.number().optional(),
      spouseTotalSeparateProperty: z.string().optional(),
    })
    .refine(
      ({ wasInCohabitation }) => {
        return wasInCohabitation && [YES, NO].includes(wasInCohabitation)
      },
      {
        path: ['wasInCohabitation'],
      },
    )
    .refine(
      ({ hadSeparateProperty, wasInCohabitation }) => {
        if (wasInCohabitation && [NO].includes(wasInCohabitation)) {
          return true
        }

        return hadSeparateProperty && [YES, NO].includes(hadSeparateProperty)
      },
      {
        path: ['hadSeparateProperty'],
      },
    )
    .refine(
      ({ hadSeparateProperty, spouseTotalSeparateProperty }) => {
        if (hadSeparateProperty && [YES].includes(hadSeparateProperty)) {
          return spouseTotalSeparateProperty !== ''
        }

        return true
      },
      {
        path: ['spouseTotalSeparateProperty'],
      },
    ),

  totalDeduction: z.number(),

  // shareTotal: z.number(),
  // allDebtsTotal: z.number(),
  // netPropertyForExchange: z.number(),
  // netProperty: z.number(),
  // cohabitantShare: z.number(),
  // deceasedCohabitantShare: z.string().optional(),
  // deceasedCohabitantShareEnabled: z.array(z.enum([YES])).optional(),

  // Heildareign
  total: z.number(),

  // Heildarskuldir
  debtsTotal: z.number(),

  // Heildarséreign
  shareTotal: z.number(),

  // Hrein eign: Heildareign - Heildarskuldir
  netTotal: z.number(),

  // Búshluti makans: Hrein eign - Heildarséreign / 2
  spouseTotal: z.number(),

  // Búshluti dánarbús: Hrein eign - Heildarséreign / 2
  estateTotal: z.number(),

  // Hrein eign til skipta: Heildarséreign + Búshluti dánarbús
  netPropertyForExchange: z.number(),

  hasCustomSpouseSharePercentage: z.array(z.enum([YES])).optional(),
  customSpouseSharePercentage: z
    .string()
    .refine((v) => {
      const val = valueToNumber(v)
      return val >= 0 && val <= 100
    })
    .optional(),

  /* einkaskipti */
  confirmAction: z.array(z.enum([YES])).length(1),
})

export type InheritanceReport = z.TypeOf<typeof inheritanceReportSchema>
