import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { MinimalCase } from '../models/case.types'

export const MinimalCurrentCase = createParamDecorator(
  (data: unknown, context: ExecutionContext): MinimalCase => {
    const ctx = context.getArgByIndex(1)
    return ctx?.req?.case
  },
)
