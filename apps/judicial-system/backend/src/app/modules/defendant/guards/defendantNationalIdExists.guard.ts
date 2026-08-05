import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Case } from '../../repository'

@Injectable()
export class DefendantNationalIdExistsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    if (!theCase) {
      throw new BadRequestException('Missing case')
    }

    const defendantNationalId = request.params.defendantNationalId

    if (!defendantNationalId) {
      throw new BadRequestException('Missing defendant national id')
    }

    // defendantNationalId comes from a raw @Param, so normalize it once here
    const normalizedNationalId = defendantNationalId.replace(/-/g, '')

    const defendant = theCase.defendants?.find(
      (defendant) => defendant.nationalId === normalizedNationalId,
    )

    if (!defendant) {
      throw new NotFoundException(
        `Defendant with given national id of case ${theCase.id} does not exist`,
      )
    }

    request.defendant = defendant

    return true
  }
}
