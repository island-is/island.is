import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { CaseState, isCompletedCase } from '@island.is/judicial-system/types'

import { Case } from '../../repository'

@Injectable()
export class CaseReceivedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    if (
      theCase.state !== CaseState.RECEIVED &&
      !isCompletedCase(theCase.state)
    ) {
      throw new ForbiddenException('Forbidden for unreceived cases')
    }

    return true
  }
}
