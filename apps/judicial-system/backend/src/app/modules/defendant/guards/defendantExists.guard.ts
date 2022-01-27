import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common'

import { DefendantService } from '../defendant.service'

@Injectable()
export class DefendantExistsGuard implements CanActivate {
  constructor(private defendantService: DefendantService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const caseId = request.params.caseId

    if (!caseId) {
      throw new BadRequestException('Missing case id')
    }

    const defendantId = request.params.defendantId

    if (!defendantId) {
      throw new BadRequestException('Missing defendant id')
    }

    request.defendant = await this.defendantService.findById(
      defendantId,
      caseId,
    )

    return true
  }
}
