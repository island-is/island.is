import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Case } from '../../repository'
import { AppealVerdictService } from '../appealVerdict.service'

@Injectable()
export class AppealVerdictExistsGuard implements CanActivate {
  constructor(private readonly appealVerdictService: AppealVerdictService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const appealVerdictId = request.params.appealVerdictId
    const theCase = request.case as Case | undefined

    if (!appealVerdictId) {
      throw new BadRequestException('Missing appeal verdict id')
    }

    const appealVerdict =
      theCase?.defendants
        ?.flatMap((defendant) => defendant.appealVerdicts ?? [])
        .find((row) => row.id === appealVerdictId) ??
      (await this.appealVerdictService.findById(appealVerdictId))

    if (!appealVerdict) {
      throw new NotFoundException(
        `Appeal verdict ${appealVerdictId} does not exist`,
      )
    }

    if (theCase && appealVerdict.caseId !== theCase.id) {
      throw new BadRequestException(
        `Appeal verdict ${appealVerdictId} does not belong to case ${theCase.id}`,
      )
    }

    request.appealVerdict = appealVerdict

    return true
  }
}
