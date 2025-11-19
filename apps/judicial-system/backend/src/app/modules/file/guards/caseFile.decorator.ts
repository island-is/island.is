import { createParamDecorator } from '@nestjs/common'

import { CaseFile } from '../../repository'

export const CurrentCaseFile = createParamDecorator(
  (data, { args: [_1, { req }] }): CaseFile => req.caseFile,
)
