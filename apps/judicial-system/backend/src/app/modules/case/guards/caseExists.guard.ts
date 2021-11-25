import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'

import { CaseService } from '../case.service'

@Injectable()
export class CaseExistsGuard implements CanActivate {
  constructor(private caseService: CaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const caseId = request.params.caseId

    if (!caseId) {
      throw new BadRequestException('Missing case id')
    }

    const theCase = await this.caseService.findById(caseId)

    if (!theCase) {
      throw new NotFoundException(`Case ${caseId} does not exist`)
    }

    request.case = theCase

    return true
  }
}
