import {
  Injectable,
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common'

import { completedCaseStates } from '@island.is/judicial-system/types'

@Injectable()
export class CaseCompletedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase = request.case

    // TODO REMOVE
    if (theCase.id === 'be668e24-e7fe-4ffb-bd24-b915eedfe5c1') {
      return true
    }

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    if (!completedCaseStates.includes(theCase.state)) {
      throw new ForbiddenException('Forbidden for uncompleted cases')
    }

    return true
  }
}
