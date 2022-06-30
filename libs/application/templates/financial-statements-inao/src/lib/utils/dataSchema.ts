import * as z from 'zod'
import { m } from '../../lib/messages'
import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import {
  Override,
  NestedType,
} from '@island.is/application/templates/family-matters-core/types'
import { CEMETRY, PARTY } from '../constants'
import { FieldBaseProps } from '@island.is/application/core'

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
})

const equity = z.object({
  totalEquity: z.string(),
})

const cemetryEquity = z.object({
  newYearEquity: z.string(),
  operationResult: z.string(),
  reevaluatePrice: z.string(),
  reevaluateOther: z.string()
})

const liability = z.object({
  longTerm: z.string(),
  shortTerm: z.string(),
})

const cemetryLiability = z.object({
  longTerm: z.string(),
  shortTerm: z.string(),
})

const cemetryIncome = z.object({
  capitalIncome: z.string(),
  caretaking: z.string(),
  graveIncome: z.string(),
  cemetryFundDonations: z.string(),
  otherIncome: z.string(),
})

const cemetryExpense = z.object({
  payroll: z.string(),
  funeralCost: z.string(),
  chapelExpense: z.string(),
  donationsToOther: z.string(),
  cemeteryFundExpense: z.string(),
  otherOperationCost: z.string(),
  writtenOffExpense: z.string(),
})

const income = z
  .object({
    applicationType: z.string(),
    publicDonations: z.string(),
    partyDonations: z.string(),
    municipalityDonations: z.string(),
    individualDonations: z.string(),
    corporateDonations: z.string(),
    personalDonations: z.string(),
    otherIncome: z.string(),
    capitalIncome: z.string(),
    caretaking: z.string(),
    graveIncome: z.string(),
    cemetryFundDonations: z.string(),
  })
  .partial()
  .refine(
    ({
      applicationType,
      capitalIncome,
      otherIncome,
      individualDonations,
      corporateDonations,
      municipalityDonations,
      publicDonations,
      partyDonations,
      caretaking,
      cemetryFundDonations,
      graveIncome,
    }) => {
      const isCemetry = applicationType === CEMETRY
      if (applicationType === PARTY) {
        return (
          !!capitalIncome &&
          !!otherIncome &&
          !!individualDonations &&
          !!municipalityDonations &&
          !!publicDonations &&
          !!partyDonations &&
          !!corporateDonations
        )
      } else if (applicationType === CEMETRY) {
        const noEmptyFields =
          !!graveIncome &&
          !!caretaking &&
          !!cemetryFundDonations &&
          !!capitalIncome &&
          !!otherIncome

        return noEmptyFields
      } else return !!partyDonations
    },
  )

const expense = z
  .object({
    applicationType: z.string(),
    electionOffice: z.string(),
    capitalCost: z.string(),
    advertisements: z.string(),
    otherCost: z.string(),
    travelCost: z.string(),
    payroll: z.string(),
    funeralCost: z.string(),
    chapelExpense: z.string(),
    donationsToOther: z.string(),
    cemeteryFundExpense: z.string(),
    otherOperationCost: z.string(),
    writtenOffExpense: z.string(),
  })
  .partial()
  .refine((data) => {
    const {
      advertisements,
      travelCost,
      electionOffice,
      capitalCost,
      otherCost,
      applicationType,
      payroll,
      funeralCost,
      chapelExpense,
      cemeteryFundExpense,
      otherOperationCost,
      donationsToOther,
      writtenOffExpense,
    } = data
    const isCemetry = applicationType === CEMETRY

    if (applicationType === PARTY) {
      const isParty = !!electionOffice && !!capitalCost && !!otherCost
      return isParty
    } else if (isCemetry) {
      const noEmptyFields =
        !!payroll &&
        !!funeralCost &&
        !!chapelExpense &&
        !!cemeteryFundExpense &&
        !!otherOperationCost &&
        !!writtenOffExpense &&
        !!donationsToOther
      return noEmptyFields
    } else {
      return !!electionOffice
    }
  })

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  conditionalAbout,
  about,
  election,
  income,
  expense,
  cemetryIncome,
  cemetryExpense,
  cemetryAsset,
  cemetryEquity,
  cemetryLiability,
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
