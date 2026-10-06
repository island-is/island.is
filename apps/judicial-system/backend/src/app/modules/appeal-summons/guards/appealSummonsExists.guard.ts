import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

import { Case } from '../../repository'

@Injectable()
export class AppealSummonsExistsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    const appealSummonsId = request.params.appealSummonsId

    if (!appealSummonsId) {
      throw new BadRequestException('Missing appeal summons id')
    }

    const appealSummons = theCase.appealSummonses?.find(
      (summons) => summons.id === appealSummonsId,
    )

    if (!appealSummons) {
      throw new NotFoundException(
        `Appeal summons ${appealSummonsId} not found for case ${theCase.id}`,
      )
    }

    request.appealSummons = appealSummons

    return true
  }
}
