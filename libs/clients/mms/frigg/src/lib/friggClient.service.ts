import { Auth, AuthMiddleware, type User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  ApplicationInput,
  FriggApi,
  KeyOption,
  OrganizationModel,
  FormSubmitSuccessModel,
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

  async getAllSchoolsByMunicipality(user: User): Promise<OrganizationModel[]> {
    return await this.friggApiWithAuth(user).getAllSchoolsByMunicipality({})
  }

  async getUserById(user: User, childNationalId: string): Promise<UserModel> {
    return await this.friggApiWithAuth(user).getUserBySourcedId({
      nationalId: childNationalId,
    })
  }

  sendApplication(
    user: User,
    form: ApplicationInput,
  ): Promise<FormSubmitSuccessModel> {
    return this.friggApiWithAuth(user).submitForm({ applicationInput: form })
  }
}
