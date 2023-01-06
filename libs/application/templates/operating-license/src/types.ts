import { dataSchema } from './lib/dataSchema'
import { z } from 'zod'

export type OperatingLicenseAnswers = z.infer<typeof dataSchema>

type YesOrNo = 'yes' | 'no'

export interface OperatingLicenseFakeData {
  useFakeData?: YesOrNo
  debtStatus?: string
  criminalRecord?: string
}

export type DataProviderSuccess = { success: boolean }
