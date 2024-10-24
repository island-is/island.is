import { z } from 'zod'
import { m } from './messages'
import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { BOARDMEMBER, CARETAKER } from '../utils/constants'
import { getBoardmembersAndCaretakers } from '../utils/helpers'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const checkIfNegative = (inputNumber: string) => {
  if (Number(inputNumber) < 0) {
    return false
  } else {
    return true
  }
}

const conditionalAbout = z.object({
  operatingYear: z.string().refine((x) => !!x, { params: m.required }),
})

const cemeteryOperation = z.object({
  incomeLimit: z.string().optional(),
})

const cemeteryLiability = z.object({
  longTerm: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  shortTerm: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  total: z.string().refine((x) => !!x, { params: m.required }),
})

const cemeteryAsset = z.object({
  currentAssets: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  fixedAssetsTotal: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  total: z.string(),
})

const cemeteryIncome = z.object({
  careIncome: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  burialRevenue: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  grantFromTheCemeteryFund: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  otherIncome: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  total: z.string(),
})

const cemeteryExpense = z.object({
  payroll: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  funeralCost: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  chapelExpense: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  donationsToOther: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  cemeteryFundExpense: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  otherOperationCost: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  depreciation: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  total: z.string(),
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
      const boardMembers = x.filter((member) => member.role === BOARDMEMBER)
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

const cemeteryEquity = z.object({
  equityAtTheBeginningOfTheYear: z
    .string()
    .refine((x) => !!x, { params: m.required }),
  operationResult: z.string(),
  revaluationDueToPriceChanges: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  reevaluateOther: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  total: z.string(),
})

const equityAndLiabilities = z.object({
  total: z.string(),
})

const capitalNumbers = z.object({
  capitalIncome: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  capitalCost: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  total: z.string(),
})

export const dataSchema = z.object({
  conditionalAbout,
  about,
  approveExternalData: z.boolean().refine((v) => v),
  cemeteryOperation,
  cemeteryAsset,
  cemeteryLiability,
  cemeteryIncome,
  cemeteryExpense,
  attachments: z.object({
    file: z.array(FileSchema).nonempty(),
  }),
  cemeteryCaretaker,
  cemeteryEquity,
  equityAndLiabilities,
  capitalNumbers,
})

export type FinancialStatementCemetery = z.TypeOf<typeof dataSchema>
