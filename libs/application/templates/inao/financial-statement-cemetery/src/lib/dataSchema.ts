import { z } from 'zod'
import { m } from './messages'
import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { BOARDMEMEBER, CARETAKER } from '../utils/constants'
import { getBoardmembersAndCaretakers } from '../utils/helpers'
import { isPositiveNumberInString } from '../utils/currency'
import { YES } from '@island.is/application/core'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const cemeteryOperation = z.object({
  incomeLimit: z.string().optional(),
})

const conditionalAbout = z.object({
  operatingYear: z.string().refine((x) => !!x, { params: m.required }),
})

const about = z.object({
  nationalId: z
    .string()
    .refine((val) => (val ? kennitala.isValid(val) : false), {
      params: m.nationalIdError,
    }),
  fullName: z.string().refine((x) => !!x, { params: m.required }),
  powerOfAttorneyNationalId: z.string().optional(),
  powerOfAttorneyName: z.string().optional(),
  phoneNumber: z.string().refine(
    (p) => {
      const phoneNumber = parsePhoneNumberFromString(p, 'IS')
      return phoneNumber && phoneNumber.isValid()
    },
    { params: m.dataSchemePhoneNumber },
  ),
  email: z.string().email(),
})

// Key numbers - Income and Expenses - Income
const cemeteryIncome = z.object({
  careIncome: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => isPositiveNumberInString(x), {
      params: m.negativeNumberError,
    }),
  burialRevenue: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => isPositiveNumberInString(x), {
      params: m.negativeNumberError,
    }),
  grantFromTheCemeteryFund: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => isPositiveNumberInString(x), {
      params: m.negativeNumberError,
    }),
  otherIncome: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => isPositiveNumberInString(x), {
      params: m.negativeNumberError,
    }),
  total: z.string(),
})

// Key numbers - Income and Expenses - Expenses
const cemeteryExpense = z.object({
  payroll: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => isPositiveNumberInString(x), {
      params: m.negativeNumberError,
    }),
  funeralCost: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => isPositiveNumberInString(x), {
      params: m.negativeNumberError,
    }),
  chapelExpense: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => isPositiveNumberInString(x), {
      params: m.negativeNumberError,
    }),
  donationsToOther: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => isPositiveNumberInString(x), {
      params: m.negativeNumberError,
    }),
  cemeteryFundExpense: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => isPositiveNumberInString(x), {
      params: m.negativeNumberError,
    }),
  otherOperationCost: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => isPositiveNumberInString(x), {
      params: m.negativeNumberError,
    }),
  depreciation: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => isPositiveNumberInString(x), {
      params: m.negativeNumberError,
    }),
  total: z.string(),
})

// Key numbers - Capital numbers
const capitalNumbers = z.object({
  capitalIncome: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => isPositiveNumberInString(x), {
      params: m.negativeNumberError,
    }),
  capitalCost: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => isPositiveNumberInString(x), {
      params: m.negativeNumberError,
    }),
  total: z.string(),
})

// Key numbers - Equity and Liability - Assets
const cemeteryAsset = z.object({
  currentAssets: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => isPositiveNumberInString(x), {
      params: m.negativeNumberError,
    }),
  fixedAssetsTotal: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => isPositiveNumberInString(x), {
      params: m.negativeNumberError,
    }),
})

// Key numbers - Equity and Liability - Liabilities
const cemeteryLiability = z.object({
  longTerm: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => isPositiveNumberInString(x), {
      params: m.negativeNumberError,
    }),
  shortTerm: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => isPositiveNumberInString(x), {
      params: m.negativeNumberError,
    }),
})

// Key numbers - Equity and Liability - Equity
const cemeteryEquity = z.object({
  equityAtTheBeginningOfTheYear: z
    .string()
    .refine((x) => !!x, { params: m.required }),
  operationResult: z.string(),
  revaluationDueToPriceChanges: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => isPositiveNumberInString(x), {
      params: m.negativeNumberError,
    }),
  reevaluateOther: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => isPositiveNumberInString(x), {
      params: m.negativeNumberError,
    }),
  total: z.string(),
})

// Key numbers - Equity and Liability - Equity and Liabilities totals
const equityAndLiabilitiesTotals = z
  .object({
    assetsTotal: z.string(),
    liabilitiesTotal: z.string(),
    equityAndLiabilitiesTotal: z.string(),
  })
  .refine((x) => x.assetsTotal === x.equityAndLiabilitiesTotal, {
    message: 'equityAndLiabilities.total must match assets.total',
    path: ['equityAndLiabilitiesTotals', 'equityAndLiabilitiesTotal'],
  })

const cemeteryCaretaker = z
  .array(
    z.object({
      // name: z.string().refine((x) => !!x, { params: m.required }),
      name: z.string(),
      nationalId: z
        .string()
        .refine((val) => (val ? kennitala.isPerson(val) : false), {
          params: m.nationalIdError,
        })
        .refine((val) => {
          return (
            val ? kennitala.info(val).age < 18 : false,
            {
              params: m.nationalIdAgeError,
            }
          )
        }),
      role: z.string().refine((x) => !!x, { params: m.required }),
    }),
  )
  .refine(
    (x) => {
      if (x.length <= 0) {
        return false
      }
      const careTakers = x.filter((member) => member.role === CARETAKER)
      const boardMembers = x.filter((member) => member.role === BOARDMEMEBER)
      if (careTakers.length < 1 || boardMembers.length < 1) {
        return false
      } else {
        return true
      }
    },
    { params: m.errorMembersMissing },
  )
  .refine(
    (x) => {
      const { careTakers, boardMembers } = getBoardmembersAndCaretakers(x)

      const careTakersUnique = careTakers.filter((member) =>
        boardMembers.includes(member),
      )
      const boardMembersUnique = boardMembers.filter((member) =>
        careTakers.includes(member),
      )

      if (careTakersUnique.length > 0 || boardMembersUnique.length > 0) {
        return false
      } else {
        return true
      }
    },
    { params: m.errormemberNotUnique },
  )

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  cemeteryOperation,
  conditionalAbout,
  about,
  cemeteryIncome,
  cemeteryExpense,
  capitalNumbers,
  cemeteryAsset,
  cemeteryLiability,
  cemeteryEquity,
  equityAndLiabilitiesTotals,
  cemeteryCaretaker,
  attachments: z.object({
    file: z.array(FileSchema).nonempty(),
  }),
  approveOverview: z.array(z.literal(YES)).length(1),
})

export type FinancialStatementCemetery = z.TypeOf<typeof dataSchema>
