import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common'

import { RestrictedCaseService } from '../restrictedCase.service'

@Injectable()
export class RestrictedCaseExistsGuard implements CanActivate {
  constructor(private restrictedCaseService: RestrictedCaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const user = request.user

    if (!user) {
      throw new InternalServerErrorException('Missing user')
    }

    const caseId = request.params.caseId

    if (!caseId) {
      throw new BadRequestException('Missing case id')
    }

    request.case = await this.restrictedCaseService.findById(caseId)

    return true
  }
}
