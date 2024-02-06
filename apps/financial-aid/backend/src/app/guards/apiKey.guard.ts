import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { ApiUserService } from '../modules/municipalityApiUsers/user.service'

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private userService: ApiUserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    // const user = await this.userService.findByApiKey(request.headers['api-key'])
    const user = await this.userService.findByMunicipalityCodeAndApiKey(
      request.headers['api-key'],
      request.headers['municipality-code'],
    )

    if (!user) {
      return false
    }

    request.municipalityCode = user.municipalityCode

    return true
  }
}
