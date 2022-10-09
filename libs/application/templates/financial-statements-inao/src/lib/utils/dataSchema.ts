import * as z from 'zod'
import { m } from '../../lib/messages'
import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import {
  Override,
  NestedType,
} from '@island.is/application/templates/family-matters-core/types'
import { FieldBaseProps } from '@island.is/application/types'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const election = z.object({
  selectElection: z.string().optional(),
  electionName: z.string().optional(),
  incomeLimit: z.string().refine((x) => !!x, { params: m.required }),
})

const conditionalAbout = z.object({
  operatingYear: z.string().refine((x) => !!x, { params: m.required }),
})

const about = z.object({
  nationalId: z
    .string()
    .refine((val) => (val ? kennitala.isPerson(val) : false), {
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
  tangible: z.string().refine((x) => !!x, { params: m.required }),
  current: z.string().refine((x) => !!x, { params: m.required }),
  total: z.string().refine((x) => !!x, { params: m.required }),
})

const equity = z.object({
  totalEquity: z.string().refine((x) => !!x, { params: m.required }),
  total: z.string().refine((x) => !!x, { params: m.required }),
})

const liability = z.object({
  longTerm: z.string().refine((x) => !!x, { params: m.required }),
  shortTerm: z.string().refine((x) => !!x, { params: m.required }),
  total: z.string().refine((x) => !!x, { params: m.required }),
})

const cemetryAsset = z.object({
  tangible: z.string(),
  current: z.string(),
  total: z.string(),
})

const cemetryEquity = z.object({
  newYearEquity: z.string(),
  operationResult: z.string(),
  reevaluatePrice: z.string(),
  reevaluateOther: z.string(),
  total: z.string(),
})

const cemetryLiability = z.object({
  longTerm: z.string().refine((x) => !!x, { params: m.required }),
  shortTerm: z.string().refine((x) => !!x, { params: m.required }),
  total: z.string().refine((x) => !!x, { params: m.required }),
})

const cemetryOperation = z.object({
  incomeLimit: z.string().optional(),
})

const cemetryIncome = z.object({
  caretaking: z.string().refine((x) => !!x, { params: m.required }),
  graveIncome: z.string().refine((x) => !!x, { params: m.required }),
  cemetryFundDonations: z.string().refine((x) => !!x, { params: m.required }),
  otherIncome: z.string().refine((x) => !!x, { params: m.required }),
  total: z.string(),
})

const cemetryExpense = z.object({
  payroll: z.string().refine((x) => !!x, { params: m.required }),
  funeralCost: z.string().refine((x) => !!x, { params: m.required }),
  chapelExpense: z.string().refine((x) => !!x, { params: m.required }),
  donationsToOther: z.string().refine((x) => !!x, { params: m.required }),
  cemeteryFundExpense: z.string().refine((x) => !!x, { params: m.required }),
  otherOperationCost: z.string().refine((x) => !!x, { params: m.required }),
  writtenOffExpense: z.string().refine((x) => !!x, { params: m.required }),
  total: z.string(),
})

const partyIncome = z.object({
  publicDonations: z.string().refine((x) => !!x, { params: m.required }),
  partyDonations: z.string().refine((x) => !!x, { params: m.required }),
  municipalityDonations: z.string().refine((x) => !!x, { params: m.required }),
  individualDonations: z.string().refine((x) => !!x, { params: m.required }),
  otherIncome: z.string().refine((x) => !!x, { params: m.required }),
  total: z.string(),
})

const partyExpense = z.object({
  electionOffice: z.string().refine((x) => !!x, { params: m.required }),
  otherCost: z.string().refine((x) => !!x, { params: m.required }),
  total: z.string(),
})

const individualIncome = z.object({
  corporateDonations: z.string().refine((x) => !!x, { params: m.required }),
  individualDonations: z.string().refine((x) => !!x, { params: m.required }),
  personalDonations: z.string().refine((x) => !!x, { params: m.required }),
  otherIncome: z.string().refine((x) => !!x, { params: m.required }),
  total: z.string(),
})

const individualExpense = z.object({
  electionOffice: z.string().refine((x) => !!x, { params: m.required }),
  advertisements: z.string().refine((x) => !!x, { params: m.required }),
  travelCost: z.string().refine((x) => !!x, { params: m.required }),
  otherCost: z.string().refine((x) => !!x, { params: m.required }),
  total: z.string().refine((x) => !!x, { params: m.required }),
})

const capitalNumbers = z.object({
  capitalIncome: z.string().refine((x) => !!x, { params: m.required }),
  capitalCost: z.string().refine((x) => !!x, { params: m.required }),
  total: z.string(),
})

const operatingCost = z.object({
  total: z.string().refine((x) => !!x, { params: m.required }),
})

const cemetryCaretaker = z.array(
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
  cemetryAsset,
  cemetryEquity,
  cemetryLiability,
  cemetryCaretaker,
  cemetryOperation,
  asset,
  equity,
  liability,
  attachment: z.object({
    file: z.array(FileSchema),
  }),
})

export type FinancialStatementsInao = z.TypeOf<typeof dataSchema>

type ErrorSchema = NestedType<FinancialStatementsInao>

export type FSNFieldBaseProps = Override<
  FieldBaseProps,
  { errors: ErrorSchema }
>
