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
import { logger } from '@island.is/logging'

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
    try {
      return await this.friggApiWithAuth(user).getUserBySourcedId({
        nationalId: childNationalId,
      })
    } catch (error) {
      // If the student is not found in Frigg
      if (
        error?.status === 404 &&
        error?.body.message === 'Student not found'
      ) {
        logger.warn(
          `Student with nationalId ${childNationalId.slice(
            0,
            6,
          )} not found in Frigg`,
        )
        return { nationalId: childNationalId } as UserModel
      }
      throw error
    }
  }

  sendApplication(user: User, form: FormDto): Promise<FormSubmitSuccessModel> {
    return this.friggApiWithAuth(user).submitForm({ formDto: form })
  }
}
