import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common'

import { UserService } from '../user.service'

@Injectable()
export class UserExistsGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const userId = request.body?.userId

    if (!userId) {
      throw new BadRequestException('Missing user id')
    }

    request.user = await this.userService.findById(userId)

    return true
  }
}
