import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { Case } from '../../repository'

export const CurrentCase = createParamDecorator(
  (data, context: ExecutionContext): Case =>
    context.switchToHttp().getRequest().case,
)
