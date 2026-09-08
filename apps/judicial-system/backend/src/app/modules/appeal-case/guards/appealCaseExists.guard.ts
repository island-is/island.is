import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Case } from '../../repository'

@Injectable()
export class AppealCaseExistsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    const appealCaseId = request.params.appealCaseId

    if (!appealCaseId) {
      throw new BadRequestException('Missing appeal case id')
    }

    // The case's three appeal associations: the case-level ruling appeal, the verdict appeal -
    // also case level, told apart by appeal type - and the ruling-order appeals.
    const appealCase = [
      theCase.appealCase,
      theCase.verdictAppealCase,
      ...(theCase.rulingOrderAppealCases ?? []),
    ].find((a) => a?.id === appealCaseId)

    if (!appealCase) {
      throw new NotFoundException(
        `Appeal case ${appealCaseId} not found for case ${theCase.id}`,
      )
    }

    request.appealCase = appealCase

    return true
  }
}
