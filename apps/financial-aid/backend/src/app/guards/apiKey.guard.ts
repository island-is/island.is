import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common'
import { ApiUserService } from '../modules/municipalityApiUsers/user.service'

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private userService: ApiUserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const apiKey = request.headers['api-key']
    const municipalityCode = request.headers['municipality-code']

    if (!apiKey && !municipalityCode) {
      throw new BadRequestException('API-Key and Municipality-Code are missing')
    }
    if (!apiKey) {
      throw new BadRequestException('API-Key is missing')
    }
    if (!municipalityCode) {
      throw new BadRequestException('Municipality-Code is missing')
    }

    const user = await this.userService.findByMunicipalityCodeAndApiKey(
      apiKey,
      municipalityCode,
    )

    if (!user) {
      return false
    }

    request.municipalityCode = user.municipalityCode

    return true
  }
}
