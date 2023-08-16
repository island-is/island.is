// eslint-disable-next-line @nx/enforce-module-boundaries
import { TemplateApiError } from '@island.is/nest/problem'

export type PerformActionResult =
  | {
      success: true
      response: unknown
    }
  | {
      success: false
      error: TemplateApiError
    }
