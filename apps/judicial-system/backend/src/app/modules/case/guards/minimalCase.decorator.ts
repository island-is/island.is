import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { MinimalCase } from '../models/case.types'

export const MinimalCurrentCase = createParamDecorator(
  (data, context: ExecutionContext): MinimalCase =>
    context.switchToHttp().getRequest().case,
)
