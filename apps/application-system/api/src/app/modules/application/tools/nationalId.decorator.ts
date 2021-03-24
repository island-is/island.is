import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { getNationalIdFromToken } from '../utils/tokenUtils'

export const NationalId = createParamDecorator((_, ctx: ExecutionContext) =>
  getNationalIdFromToken(ctx),
)
