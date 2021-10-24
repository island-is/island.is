import {
  Injectable,
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common'

import { completedCaseStates } from '@island.is/judicial-system/types'

import { Case } from '../models'

@Injectable()
export class CaseCompletedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    if (!completedCaseStates.includes(theCase.state)) {
      throw new ForbiddenException('Forbidden for uncompleted cases')
    }

    return true
  }
}
