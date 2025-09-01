import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import { isAdminUser, User as TUser } from '@island.is/judicial-system/types'

import { EventLogService } from '../../event-log'
import { User } from '../../repository'

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(private readonly eventLogService: EventLogService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest()
    const user: TUser = request.user?.currentUser

    return next.handle().pipe(
      map(async (users: User[]) =>
        isAdminUser(user)
          ? this.eventLogService
              .loginMap(users.map((user) => user.nationalId))
              .then((map) =>
                users.map((user: User) => {
                  const log = map.get(
                    `${user.nationalId}-${user.role}-${user.institution?.name}`,
                  )

                  return {
                    id: user.id,
                    created: user.created,
                    modified: user.modified,
                    nationalId: user.nationalId,
                    name: user.name,
                    title: user.title,
                    mobileNumber: user.mobileNumber,
                    email: user.email,
                    role: user.role,
                    institution: user.institution,
                    active: user.active,
                    canConfirmIndictment: user.canConfirmIndictment,
                    latestLogin: log?.latest,
                    loginCount: log?.count,
                  }
                }),
              )
          : users,
      ),
    )
  }
}
