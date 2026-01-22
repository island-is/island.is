import { validate as isUuid } from 'uuid'

import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'

import { CaseService } from '../case.service'

@Injectable()
export class MinimalCaseExistsGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => CaseService))
    private readonly caseService: CaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const caseId = request.params.caseId

    if (!caseId) {
      throw new BadRequestException('Missing case id')
    }

    if (!isUuid(caseId)) {
      throw new BadRequestException('Invalid case id format')
    }

    request.case = await this.caseService.findMinimalById(caseId)

    return true
  }
}
