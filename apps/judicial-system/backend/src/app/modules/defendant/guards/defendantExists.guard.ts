import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'

import { Case } from '../../case'
import { DefendantService } from '../defendant.service'

@Injectable()
export class DefendantExistsGuard implements CanActivate {
  constructor(private defendantService: DefendantService) {}

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

    const defendant = theCase.defendants?.find(
      (defendant) => defendant.id === defendantId,
    )

    if (!defendant) {
      throw new NotFoundException(
        `Defendant ${defendantId} of case ${theCase.id} does not exist`,
      )
    }

    request.defendant = defendant

    return true
  }
}
