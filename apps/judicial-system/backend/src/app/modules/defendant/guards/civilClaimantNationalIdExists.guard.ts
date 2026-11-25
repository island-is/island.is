import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Case } from '../../repository'

@Injectable()
export class CivilClaimantNationalIdExistsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    if (!theCase) {
      throw new BadRequestException('Missing case')
    }

    const civilClaimantNationalId = request.params.civilClaimantNationalId

    if (!civilClaimantNationalId) {
      throw new BadRequestException('Missing civil claimant national id')
    }

    const normalizedNationalId = civilClaimantNationalId.replace(/-/g, '')

    const civilClaimant = theCase.civilClaimants?.find(
      (claimant) => claimant.nationalId === normalizedNationalId,
    )

    if (!civilClaimant) {
      throw new NotFoundException(
        `Civil claimant with given national id of case ${theCase.id} does not exist`,
      )
    }

    request.civilClaimant = civilClaimant

    return true
  }
}
