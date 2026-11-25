import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { AppealCourtSession } from '../../repository'

export const CurrentAppealCourtSession = createParamDecorator(
  (data, context: ExecutionContext): AppealCourtSession =>
    context.switchToHttp().getRequest().appealCourtSession,
)
