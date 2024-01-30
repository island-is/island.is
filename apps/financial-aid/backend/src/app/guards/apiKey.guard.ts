import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { UserService } from '../modules/municipalityApiUsers/user.service'

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    console.log(request)
    const user = await this.userService.findById(request.headers['api-key'])

    if (!user) {
      return false
    }

    request.municipalityCode = user.municipalityCode

    return true
  }
}
