import { z } from 'zod'
import {
  CertificateOfTenureSchema,
  TrainingLicenseOnAWorkMachineAnswersSchema,
} from '../lib/dataSchema'

export type TrainingLicenseOnAWorkMachineAnswers = z.TypeOf<
  typeof TrainingLicenseOnAWorkMachineAnswersSchema
>
export type CertificateOfTenureAnswers = z.TypeOf<
  typeof CertificateOfTenureSchema
>
