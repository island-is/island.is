import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Case } from '../../case'

@Injectable()
export class OffenseExistsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    if (!theCase) {
      throw new BadRequestException('Missing case')
    }

    const indictmentCountId = request.params.indictmentCountId

    if (!indictmentCountId) {
      throw new BadRequestException('Missing indictment count id')
    }

    const indictmentCount = theCase.indictmentCounts?.find(
      (indictmentCount) => indictmentCount.id === indictmentCountId,
    )

    if (!indictmentCount) {
      throw new NotFoundException(
        `Indictment count ${indictmentCountId} of case ${theCase.id} does not exist`,
      )
    }

    const offenseId = request.params.offenseId

    if (!offenseId) {
      throw new BadRequestException('Missing offense id')
    }
    // TODO: add offenses to indictmentcounts on a case?

    request.indictmentCount = indictmentCount

    return true
  }
}
