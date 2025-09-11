import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Case, IndictmentCount } from '../../repository'

@Injectable()
export class OffenseExistsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const theCase: Case = request.case
    const indictmentCount: IndictmentCount = request.indictmentCount

    if (!indictmentCount) {
      throw new BadRequestException('Missing indictment count')
    }

    const offenseId = request.params.offenseId
    if (!offenseId) {
      throw new BadRequestException('Missing offense count id')
    }

    const offense = indictmentCount?.offenses?.find(
      (offense) => offense.id === offenseId,
    )
    if (!offense) {
      throw new NotFoundException(
        `Offense ${offenseId} of indictment count ${indictmentCount.id} of case ${theCase.id} does not exist`,
      )
    }
    request.offense = offense
    return true
  }
}
