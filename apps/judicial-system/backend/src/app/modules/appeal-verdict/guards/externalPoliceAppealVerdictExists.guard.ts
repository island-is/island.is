import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { AppealVerdictService } from '../appealVerdict.service'

@Injectable()
export class ExternalPoliceAppealVerdictExistsGuard implements CanActivate {
  constructor(private readonly appealVerdictService: AppealVerdictService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const policeDocumentId = request.params.policeDocumentId

    if (!policeDocumentId) {
      throw new BadRequestException('Missing police document id')
    }

    const appealVerdict =
      await this.appealVerdictService.findByExternalPoliceDocumentId(
        policeDocumentId,
      )

    if (!appealVerdict) {
      throw new NotFoundException(
        `Appeal verdict with police document id ${policeDocumentId} does not exist`,
      )
    }

    request.appealVerdict = appealVerdict
    request.params.caseId = appealVerdict.caseId

    return true
  }
}
