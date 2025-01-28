import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'

import { InternalCaseService } from '../internalCase.service'

@Injectable()
export class IndictmentCaseExistsForDefendantGuard implements CanActivate {
  constructor(private readonly internalCaseService: InternalCaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const caseId = request.params.caseId

    if (!caseId) {
      throw new BadRequestException('Missing case id')
    }

    const defendantNationalId = request.params.defendantNationalId

    if (!defendantNationalId) {
      throw new BadRequestException('Missing defendant national id')
    }

    request.case =
      await this.internalCaseService.findByIdAndDefendantNationalId(
        caseId,
        defendantNationalId,
      )

    return true
  }
}
