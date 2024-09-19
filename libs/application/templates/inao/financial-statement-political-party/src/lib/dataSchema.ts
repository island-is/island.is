import { z } from 'zod'
import { m } from './messages'
import * as kennitala from 'kennitala'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { checkIfNegative } from '../utils/helpers'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
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
      // ignore validation on dev to test with Gervimenn remove b4 release
      if (isRunningOnEnvironment('dev')) {
        return true
      }
      const phoneNumber = parsePhoneNumberFromString(p, 'IS')
      return phoneNumber && phoneNumber.isValid()
    },
    { params: m.dataSchemePhoneNumber },
  ),
  email: z.string().email(),
})

const election = z.object({
  selectElection: z.string().optional(),
  electionName: z.string().optional(),
  genitiveName: z.string().optional(),
  incomeLimit: z.string().refine((x) => !!x, { params: m.required }),
})

const operatingCost = z.object({
  total: z.string().refine((x) => !!x, { params: m.required }),
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

const equityAndLiabilities = z.object({
  total: z.string(),
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
  totalEquity: z.string().refine((x) => !!x, { params: m.required }),
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

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
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
