import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { CourtSession } from '../../repository'

export const CurrentCourtSession = createParamDecorator(
  (data, context: ExecutionContext): CourtSession =>
    context.switchToHttp().getRequest().courtSession,
)
