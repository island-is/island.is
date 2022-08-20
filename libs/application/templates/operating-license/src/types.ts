import { dataSchema } from './lib/dataSchema'
import * as z from 'zod'

export type OperatingLicenseAnswers = z.infer<typeof dataSchema>
