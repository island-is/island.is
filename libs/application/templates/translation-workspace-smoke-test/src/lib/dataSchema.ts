import { z } from 'zod'

export const dataSchema = z.object({})

export type TranslationWorkspaceSmokeTestAnswers = z.TypeOf<typeof dataSchema>
