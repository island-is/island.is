import { createParamDecorator } from '@nestjs/common'

import { AppealVerdict } from '../../repository'

export const CurrentAppealVerdict = createParamDecorator(
  (_data, context): AppealVerdict => {
    const request = context.switchToHttp().getRequest()
    return request.appealVerdict
  },
)
