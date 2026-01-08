import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Case } from '../../repository'

@Injectable()
// This guard checks for defendants in both the main case and any split cases
export class SplitDefendantExistsGuard implements CanActivate {
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

    const allDefendants = theCase.defendants ?? []

    for (const splitCase of theCase.splitCases ?? []) {
      allDefendants.push(...(splitCase.defendants ?? []))
    }

    const defendant = allDefendants.find(
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
