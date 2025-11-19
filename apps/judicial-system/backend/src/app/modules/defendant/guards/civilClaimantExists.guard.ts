import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Case } from '../../repository'

@Injectable()
export class CivilClaimantExistsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    if (!theCase) {
      throw new BadRequestException('Missing case')
    }

    const civilClaimantId = request.params.civilClaimantId

    if (!civilClaimantId) {
      throw new BadRequestException('Missing civil claimant id')
    }

    const civilClaimant = theCase.civilClaimants?.find(
      (civilClaimants) => civilClaimants.id === civilClaimantId,
    )

    if (!civilClaimant) {
      throw new NotFoundException(
        `Civil claimant ${civilClaimantId} of case ${theCase.id} does not exist`,
      )
    }

    request.civilClaimant = civilClaimant

    return true
  }
}
