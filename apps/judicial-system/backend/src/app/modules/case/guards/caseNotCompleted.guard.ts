import {
  Injectable,
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common'

import { completedCaseStates } from '@island.is/judicial-system/types'
import { CaseService } from '../case.service'
import { Case } from '../models'

@Injectable()
export class CaseNotCompletedGuard implements CanActivate {
  constructor(private caseService: CaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    if (completedCaseStates.includes(theCase.state)) {
      throw new ForbiddenException('Forbidden for completed cases')
    }

    return true
  }
}
