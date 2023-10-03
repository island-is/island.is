import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'

import { LimitedAccessCaseService } from '../limitedAccessCase.service'

@Injectable()
export class LimitedAccessCaseExistsGuard implements CanActivate {
  constructor(private limitedAccessCaseService: LimitedAccessCaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const caseId = request.params.caseId

    if (!caseId) {
      throw new BadRequestException('Missing case id')
    }

    request.case = await this.limitedAccessCaseService.findById(caseId)

    return true
  }
}
