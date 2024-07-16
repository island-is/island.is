import { Auth, AuthMiddleware, type User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  FormDto,
  FriggApi,
  KeyOption,
  OrganizationModel,
  SuccessModel,
  UserModel,
} from '../../gen/fetch'

@Injectable()
export class FriggClientService {
  constructor(private readonly friggApi: FriggApi) {}

  private friggApiWithAuth = (user: User) =>
    this.friggApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getAllKeyOptions(
    user: User,
    type: string | undefined,
  ): Promise<KeyOption[]> {
    return await this.friggApiWithAuth(user).getAllKeyOptions({
      type: type,
    })
  }

  async getKeyOptionsTypes(user: User): Promise<string[]> {
    return await this.friggApiWithAuth(user).getKeyOptionsTypes()
  }

  async getAllSchoolsByMunicipality(user: User): Promise<OrganizationModel[]> {
    return await this.friggApiWithAuth(user).getAllSchoolsByMunicipality()
  }

  async getUserById(user: User, childNationalId: string): Promise<UserModel> {
    return await this.friggApiWithAuth(user).getUserBySourcedId({
      nationalId: childNationalId,
    })
  }

  sendApplication(user: User, form: FormDto): Promise<SuccessModel> {
    return this.friggApiWithAuth(user).submitForm({ formDto: form })
  }
}
