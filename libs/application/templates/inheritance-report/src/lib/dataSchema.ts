import * as z from 'zod'
import * as kennitala from 'kennitala'
import { YES } from './constants'
import {
  customZodError,
  isValidEmail,
  isValidPhoneNumber,
  isValidString,
} from './utils/helpers'
import { m } from './messages'

const assetSchema = ({ withShare }: { withShare?: boolean } = {}) =>
  z
    .object({
      data: z
        .object({
          assetNumber: z.string(),
          description: z.string(),
          propertyValuation: z.string(),
          ...(withShare ? { share: z.string() } : {}),
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
        .array()
        .optional(),
      hasModified: z.boolean().optional(),
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
      })
      .optional(),
    bankAccounts: z
      .object({
        data: z
          .object({
            foreignBankAccount: z.array(z.enum([YES])).optional(),
            accountNumber: z.string(),
            balance: z.string().refine((v) => v),
          })
          .array()
          .optional(),
        total: z.number().optional(),
      })
      .optional(),
    claims: z
      .object({
        data: z
          .object({
            issuer: z.string(),
            nationalId: z.string(),
            value: z.string().refine((v) => v),
          })
          .refine(
            ({ nationalId }) => {
              return nationalId && nationalId !== ''
                ? kennitala.isValid(nationalId)
                : true
            },
            {
              path: ['nationalId'],
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
            organization: z.string(),
            nationalId: z.string(),
            faceValue: z.string(),
            rateOfExchange: z.string(),
            value: z.string().refine((v) => v),
          })
          .array()
          .optional(),
        total: z.number().optional(),
      })
      .optional(),
    money: z
      .object({
        info: z.string().optional(),
        value: z.string().optional(),
      })
      .optional(),
    otherAssets: z
      .object({
        info: z.string().optional(),
        value: z.string().optional(),
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
            creditorName: z.string(),
            nationalId: z.string(),
            loanIdentity: z.string(),
            balance: z.string(),
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
            ({ creditorName, nationalId, balance, loanIdentity }) => {
              return nationalId !== '' || creditorName !== '' || balance !== ''
                ? isValidString(loanIdentity)
                : true
            },
            {
              path: ['loanIdentity'],
            },
          )
          .refine(
            ({ creditorName, nationalId, balance, loanIdentity }) => {
              return nationalId !== '' ||
                creditorName !== '' ||
                loanIdentity !== ''
                ? isValidString(balance)
                : true
            },
            {
              path: ['balance'],
            },
          )
          .refine(
            ({ creditorName, nationalId, balance, loanIdentity }) => {
              return nationalId !== '' || balance !== '' || loanIdentity !== ''
                ? isValidString(creditorName)
                : true
            },
            {
              path: ['creditorName'],
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

  /* business */
  business: z.object({
    businessAssets: z
      .object({
        data: z
          .object({
            businessAsset: z.string(),
            businessAssetValue: z.string().refine((v) => v),
          })
          .array()
          .optional(),
        total: z.number().optional(),
      })
      .optional(),
    businessDebts: z
      .object({
        data: z
          .object({
            businessDebt: z.string(),
            loanIdentity: z.string(),
            nationalId: z.string(),
            debtValue: z.string(),
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
            ({ businessDebt, nationalId, debtValue, loanIdentity }) => {
              return nationalId !== '' ||
                businessDebt !== '' ||
                debtValue !== ''
                ? isValidString(loanIdentity)
                : true
            },
            {
              path: ['loanIdentity'],
            },
          )
          .refine(
            ({ businessDebt, nationalId, debtValue, loanIdentity }) => {
              return nationalId !== '' ||
                businessDebt !== '' ||
                loanIdentity !== ''
                ? isValidString(debtValue)
                : true
            },
            {
              path: ['debtValue'],
            },
          )
          .refine(
            ({ businessDebt, nationalId, debtValue, loanIdentity }) => {
              return nationalId !== '' ||
                debtValue !== '' ||
                loanIdentity !== ''
                ? isValidString(businessDebt)
                : true
            },
            {
              path: ['businessDebt'],
            },
          )
          .array()
          .optional(),
        total: z.number().optional(),
      })
      .optional(),
    businessTotal: z.number().optional(),
  }),

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
        phone: z.string(),
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
            ? isValidPhoneNumber(phone)
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
          return enabled && advocate?.phone
            ? isValidPhoneNumber(advocate.phone)
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

  totalDeduction: z.string(),

  /* einkaskipti */
  confirmAction: z.array(z.enum([YES])).length(1),
})

export type InheritanceReport = z.TypeOf<typeof inheritanceReportSchema>
