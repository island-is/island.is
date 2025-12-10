import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'

import { VerdictService } from '../verdict.service'

@Injectable()
export class ValidateVerdictGuard implements CanActivate {
  constructor(private readonly verdictService: VerdictService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const verdictId = request.params.verdictId

    // If the verdictId is not provided, we don't need to validate it
    if (!verdictId) {
      return true
    }

    request.verdict = await this.verdictService.findById(verdictId)

    const theCase = request.case

    // We don't want to allow the user to access a verdict without the case being specified first
    if (!theCase) {
      throw new BadRequestException('Missing case')
    }

    if (theCase.id !== request.verdict.caseId) {
      throw new BadRequestException('Verdict does not belong to case')
    }

    return true
  }
}
