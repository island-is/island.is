import { Auth, AuthMiddleware, type User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  FormDto,
  FriggApi,
  KeyOption,
  OrganizationModel,
  FormSubmitSuccessModel,
  UserModel,
} from '../../gen/fetch'
import { handle404 } from '@island.is/clients/middlewares'

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

  async getUserById(
    user: User,
    childNationalId: string,
  ): Promise<UserModel | null> {
    return await this.friggApiWithAuth(user)
      .getUserBySourcedId({
        nationalId: childNationalId,
      })
      .catch(handle404)
  }

  sendApplication(user: User, form: FormDto): Promise<FormSubmitSuccessModel> {
    return this.friggApiWithAuth(user).submitForm({ formDto: form })
  }
}
