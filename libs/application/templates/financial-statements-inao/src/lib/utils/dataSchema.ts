import * as z from 'zod'
import { m } from '../../lib/messages'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const electionInfo = z.object({
  electionType: z.string().optional(),
  selectElectionType: z.string().optional(),
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

const propertiesAndDebts = z.object({
  propertiesShort: z.string().optional(),
  propertiesCash: z.string().optional(),
  debtsShort: z.string().optional(),
  longTermDebt: z.string().optional(),
})

const incomeAndExpenses = z.object({
  capital: z.string().optional(),
  partyRunning: z.string().optional(),
  donations: z.string().optional(),
  personal: z.string().optional(),
  capitalIncome: z.string().optional(),
})


export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  about,
  electionInfo,
  incomeAndExpenses,
  propertiesAndDebts,
  attachment: z
    .object({
      file: z.array(FileSchema),
    })
    .optional(),
})

export type FinancialStatementsInao = z.TypeOf<typeof dataSchema>
export type ElectionInfo = z.TypeOf<typeof electionInfo>
export type About = z.TypeOf<typeof about>
