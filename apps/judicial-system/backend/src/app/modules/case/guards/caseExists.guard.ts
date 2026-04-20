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
export class CaseExistsGuard implements CanActivate {
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

    request.case = await this.caseService.findById(caseId)

    return true
  }
}
