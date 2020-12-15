import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { getNationalIdFromToken } from '../utils/tokenUtils'

export const NationalId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return getNationalIdFromToken(ctx)
  },
)
