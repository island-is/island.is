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

  async getCategories(): Promise<ExternalCategoryResponse[]> {
    return this.externalDropdownApi.externalCategories()
  }

  async getProtectiveFactors(): Promise<ProtectiveFactorSectionDto[]> {
    return this.externalDropdownApi.externalProtectiveFactors()
  }

  async getGenders(): Promise<DropDownDto[]> {
    return this.externalDropdownApi.externalGenders()
  }

  async getChildSafetyLevels(): Promise<DetailedDropDownDto[]> {
    return this.externalDropdownApi.externalChildSafetyLevels()
  }

  async getPostalCodes(): Promise<DropDownDto[]> {
    return this.externalDropdownApi.externalPostalCodes()
  }

  async getPronouns(): Promise<DropDownDto[]> {
    return this.externalDropdownApi.externalPronouns()
  }

  async getDisabilityStatuses(): Promise<DropDownDto[]> {
    return this.externalDropdownApi.externalDisabilityStatuses()
  }

  async getChildUnknownNationalIdStates(): Promise<DropDownDto[]> {
    return this.externalDropdownApi.externalChildUnknownNationalIdStates()
  }

  async getGuardianNotAwareReasons(): Promise<DropDownDto[]> {
    return this.externalDropdownApi.externalGuardianNotAwareReasons()
  }

  async getSchoolTypes(): Promise<DropDownDto[]> {
    return this.externalDropdownApi.externalSchoolTypes()
  }

  async getNotifierRoles(): Promise<DropDownDto[]> {
    return this.externalDropdownApi.externalNotifierRoles()
  }

  async getNotifierRoleSubTypes(): Promise<
    ExternalNotifierRoleSubTypeResponse[]
  > {
    return this.externalDropdownApi.externalNotifierRoleSubTypes()
  }
}
