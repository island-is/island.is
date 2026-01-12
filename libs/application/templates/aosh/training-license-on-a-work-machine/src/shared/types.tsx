import { z } from 'zod'
import {
  CertificateOfTenureSchema,
  TrainingLicenseOnAWorkMachineAnswersSchema,
} from '../lib/dataSchema'
import { StaticText } from '@island.is/shared/types'

export type TrainingLicenseOnAWorkMachineAnswers = z.TypeOf<
  typeof TrainingLicenseOnAWorkMachineAnswersSchema
>
export type CertificateOfTenureAnswers = z.TypeOf<
  typeof CertificateOfTenureSchema
>
export type RepeaterOption = {
  label: StaticText
  value: string
  tooltip?: StaticText
}
