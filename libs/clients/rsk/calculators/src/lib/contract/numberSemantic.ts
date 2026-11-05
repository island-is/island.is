import type { ZodTypeAny } from 'zod'

import type { CalculatorFieldSemantic } from '../types/semantic'
import { isRskRatio } from '../utils/isRskRatio'

export const numberSemantic = (schema: ZodTypeAny): CalculatorFieldSemantic =>
  isRskRatio(schema) ? 'percentage' : 'currency'
