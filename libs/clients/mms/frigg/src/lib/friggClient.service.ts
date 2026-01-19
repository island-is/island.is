import { Auth, AuthMiddleware, type User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  FormSubmitSuccessModel,
  FriggApi,
  GetOrganizationsByTypeRequest,
  KeyOption,
  OrganizationModel,
  RegistrationApplicationInput,
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

  async getOrganizationsByType(
    user: User,
    input?: GetOrganizationsByTypeRequest,
  ): Promise<OrganizationModel[]> {
    return await this.friggApiWithAuth(user).getOrganizationsByType({
      type: input?.type,
      municipalityCode: input?.municipalityCode,
      gradeLevels: input?.gradeLevels,
      limit: 1000, // Frigg is restricting to 100 by default
    })
  }

  async getUserById(
    user: User,
    childNationalId: string,
  ): Promise<UserModel | { nationalId: string }> {
    try {
      return await this.friggApiWithAuth(user).getUserBySourcedId({
        nationalId: childNationalId,
      })
    } catch (error) {
      // If the student is not found in Frigg
      if (
        error?.status === 404 &&
        error?.body?.message === 'Student not found'
      ) {
        return { nationalId: childNationalId }
      }
      throw error
    }
  }

  async getPreferredSchool(
    user: User,
    childNationalId: string,
  ): Promise<OrganizationModel | null> {
    try {
      return await this.friggApiWithAuth(user).getPreferredSchools({
        nationalId: childNationalId,
      })
    } catch (error) {
      // If no preferred school for the selected child found in Frigg
      if (
        error?.status === 404 &&
        error?.body?.message === 'Recommended school not found'
      ) {
        return null
      }
      throw error
    }
  }

  sendApplication(
    user: User,
    form: RegistrationApplicationInput,
  ): Promise<FormSubmitSuccessModel> {
    return this.friggApiWithAuth(user).submitForm({
      registrationApplicationInput: form,
    })
  }
}
