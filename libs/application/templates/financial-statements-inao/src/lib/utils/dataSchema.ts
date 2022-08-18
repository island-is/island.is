import * as z from 'zod'
import { m } from '../../lib/messages'
import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import {
  Override,
  NestedType,
} from '@island.is/application/templates/family-matters-core/types'
import { FieldBaseProps } from '@island.is/application/types'

const error = {
  id: 'fsn.application:income',
  defaultMessage: 'Tekjur',
  description: 'Applicants income',
}

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const election = z.object({
  selectElection: z.string(),
  incomeLimit: z.string(),
})

const conditionalAbout = z.object({
  operatingYear: z.string(),
})

const about = z.object({
  nationalId: z
    .string()
    .refine((val) => (val ? kennitala.isPerson(val) : false), {
      params: error,
    }),
  fullName: z.string(),
  powerOfAttorneyNationalId: z.string(),
  powerOfAttorneyName: z.string(),
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
  tangible: z.string(),
  current: z.string(),
})

const cemetryAsset = z.object({
  tangible: z.string(),
  current: z.string(),
  total: z.string()
})

const equity = z.object({
  totalEquity: z.string(),
})

const cemetryEquity = z.object({
  newYearEquity: z.string(),
  operationResult: z.string(),
  reevaluatePrice: z.string(),
  reevaluateOther: z.string(),
  total: z.string(),
})

const liability = z.object({
  longTerm: z.string(),
  shortTerm: z.string(),
  total: z.string(),
})

const cemetryLiability = z.object({
  longTerm: z.string(),
  shortTerm: z.string(),
  total: z.string(),
})

const cemetryIncome = z.object({
  capitalIncome: z.string(),
  caretaking: z.string(),
  graveIncome: z.string(),
  cemetryFundDonations: z.string(),
  otherIncome: z.string(),
  totalOperation: z.string(),
  total: z.string(),
})

const cemetryExpense = z.object({
  payroll: z.string(),
  funeralCost: z.string(),
  chapelExpense: z.string(),
  donationsToOther: z.string(),
  cemeteryFundExpense: z.string(),
  otherOperationCost: z.string(),
  writtenOffExpense: z.string(),
  total: z.string()
})

const partyIncome = z.object({
  publicDonations: z.string(),
  partyDonations: z.string(),
  municipalityDonations: z.string(),
  individualDonations: z.string(),
  otherIncome: z.string(),
  capitalIncome: z.string(),
})

const partyExpense = z.object({
  electionOffice: z.string(),
  capitalCost: z.string(),
  otherCost: z.string(),
})

const individualIncome = z.object({
  corporateDonations: z.string(),
  individualDonations: z.string(),
  personalDonations: z.string(),
  otherIncome: z.string(),
  capitalIncome: z.string(),
})

const individualExpense = z.object({
  electionOffice: z.string(),
  advertisements: z.string(),
  travelCost: z.string(),
  capitalCost: z.string(),
  otherCost: z.string(),
})

const cemetryCaretaker = z.array(
  z.object({
    name: z.string().refine((x) => !!x, { params: m.required }),
    nationalId: z.string().refine((x) => !!x, { params: m.required }),
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
  partyIncome,
  partyExpense,
  cemetryIncome,
  cemetryExpense,
  cemetryAsset,
  cemetryEquity,
  cemetryLiability,
  cemetryCaretaker,
  asset,
  equity,
  liability,
  attachment: z
    .object({
      file: z.array(FileSchema),
    })
    .optional(),
})

export type FinancialStatementsInao = z.TypeOf<typeof dataSchema>

type ErrorSchema = NestedType<FinancialStatementsInao>

export type FSNFieldBaseProps = Override<
  FieldBaseProps,
  { errors: ErrorSchema }
>
