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
        mobileNumber: '8589030',
        roles: [UserRole.PROSECUTOR],
      },
      {
        nationalId: '1112902539',
        name: 'Ívar Oddsson',
        mobileNumber: '6904031',
        roles: [UserRole.JUDGE],
      },
      {
        nationalId: '2408783999',
        name: 'Baldur Kristjánsson',
        mobileNumber: '8949946',
        roles: [UserRole.PROSECUTOR],
      },
      {
        nationalId: '1010882949',
        name: 'Ingunn Róbertsdóttir',
        mobileNumber: '6908439',
        roles: [UserRole.PROSECUTOR, UserRole.JUDGE],
      },
      {
        nationalId: '1103862819',
        name: 'Anna Signý Guðbjörnsdóttir',
        mobileNumber: '6947640',
        roles: [UserRole.PROSECUTOR, UserRole.JUDGE],
      },
    ]
  }

  async findByNationalId(authUser: AuthUser): Promise<User | undefined> {
    return this.users.find((user) => user.nationalId === authUser?.nationalId)
  }
}
