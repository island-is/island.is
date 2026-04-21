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

    const appealCase = theCase.appealCase

    if (!appealCase || appealCase.id !== appealCaseId) {
      throw new NotFoundException(
        `Appeal case ${appealCaseId} not found for case ${theCase.id}`,
      )
    }

    request.appealCase = appealCase

    return true
  }
}
