import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { getNationalIdFromToken } from './tokenUtils'

export const NationalId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return getNationalIdFromToken(ctx)
  },
)
