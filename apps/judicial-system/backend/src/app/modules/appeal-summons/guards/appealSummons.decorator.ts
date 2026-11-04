import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import {
  AppealSummons,
  AppealSummonsServiceRecipient,
} from '../../repository'

export const CurrentAppealSummons = createParamDecorator(
  (data, context: ExecutionContext): AppealSummons =>
    context.switchToHttp().getRequest().appealSummons,
)

export const CurrentAppealSummonsService = createParamDecorator(
  (data, context: ExecutionContext): AppealSummonsServiceRecipient =>
    context.switchToHttp().getRequest().appealSummonsService,
)
