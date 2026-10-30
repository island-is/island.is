import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { CaseFile } from '../../repository'

export const CurrentCaseFile = createParamDecorator(
  (data, context: ExecutionContext): CaseFile =>
    context.switchToHttp().getRequest().caseFile,
)
