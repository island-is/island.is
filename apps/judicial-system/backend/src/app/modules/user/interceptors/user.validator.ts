import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import { isCoreUser } from '@island.is/judicial-system/types'

import { InstitutionService } from '../../institution'

@Injectable()
export class UserValidator implements NestInterceptor {
  constructor(private readonly institutionService: InstitutionService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest()
    const user = request.body

    const institution = await this.institutionService
      .getById(user.institutionId)
      .catch((error) => {
        throw new BadRequestException(error, 'Not a valid user')
      })

    if (!isCoreUser({ ...user, institution })) {
      throw new BadRequestException('Not a valid user')
    }

    return next.handle()
  }
}
