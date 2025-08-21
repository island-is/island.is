import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { CaseFile } from '../models/file.model'

export const CurrentCaseFile = createParamDecorator(
  (data: unknown, context: ExecutionContext): CaseFile => {
    const ctx = context.getArgByIndex(1)
    return ctx?.req?.caseFile
  },
)
