import { z } from 'zod'
import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { m } from '../lib/messages'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { checkIfNegative } from '../utils/helpers'
import {
  Override,
  NestedType,
} from '@island.is/application/templates/family-matters-core/types'
import { FieldBaseProps } from '@island.is/application/types'
import { YES } from '@island.is/application/core'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const election = z.object({
  selectElection: z.string().optional(),
  electionName: z.string().optional(),
  genitiveName: z.string().optional(),
  electionId: z.string().optional(),
})

const incomeLimit = z.object({
  limit: z.string().refine((x) => !!x, { params: m.required }),
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
const equityAndLiabilities = z.object({
  total: z.string(),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  conditionalAbout,
  about,
  election,
  incomeLimit,
  individualIncome,
  individualExpense,
  capitalNumbers,
  equityAndLiabilities,
  asset,
  equity,
  liability,
  attachments: z.object({
    file: z.array(FileSchema).nonempty(),
  }),
  approveOverview: z.array(z.literal(YES)).length(1),
})

export type FinancialStatementIndividualElection = z.TypeOf<typeof dataSchema>

type ErrorSchema = NestedType<FinancialStatementIndividualElection>

export type FSNFieldBaseProps = Override<
  FieldBaseProps,
  { errors: ErrorSchema }
>
