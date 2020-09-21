import { Injectable } from '@nestjs/common'

import { AuthUser } from '../auth/auth.types'
import { User, UserRole } from './user.types'

@Injectable()
export class UserService {
  private readonly users: User[]

  constructor() {
    this.users = [
      {
        nationalId: '2510654469',
        name: 'Guðjón Guðjónsson',
        roles: [UserRole.PROSECUTOR],
      },
      {
        nationalId: '1112902539',
        name: 'Ívar Oddsson',
        roles: [UserRole.JUDGE],
      },
      {
        nationalId: '2408783999',
        name: 'Baldur Kristjánsson',
        roles: [UserRole.PROSECUTOR, UserRole.JUDGE],
      },
    ]
  }

  async findByNationalId(authUser: AuthUser): Promise<User | undefined> {
    return this.users.find((user) => user.nationalId === authUser?.nationalId)
  }
}
