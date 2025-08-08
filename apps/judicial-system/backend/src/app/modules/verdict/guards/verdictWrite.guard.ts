import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'

import { canUserEditVerdict } from '../filters/verdict.filter'

@Injectable()
export class VerdictWriteGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const user = request.user?.currentUser

    if (!user) {
      throw new BadRequestException('Missing user')
    }

    const theCase = request.case

    if (!theCase) {
      throw new BadRequestException('Missing case')
    }

    return canUserEditVerdict(theCase, user)
  }
}
