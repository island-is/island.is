import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CurrentHttpUserNationalId = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    const ctx = context.getArgByIndex(1)
    return ctx?.req?.user?.currentUserNationalId
  },
)
