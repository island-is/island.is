import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

import { type ConfigType } from '@island.is/nest/config'

import { sharedAuthModuleConfig } from '../auth.config'

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    @Inject(sharedAuthModuleConfig.KEY)
    private readonly config: ConfigType<typeof sharedAuthModuleConfig>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    if (
      `Bearer ${this.config.secretToken}` !== request.headers['authorization']
    ) {
      throw new UnauthorizedException('Unauthorized')
    }

    return true
  }
}
