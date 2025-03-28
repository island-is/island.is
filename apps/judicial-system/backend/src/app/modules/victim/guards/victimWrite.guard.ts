import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { canUserEditVictim } from '../filters/victim.filter'

@Injectable()
export class VictimWriteGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const user = request.user?.currentUser

    if (!user) {
      throw new InternalServerErrorException('Missing user')
    }

    const theCase = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    // We can also add more logic based on a specific victim if needed
    // but for now it should be enough to have certain access to the case
    // at a specific time in its process

    return canUserEditVictim(theCase, user)
  }
}
