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

export const inheritanceReportSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),

  applicant: z.object({
    email: z.string().email(),
    phone: z.string(),
    nationalId: z.string(),
  }),

  /* assets2 */
  assets: z.object({
    realEstate: z
      .object({
        data: z
          .object({
            assetNumber: z.string(),
            description: z.string(),
            propertyValuation: z.string().refine((v) => v),
          })
          .array()
          .optional(),
        total: z.number().optional(),
      })
      .optional(),
    vehicles: z
      .object({
        data: z
          .object({
            assetNumber: z.string(),
            description: z.string(),
            propertyValuation: z.string().refine((v) => v),
          })
          .array()
          .optional(),
        total: z.number().optional(),
      })
      .optional(),
    guns: z
      .object({
        data: z
          .object({
            assetNumber: z.string(),
            description: z.string(),
            propertyValuation: z.string().refine((v) => v),
          })
          .array()
          .optional(),
        total: z.number().optional(),
      })
      .optional(),
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
    publicCharges: z
      .object({
        data: z
          .object({
            publicChargesAmount: z.string().refine((v) => v),
          })
          .array()
          .optional(),
        total: z.number().optional(),
      })
      .optional(),
    debtsTotal: z.number().optional(),
  }),

  funeralCostAmount: z.string().refine((v) => v),

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
        relationWithApplicant: z.string().optional(),
        nationalId: z.string().optional(),
        custodian: z.string().length(10).optional(),
        foreignCitizenship: z.string().array().min(0).max(1).optional(),
        dateOfBirth: z.string().optional(),
        initial: z.boolean(),
        enabled: z.boolean(),
        phone: z.string(),
        email: z.string(),
        heirsPercentage: z.string(),
        taxFreeInheritance: z.number(),
        inheritance: z.number(),
        taxableInheritance: z.number(),
        inheritanceTax: z.number(),
        // Málsvari
        advocate: z
          .object({
            name: z.string(),
            nationalId: z.string(),
            phone: z.string(),
            email: z.string(),
          })
          .optional(),
      })
      .refine(
        ({ foreignCitizenship, nationalId }) => {
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
          return enabled && !advocate ? isValidPhoneNumber(phone) : true
        },
        {
          path: ['phone'],
        },
      )
      .refine(
        ({ enabled, advocate, email }) => {
          return enabled && !advocate ? isValidEmail(email) : true
        },
        {
          path: ['email'],
        },
      )

      /* validation for advocates */
      .refine(
        ({ enabled, advocate }) => {
          return enabled && advocate ? isValidPhoneNumber(advocate.phone) : true
        },
        {
          path: ['advocate', 'phone'],
        },
      )
      .refine(
        ({ enabled, advocate }) => {
          return enabled && advocate ? isValidEmail(advocate.email) : true
        },
        {
          path: ['advocate', 'email'],
        },
      )
      .array()
      .optional(),
    // heirs: z.object({
    //   data: z
    //     .object({
    //       nationalId: z.string(),
    //       heirsName: z.string(),
    //       email: z.string(),
    //       phone: z.string(),
    //       relation: z.string(),
    //       heirsPercentage: z.string(),
    //       taxFreeInheritance: z.number(),
    //       inheritance: z.number(),
    //       taxableInheritance: z.number(),
    //       inheritanceTax: z.number(),
    //     })
    //     .array()
    //     .optional(),
    total: z
      .number()
      .refine((v) => v === 0 || v < 101)
      .optional(),
  }),

  heirsAdditionalInfo: z.string().optional(),

  totalDeduction: z.string(),

  /* einkaskipti */
  confirmAction: z.array(z.enum([YES])).length(1),
})

export type InheritanceReport = z.TypeOf<typeof inheritanceReportSchema>
