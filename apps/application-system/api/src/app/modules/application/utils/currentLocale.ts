import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Locale } from '@island.is/shared/types'

export const getCurrentLocale = (context: ExecutionContext): Locale => {
  const request = context.switchToHttp().getRequest()

  return request.headers?.locale ?? 'is'
}

export const CurrentLocale = createParamDecorator(
  (_: unknown, context: ExecutionContext): Locale => getCurrentLocale(context),
)
