import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'

import { AppealSummonsService } from '../appealSummons.service'

@Injectable()
export class ExternalPoliceAppealSummonsServiceExistsGuard
  implements CanActivate
{
  constructor(private readonly appealSummonsService: AppealSummonsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const policeDocumentId = request.params.policeDocumentId

    if (!policeDocumentId) {
      throw new BadRequestException('Missing police document id')
    }

    request.appealSummonsService =
      await this.appealSummonsService.findServiceRecipientByExternalPoliceDocumentId(
        policeDocumentId,
      )

    const caseId = request.appealSummonsService.appealSummons?.caseId

    if (!caseId) {
      throw new BadRequestException(
        `Appeal summons service ${request.appealSummonsService.id} has no case id`,
      )
    }

    request.params.caseId = caseId

    return true
  }
}
