import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { Subpoena } from '../../repository'

export const CurrentSubpoena = createParamDecorator(
  (data, context: ExecutionContext): Subpoena =>
    context.switchToHttp().getRequest().subpoena,
)
