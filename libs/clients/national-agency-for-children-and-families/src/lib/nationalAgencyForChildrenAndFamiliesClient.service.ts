import { Auth, AuthMiddleware, type User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  DetailedDropDownDto,
  DropDownDto,
  ExternalCategoryResponse,
  ExternalDropdownApi,
  ExternalNotifierRoleSubTypeResponse,
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

  async getChildSafetyLevels(user: User): Promise<DetailedDropDownDto[]> {
    return await this.externalDropdownApiWithAuth(
      user,
    ).externalChildSafetyLevels()
  }

  async getPostalCodes(user: User): Promise<DropDownDto[]> {
    return await this.externalDropdownApiWithAuth(user).externalPostalCodes()
  }

  async getPronouns(user: User): Promise<DropDownDto[]> {
    return await this.externalDropdownApiWithAuth(user).externalPronouns()
  }

  async getDisabilityStatuses(user: User): Promise<DropDownDto[]> {
    return await this.externalDropdownApiWithAuth(
      user,
    ).externalDisabilityStatuses()
  }

  async getChildUnknownNationalIdStates(user: User): Promise<DropDownDto[]> {
    return await this.externalDropdownApiWithAuth(
      user,
    ).externalChildUnknownNationalIdStates()
  }

  async getGuardianNotAwareReasons(user: User): Promise<DropDownDto[]> {
    return await this.externalDropdownApiWithAuth(
      user,
    ).externalGuardianNotAwareReasons()
  }

  async getSchoolTypes(user: User): Promise<DropDownDto[]> {
    return await this.externalDropdownApiWithAuth(user).externalSchoolTypes()
  }

  async getNotifierRoles(user: User): Promise<DropDownDto[]> {
    return await this.externalDropdownApiWithAuth(user).externalNotifierRoles()
  }

  async getNotifierRoleSubTypes(
    user: User,
  ): Promise<ExternalNotifierRoleSubTypeResponse[]> {
    return await this.externalDropdownApiWithAuth(
      user,
    ).externalNotifierRoleSubTypes()
  }
}
