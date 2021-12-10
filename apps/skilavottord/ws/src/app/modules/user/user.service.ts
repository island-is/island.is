import { Injectable } from '@nestjs/common'

import { AccessControlService } from '../accessControl'
import { Role } from '../auth'
import type { AuthUser } from '../auth'
import { User } from './user.model'

@Injectable()
export class UserService {
  constructor(private accessControlService: AccessControlService) {}

  async getUser(user: AuthUser): Promise<User> {
    // TODO check this out
    if (!user) {
      return null
    }
    const accessControl = await this.accessControlService.findOne(
      user.nationalId,
    )
    if (accessControl) {
      return { ...user, ...accessControl } as User
    }
    return { ...user, role: Role.citizen }
  }
}
