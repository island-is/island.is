import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'

import { Case } from '../../case'

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

    const normalizedAndFormatedNationalId =
      normalizeAndFormatNationalId(defendantNationalId)

    const defendant = theCase.defendants?.find(
      (defendant) =>
        defendant.nationalId &&
        normalizedAndFormatedNationalId.includes(defendant.nationalId),
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
