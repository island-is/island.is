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
    return await this.friggApiWithAuth(user).getTypes()

  }

  async getAllSchoolsByMunicipality(user: User): Promise<OrganizationModel[]> {
    return await this.friggApiWithAuth(user).getAllSchoolsByMunicipality()
  }

  async getUserById(user: User, ): Promise<UserModel> {

      // TODO: use childs nationalid
      return await this.friggApiWithAuth(user).getUserBySourcedId({
        nationalId: user.nationalId,
      })
   
  }
}
