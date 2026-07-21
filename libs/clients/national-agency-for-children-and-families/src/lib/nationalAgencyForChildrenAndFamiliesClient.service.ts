import { Auth, AuthMiddleware, type User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  DetailedDropDownDto,
  DropDownDto,
  ExternalCategoryResponse,
  ExternalDropdownApi,
  ProtectiveFactorSectionDto,
} from '../../gen/fetch'

@Injectable()
export class NationalAgencyForChildrenAndFamiliesClientService {
  constructor(private readonly externalDropdownApi: ExternalDropdownApi) {}

  private externalDropdownApiWithAuth = (user: User) =>
    this.externalDropdownApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getCategories(user: User): Promise<ExternalCategoryResponse[]> {
    return await this.externalDropdownApiWithAuth(user).externalCategories()
  }

  async getProtectiveFactors(
    user: User,
  ): Promise<ProtectiveFactorSectionDto[]> {
    return await this.externalDropdownApiWithAuth(
      user,
    ).externalProtectiveFactors()
  }

  async getGenders(user: User): Promise<DropDownDto[]> {
    return await this.externalDropdownApiWithAuth(user).externalGenders()
  }

  async getUrgencyAssessments(user: User): Promise<DetailedDropDownDto[]> {
    return await this.externalDropdownApiWithAuth(
      user,
    ).externalUrgencyAssessments()
  }

  async getPostalCodes(user: User): Promise<DropDownDto[]> {
    return await this.externalDropdownApiWithAuth(user).externalPostalCodes()
  }
}
