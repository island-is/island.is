import {
  Injectable,
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common'

import {
  CaseState,
  completedCaseStates,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { Case } from '../../case'

@Injectable()
export class ViewCaseFileGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const user: User = request.user

    if (!user) {
      throw new InternalServerErrorException('Missing user')
    }

    const theCase: Case = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    // Prosecutors have permission to view all case files
    if (user.role === UserRole.PROSECUTOR) {
      return true
    }

    // Judges have permission to view files of completed cases, and
    // of uncompleted received cases they have been assigned to
    if (user.role === UserRole.JUDGE) {
      if (
        completedCaseStates.includes(theCase.state) ||
        (theCase.state === CaseState.RECEIVED && user.id === theCase.judgeId)
      ) {
        return true
      }

      throw new ForbiddenException('Forbidden for judges')
    }

    // Registrars have permission to view files of completed cases
    if (user.role === UserRole.REGISTRAR) {
      if (completedCaseStates.includes(theCase.state)) {
        return true
      }

      throw new ForbiddenException('Forbidden for registrars')
    }

    // Other users do not have permission to view any case files
    throw new ForbiddenException(`Forbidden for ${user.role}`)
  }
}
