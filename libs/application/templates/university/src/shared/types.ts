import { z } from 'zod'
import {
  EducationNotFinishedSchema,
  ExemptionEducationSchema,
  RepeateableEducationDetailsSchema,
} from '../lib/dataSchema'

export type EducationDetailsItem = z.TypeOf<
  typeof RepeateableEducationDetailsSchema
>

export type EducationDetailsItemExemption = z.TypeOf<
  typeof ExemptionEducationSchema
>
export type EducationDetailsItemNotFinished = z.TypeOf<
  typeof EducationNotFinishedSchema
>

export type CurrentApplication = {
  id: string
  nationalId: string
}
