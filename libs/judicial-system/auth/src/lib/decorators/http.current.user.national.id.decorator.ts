import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CurrentHttpUserNationalId = createParamDecorator(
  (data, context: ExecutionContext): string =>
    context.switchToHttp().getRequest().user?.currentUserNationalId,
)
