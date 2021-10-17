import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common'

import type { User } from '@island.is/judicial-system/types'
import { CaseService } from '../case.service'

@Injectable()
export class CaseExistsGuard implements CanActivate {
  constructor(private caseService: CaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const user: User = request.user

    if (!user) {
      throw new InternalServerErrorException('Missing user')
    }

    const caseId = request.params.caseId

    if (!caseId) {
      throw new BadRequestException('Missing case id')
    }

    const theCase = await this.caseService.findByIdAndUser(caseId, user, false)

    request.case = theCase

    return true
  }
}
