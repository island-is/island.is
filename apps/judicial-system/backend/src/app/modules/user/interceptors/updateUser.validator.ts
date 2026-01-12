import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common'

import {
  getAdminUserInstitutionScope,
  User,
} from '@island.is/judicial-system/types'

import { UserService } from '../user.service'

@Injectable()
export class UpdateUserValidator implements NestInterceptor {
  constructor(private readonly userService: UserService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest()

    const user: User = request.user?.currentUser

    if (!user) {
      throw new BadRequestException('Missing user')
    }

    const userId = request.params.userId

    if (!userId) {
      throw new BadRequestException('Missing user id')
    }

    const userToUpdate = await this.userService.findById(userId)

    if (
      userToUpdate.role === user.role ||
      !userToUpdate.institution ||
      !getAdminUserInstitutionScope(user).includes(
        userToUpdate.institution.type,
      )
    ) {
      throw new UnauthorizedException(
        `User ${user.id} is not allowed to update user ${userToUpdate.id}`,
      )
    }

    return next.handle()
  }
}
