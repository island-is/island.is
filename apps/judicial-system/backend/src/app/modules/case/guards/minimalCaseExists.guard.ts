// src/app/case/guards/caseExists.guard.ts
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'

import { CaseService } from '../case.service'

@Injectable()
export class MinimalCaseExistsGuard implements CanActivate {
  constructor(private readonly caseService: CaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const caseId = request.params.caseId

    if (!caseId) {
      throw new BadRequestException('Missing case id')
    }

    request.case = await this.caseService.findMinimalById(caseId)

    return true
  }
}
