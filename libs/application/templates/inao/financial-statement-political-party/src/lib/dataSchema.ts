import { z } from 'zod'
import { m } from './messages'
import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js/min'
import { checkIfNegative } from '../utils/helpers'
import { YES } from '@island.is/application/core'

const requiredNonNegativeString = z
  .string()
  .refine((x) => !!x, { params: m.required })
  .refine((x) => checkIfNegative(x), { params: m.negativeNumberError })

const requiredString = z.string().refine((x) => !!x, { params: m.required })

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const conditionalAbout = z.object({
  operatingYear: requiredString,
})

const about = z.object({
  nationalId: z
    .string()
    .refine((val) => (val ? kennitala.isValid(val) : false), {
      params: m.nationalIdError,
    }),
  fullName: requiredString,
  powerOfAttorneyNationalId: z.string().optional(),
  powerOfAttorneyName: z.string().optional(),
  phoneNumber: z.string().refine(
    (p) => {
      const phoneNumber = parsePhoneNumberFromString(p, 'IS')
      return phoneNumber?.isValid()
    },
    { params: m.dataSchemePhoneNumber },
  ),
  email: z.string().email(),
})

// Key numbers - operating cost -income
const partyIncome = z.object({
  contributionsFromTheTreasury: requiredNonNegativeString,
  parliamentaryPartySupport: requiredNonNegativeString,
  municipalContributions: requiredNonNegativeString,
  contributionsFromLegalEntities: requiredNonNegativeString,
  contributionsFromIndividuals: requiredNonNegativeString,
  generalMembershipFees: requiredNonNegativeString,
  otherIncome: requiredNonNegativeString,
  total: z.string(),
})

// Key numbers - operating cost - expenses
const partyExpense = z.object({
  electionOffice: requiredNonNegativeString,
  otherCost: requiredNonNegativeString,
  total: z.string(),
})

// Key numbers - operating cost - total
const operatingCost = z.object({
  total: requiredString,
})

// Key numbers - capital numbers
const capitalNumbers = z.object({
  capitalIncome: requiredNonNegativeString,
  capitalCost: requiredNonNegativeString,
  total: z.string(),
})

// Key numbers - equities and liabilities - assets
const asset = z.object({
  currentAssets: requiredNonNegativeString,
  fixedAssetsTotal: requiredNonNegativeString,
})

// Key numbers - equities and liabilities - liabilities
const liability = z.object({
  longTerm: requiredNonNegativeString,
  shortTerm: requiredNonNegativeString,
})

// Key numbers - equities and liabilities - equity
const equity = z.object({
  totalEquity: requiredString,
})

// Key numbers - equities and liabilities - total
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

export const dataSchema = z.object({
  approveExternalData: z.literal(true),
  conditionalAbout,
  about,
  operatingCost,
  partyIncome,
  partyExpense,
  capitalNumbers,
  equityAndLiabilitiesTotals,
  asset,
  equity,
  liability,
  attachments: z.object({
    file: z.array(FileSchema).nonempty(),
  }),
  approveOverview: z.array(z.literal(YES)).length(1),
})

export type FinancialStatementPoliticalParty = z.TypeOf<typeof dataSchema>
