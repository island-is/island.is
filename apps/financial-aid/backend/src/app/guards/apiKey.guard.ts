import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { UserService } from '../modules/municipalityApiUsers/user.service'

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = await this.userService.findByApiKey(request.headers['api-key'])

    if (!user) {
      return false
    }

    request.municipalityCode = user.municipalityCode

    return true
  }
}
