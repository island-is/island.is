import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'

import { VerdictService } from '../verdict.service'

@Injectable()
export class ExternalPoliceVerdictExistsGuard implements CanActivate {
  constructor(private readonly verdictService: VerdictService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const policeDocumentId = request.params.policeDocumentId

    if (!policeDocumentId) {
      throw new BadRequestException('Missing police document id')
    }

    request.verdict = await this.verdictService.findByExternalPoliceDocumentId(
      policeDocumentId,
    )
    const caseId = request.verdict.caseId
    request.params.caseId = caseId

    return true
  }
}
