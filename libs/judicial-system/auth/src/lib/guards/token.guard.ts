import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'

@Injectable()
export class TokenGuaard implements CanActivate {
  constructor(private secretToken: string) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    if (`Bearer ${this.secretToken}` !== request.headers['authorization']) {
      throw new UnauthorizedException('Unauthorized')
    }

    return true
  }
}
