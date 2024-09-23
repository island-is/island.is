import { z } from 'zod'
import { m } from './messages'
import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js/min'
import { checkIfNegative } from '../utils/helpers'

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

const election = z.object({
  selectElection: z.string().optional(),
  electionName: z.string().optional(),
  genitiveName: z.string().optional(),
  incomeLimit: requiredString,
})

const operatingCost = z.object({
  total: requiredString,
})

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

const partyExpense = z.object({
  electionOffice: requiredNonNegativeString,
  otherCost: requiredNonNegativeString,
  total: z.string(),
})

const capitalNumbers = z.object({
  capitalIncome: requiredNonNegativeString,
  capitalCost: requiredNonNegativeString,
  total: z.string(),
})

const equityAndLiabilities = z.object({
  total: z.string(),
})

const asset = z.object({
  currentAssets: requiredNonNegativeString,
  fixedAssetsTotal: requiredNonNegativeString,
  total: requiredString,
})

const equity = z.object({
  totalEquity: requiredString,
})

const liability = z.object({
  longTerm: requiredNonNegativeString,
  shortTerm: requiredNonNegativeString,
  total: requiredNonNegativeString,
})

export const dataSchema = z.object({
  approveExternalData: z.literal(true),
  conditionalAbout,
  about,
  election, // Needed??
  operatingCost,
  partyIncome,
  partyExpense,
  capitalNumbers,
  equityAndLiabilities,
  asset,
  equity,
  liability,
  attachments: z.object({
    file: z.array(FileSchema).nonempty(),
  }),
})

export type FinancialStatementPoliticalParty = z.TypeOf<typeof dataSchema>
