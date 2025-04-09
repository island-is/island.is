import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import { isCoreUser } from '@island.is/judicial-system/types'

import { UserService } from '../user.service'

@Injectable()
export class UpdateUserValidator implements NestInterceptor {
  constructor(private readonly userService: UserService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest()

    const user = await this.userService.findById(request.params.userId)

    const updatedUser = request.body

    if (!isCoreUser({ ...user, ...updatedUser })) {
      throw new BadRequestException('Not a valid user')
    }

    return next.handle()
  }
}
