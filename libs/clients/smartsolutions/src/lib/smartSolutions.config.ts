import * as z from 'zod'

export const SmartSolutionsApiConfigSchema = z.object({
  apiKey: z.string(),
  apiUrl: z.string(),
  passTemplateId: z.string(),
})

export const SMART_SOLUTIONS_API_CONFIG = 'smart-solutions-api-config'
