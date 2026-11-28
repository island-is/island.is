import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'

import { InternalCaseService } from '../internalCase.service'
import { traceCaseLoad } from './traceCaseLoad'

@Injectable()
export class IndictmentCaseExistsForCivilClaimantGuard implements CanActivate {
  constructor(private readonly internalCaseService: InternalCaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const caseId = request.params.caseId

    if (!caseId) {
      throw new BadRequestException('Missing case id')
    }

    const civilClaimantNationalId = request.params.civilClaimantNationalId

    if (!civilClaimantNationalId) {
      throw new BadRequestException('Missing civil claimant national id')
    }

    request.case = await traceCaseLoad(
      IndictmentCaseExistsForCivilClaimantGuard.name,
      'civilClaimantIndictment',
      request,
      () =>
        this.internalCaseService.findByIdAndCivilClaimantNationalId(
          caseId,
          civilClaimantNationalId,
        ),
    )

    return true
  }
}
