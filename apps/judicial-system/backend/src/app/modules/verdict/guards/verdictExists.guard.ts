import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Case } from '../../case'

@Injectable()
export class VerdictExistsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    if (!theCase) {
      throw new BadRequestException('Missing case')
    }

    const defendantId = request.params.defendantId

    if (!defendantId) {
      throw new BadRequestException('Missing defendant id')
    }

    const verdictId = request.params.verdictId

    if (!verdictId) {
      throw new BadRequestException('Missing verdict id')
    }

    const verdict = theCase.defendants?.find(
      (defendant) => defendant.verdict?.id === verdictId,
    )

    if (!verdict) {
      throw new NotFoundException(
        `Verdict ${verdict} for defendant ${defendantId} of case ${theCase.id} does not exist`,
      )
    }

    request.verdict = verdict

    return true
  }
}
