import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Case } from '../../case'

@Injectable()
export class IndictmentCountExistsGuard implements CanActivate {
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

    request.indictmentCount = indictmentCount

    return true
  }
}
