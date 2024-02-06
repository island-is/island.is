import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { ApiUserService } from '../modules/municipalityApiUsers/user.service'

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private userService: ApiUserService) {}
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
