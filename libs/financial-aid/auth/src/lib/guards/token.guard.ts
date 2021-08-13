import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common'

export const SECRET_TOKEN = 'SECRET_TOKEN'

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    @Inject(SECRET_TOKEN)
    private secretToken: string,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    if (`Bearer ${this.secretToken}` !== request.headers['authorization']) {
      throw new UnauthorizedException('Unauthorized')
    }

    return true
  }
}
