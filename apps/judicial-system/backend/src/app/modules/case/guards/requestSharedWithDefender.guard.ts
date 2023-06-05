import {
  Injectable,
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common'

@Injectable()
export class RequestSharedWithDefenderGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    if (!theCase.sendRequestToDefender) {
      throw new ForbiddenException(
        'Forbidden when request is not shared with defender',
      )
    }

    return true
  }
}
