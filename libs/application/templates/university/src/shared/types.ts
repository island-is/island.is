import { z } from 'zod'
import { RepeateableEducationDetailsSchema } from '../lib/dataSchema'

export type EducationDetailsItem = z.TypeOf<
  typeof RepeateableEducationDetailsSchema
>

export type CurrentApplication = {
  id: string
  nationalId: string
}
