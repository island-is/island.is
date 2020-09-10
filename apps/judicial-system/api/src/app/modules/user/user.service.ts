import { Injectable } from '@nestjs/common'

import { User } from './user.types'

@Injectable()
export class UserService {
  private readonly users: User[]

  constructor() {
    this.users = [
      {
        nationalId: '2510654469',
      },
      {
        nationalId: '1112902539',
      },
    ]
  }

  async findByNationalId(nationalId: string): Promise<User | undefined> {
    return this.users.find((user) => user.nationalId === nationalId)
  }
}
