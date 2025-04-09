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
export class CreateUserValidator implements NestInterceptor {
  constructor(private readonly institutionService: InstitutionService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest()
    const createUser = request.body

    const institution = await this.institutionService
      .getById(createUser.institutionId)
      .catch((error) => {
        throw new BadRequestException(error, 'Not a valid user')
      })

    if (!isCoreUser({ ...createUser, institution })) {
      throw new BadRequestException('Not a valid user')
    }

    return next.handle()
  }
}
