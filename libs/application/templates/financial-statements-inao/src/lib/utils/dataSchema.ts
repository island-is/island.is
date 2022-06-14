import * as z from 'zod'
import { m } from '../../lib/messages'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import {
  Override,
  NestedType
} from '@island.is/application/templates/family-matters-core/types'
import { FieldBaseProps } from '@island.is/application/core'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const election = z.object({
  selectElection: z.string().optional(),
  electionDescription: z.string().optional(),
  incomeLimit: z.string().optional(),
})

const about = z.object({
  nationalId: z.string(),
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
  tangible: z.string().optional(),
  current: z.string().optional(),
})

const equity = z.object({
  totalEquity: z.string().optional(),
})

const liability = z.object({
  longTerm: z.string().optional(),
  shortTerm: z.string().optional(),
})

const income = z.object({
  individualDonations: z.string().optional(),
  corporateDonations: z.string().optional(),
  personalDonations: z.string().optional(),
  otherIncome: z.string().optional(),
  capitalIncome: z.string().optional(),
})

const expense = z.object({
  capitalCost: z.string().optional(),
  electionOffice: z.string().optional(),
  advertisements: z.string().optional(),
  otherCost: z.string().optional(),
  travelCost: z.string().optional(),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  about,
  election,
  income,
  expense,
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
