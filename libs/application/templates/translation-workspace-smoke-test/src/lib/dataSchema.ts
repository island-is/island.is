import { z } from 'zod'
import { SurveyOption } from './constants'

export const dataSchema = z.object({
  mainRadio: z.nativeEnum(SurveyOption),
})

export type TranslationWorkspaceSmokeTestAnswers = z.TypeOf<typeof dataSchema>
