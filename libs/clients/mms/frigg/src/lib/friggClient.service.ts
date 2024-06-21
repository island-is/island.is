import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware, type User } from '@island.is/auth-nest-tools'
import {
  KeyOption,
  KeyOptionsManagementApi,
  DefaultApi,
  UsersManagementApi,
  SchoolsManagementApi,
  OrganizationModel,
  UserModel,
} from '../../gen/fetch'

@Injectable()
export class FriggClientService {
  constructor(
    private readonly keyOptionsManagementApi: KeyOptionsManagementApi,
    private readonly defaultApi: DefaultApi,
    private readonly usersManagementApi: UsersManagementApi,
    private readonly schoolsManagementApi: SchoolsManagementApi,
  ) {}

  private keyOptionsManagementApiWithAuth = (user: User) =>
    this.keyOptionsManagementApi.withMiddleware(
      new AuthMiddleware(user as Auth),
    )

  private defaultApiWithAuth = (user: User) =>
    this.defaultApi.withMiddleware(new AuthMiddleware(user as Auth))

  private usersManagementApiWithAuth = (user: User) =>
    this.usersManagementApi.withMiddleware(new AuthMiddleware(user as Auth))

  private schoolsManagementApiWithAuth = (user: User) =>
    this.schoolsManagementApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getHealth(user: User): Promise<void> {
    return this.defaultApiWithAuth(user).health()
  }

  async getAllKeyOptions(
    user: User,
    type: string | undefined,
  ): Promise<KeyOption[]> {
    return this.keyOptionsManagementApiWithAuth(user).getAllKeyOptions({
      type: type,
    })
  }

  async getTypes(user: User): Promise<void> {
    return this.keyOptionsManagementApiWithAuth(user).getTypes()
  }

  async getAllSchoolsByMunicipality(user: User): Promise<OrganizationModel[]> {
    return this.schoolsManagementApiWithAuth(user).getAllSchoolsByMunicipality()
  }

  async getUserById(user: User): Promise<UserModel> {
    return this.usersManagementApiWithAuth(user).getUserBySourcedId({
      nationalId: user.nationalId,
    })
  }
}
