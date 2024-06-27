import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware, type User } from '@island.is/auth-nest-tools'
import {
  KeyOption,
  FriggApi,
  OrganizationModel,
  UserModel,
} from '../../gen/fetch'

@Injectable()
export class FriggClientService {
  constructor(
    private readonly friggApi: FriggApi,

  ) {}

  private friggApiWithAuth = (user: User) =>
    this.friggApi.withMiddleware(
      new AuthMiddleware(user as Auth),
    )


  async getAllKeyOptions(
    user: User,
    type: string | undefined,
  ): Promise<KeyOption[]> {
    return await this.friggApiWithAuth(user).getAllKeyOptions({
      type: type,
    })
  }

  async getTypes(user: User): Promise<string[]> {
    // this.friggApiWithAuth(user).getTypes()
    const t = await this.friggApiWithAuth(user).getTypes()
    return t
  }

  async getAllSchoolsByMunicipality(user: User): Promise<OrganizationModel[]> {
    return this.friggApiWithAuth(user).getAllSchoolsByMunicipality()
  }

  async getUserById(user: User): Promise<UserModel> {
    console.log('getUserById')
    try {
      return this.friggApiWithAuth(user).getUserBySourcedId({
        nationalId: '1111111119',
      })
    } catch (error) {
      console.log('error', error)
      throw error
    }
  }
}
