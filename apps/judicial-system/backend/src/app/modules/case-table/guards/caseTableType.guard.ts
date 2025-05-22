import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  CaseTableType,
  getCaseTableGroups,
  User,
} from '@island.is/judicial-system/types'

@Injectable()
// Used for more complex cases than just whether a role can perform a
// transition overall, which is handled in the transition roles rules
export class CaseTableTypeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const user: User = request.user?.currentUser

    // This shouldn't happen
    if (!user) {
      throw new InternalServerErrorException('Missing user')
    }

    const tableType: CaseTableType = request.query.type

    if (!tableType) {
      throw new InternalServerErrorException('Missing case table type')
    }

    const caseTableGroups = getCaseTableGroups(user)

    if (
      !caseTableGroups.some((group) =>
        group.tables.some((table) => table.type === tableType),
      )
    ) {
      throw new ForbiddenException('Forbidden table type')
    }

    return true
  }
}
