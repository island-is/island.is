import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { Subpoena } from '../../repository'

export const CurrentSubpoena = createParamDecorator(
  (data: unknown, context: ExecutionContext): Subpoena => {
    const ctx = context.getArgByIndex(1)
    return ctx?.req?.subpoena
  },
)
