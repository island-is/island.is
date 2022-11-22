import { z } from 'zod'
import { m } from '../../lib/messages'
import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import {
  Override,
  NestedType,
} from '@island.is/application/templates/family-matters-core/types'
import { FieldBaseProps } from '@island.is/application/types'
import { BOARDMEMEBER, CARETAKER } from '../constants'
import { getBoardmembersAndCaretakers } from './helpers'

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

const election = z.object({
  selectElection: z.string().optional(),
  electionName: z.string().optional(),
  incomeLimit: z.string().refine((x) => !!x, { params: m.required }),
})

const conditionalAbout = z.object({
  operatingYear: z.string().refine((x) => !!x, { params: m.required }),
})

const operatingCost = z.object({
  total: z.string().refine((x) => !!x, { params: m.required }),
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

const asset = z.object({
  currentAssets: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  fixedAssetsTotal: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  total: z.string().refine((x) => !!x, { params: m.required }),
})

const equity = z.object({
  totalEquity: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
})

const liability = z.object({
  longTerm: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  shortTerm: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  total: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
})
const equityAndLiabilities = z.object({
  total: z.string(),
})

const cemetryOperation = z.object({
  incomeLimit: z.string().optional(),
})

const cemetryIncome = z.object({
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

const cemetryExpense = z.object({
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

const cemetryEquity = z.object({
  equityAtTheBeginningOfTheYear: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
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

const cemetryLiability = z.object({
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

const cemetryAsset = z.object({
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

const partyIncome = z.object({
  contributionsFromTheTreasury: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  parliamentaryPartySupport: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  municipalContributions: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  contributionsFromLegalEntities: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  contributionsFromIndividuals: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  generalMembershipFees: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  otherIncome: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  total: z.string(),
})

const partyExpense = z.object({
  electionOffice: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  otherCost: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  total: z.string(),
})

const individualIncome = z.object({
  contributionsByLegalEntities: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  candidatesOwnContributions: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  individualContributions: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  otherIncome: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  total: z.string(),
})

const individualExpense = z.object({
  electionOffice: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  advertisements: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  travelCost: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  otherCost: z
    .string()
    .refine((x) => !!x, { params: m.required })
    .refine((x) => checkIfNegative(x), { params: m.negativeNumberError }),
  total: z.string().refine((x) => !!x, { params: m.required }),
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

const cemetryCaretaker = z
  .array(
    z.object({
      name: z.string().refine((x) => !!x, { params: m.required }),
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
  conditionalAbout,
  about,
  election,
  individualIncome,
  individualExpense,
  operatingCost,
  partyIncome,
  partyExpense,
  capitalNumbers,
  cemetryIncome,
  cemetryExpense,
  cemetryEquity,
  cemetryLiability,
  cemetryAsset,
  equityAndLiabilities,
  cemetryCaretaker,
  cemetryOperation,
  asset,
  equity,
  liability,
  attachments: z.object({
    file: z.array(FileSchema).nonempty(),
  }),
})

export type FinancialStatementsInao = z.TypeOf<typeof dataSchema>

type ErrorSchema = NestedType<FinancialStatementsInao>

export type FSNFieldBaseProps = Override<
  FieldBaseProps,
  { errors: ErrorSchema }
>
