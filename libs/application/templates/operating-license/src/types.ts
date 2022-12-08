import { dataSchema } from './lib/dataSchema'
import { z } from 'zod'

export type OperatingLicenseAnswers = z.infer<typeof dataSchema>
