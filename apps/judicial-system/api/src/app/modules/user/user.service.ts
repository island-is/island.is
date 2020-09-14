import { Injectable } from '@nestjs/common'

import { User, UserRole } from './user.types'

@Injectable()
export class UserService {
  private readonly users: User[]

  constructor() {
    this.users = [
      {
        nationalId: '2510654469',
        roles: [UserRole.PROCECUTOR, UserRole.JUDGE],
      },
      {
        nationalId: '1112902539',
        roles: [UserRole.PROCECUTOR, UserRole.JUDGE],
      },
    ]
  }

  async findByNationalId(nationalId: string): Promise<User | undefined> {
    return this.users.find((user) => user.nationalId === nationalId)
  }
}
