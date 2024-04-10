import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { DateType } from '@island.is/judicial-system/types'

import { DateLogService } from '../../date-log'
import { canUserAccessCase } from '../filters/case.filter'

@Injectable()
export class CaseWriteGuard implements CanActivate {
  constructor(private readonly dateLogService: DateLogService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const caseId = request.params.caseId

    const courtDate = await this.dateLogService.findDateTypeByCaseId(
      DateType.COURT_DATE,
      caseId,
    )

    const user = request.user

    if (!user) {
      throw new InternalServerErrorException('Missing user')
    }

    const theCase = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    if (!canUserAccessCase(theCase, user, true, courtDate?.date)) {
      throw new ForbiddenException(
        `User ${user.id} does not have write access to case ${theCase.id}`,
      )
    }

    return true
  }
}
