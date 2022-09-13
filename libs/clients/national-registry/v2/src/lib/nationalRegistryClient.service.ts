import { Injectable } from '@nestjs/common'

import { AuthMiddleware, User, Auth } from '@island.is/auth-nest-tools'

import { ApiResponse, EinstaklingarApi } from '../../gen/fetch'
import { formatIndividualDto, IndividualDto } from './types/individual.dto'
import {
  CohabitationDto,
  formatCohabitationDto,
} from './types/cohabitation.dto'
import {
  formatResidenceHistoryEntryDto,
  ResidenceHistoryEntryDto,
} from './types/residence-history-entry.dto'
import { FamilyDto, formatFamilyDto } from './types/family.dto'
import { BirthplaceDto, formatBirthplaceDto } from './types/birthplace.dto'
import { CitizenshipDto, formatCitizenshipDto } from './types/citizenship.dto'

@Injectable()
export class NationalRegistryClientService {
  constructor(private individualApi: EinstaklingarApi) {}

  async getIndividual(nationalId: string): Promise<IndividualDto | null> {
    const individual = await this.handleModernMissingData(
      this.individualApi.einstaklingarGetEinstaklingurRaw({
        id: nationalId,
      }),
    )

    return formatIndividualDto(individual)
  }

  async getCustodyChildren(parentUser: User): Promise<string[]> {
    const response = await this.handleLegacyMissingData(
      this.individualApi
        .withMiddleware(new AuthMiddleware(parentUser))
        .einstaklingarGetForsjaRaw({ id: parentUser.nationalId }),
    )
    return response || []
  }

  async getOtherCustodyParents(
    parentUser: User,
    childId: string,
  ): Promise<string[]> {
    const response = await this.handleLegacyMissingData(
      this.individualApi
        .withMiddleware(new AuthMiddleware(parentUser))
        .einstaklingarGetForsjaForeldriRaw({
          id: parentUser.nationalId,
          barn: childId,
        }),
    )
    return response || []
  }

  async getCohabitationInfo(
    nationalId: string,
  ): Promise<CohabitationDto | null> {
    const response = await this.handleLegacyMissingData(
      this.individualApi.einstaklingarGetHjuskapurRaw({
        id: nationalId,
      }),
    )
    return formatCohabitationDto(response)
  }

  async getResidenceHistory(
    nationalId: string,
  ): Promise<ResidenceHistoryEntryDto[]> {
    const residenceHistory = await this.handleLegacyMissingData(
      this.individualApi.einstaklingarGetBusetaRaw({ id: nationalId }),
    )
    return (residenceHistory || []).map(formatResidenceHistoryEntryDto)
  }

  async getFamily(nationalId: string): Promise<FamilyDto | null> {
    const family = await this.handleLegacyMissingData(
      this.individualApi.einstaklingarGetFjolskyldumedlimirRaw({
        id: nationalId,
      }),
    )
    return formatFamilyDto(family)
  }

  async getBirthplace(nationalId: string): Promise<BirthplaceDto | null> {
    const birthplace = await this.handleLegacyMissingData(
      this.individualApi.einstaklingarGetFaedingarstadurRaw({ id: nationalId }),
    )
    return formatBirthplaceDto(birthplace)
  }

  async getCitizenship(nationalId: string): Promise<CitizenshipDto | null> {
    const citizenship = await this.handleLegacyMissingData(
      this.individualApi.einstaklingarGetRikisfangRaw({ id: nationalId }),
    )
    return formatCitizenshipDto(citizenship)
  }

  private async handleLegacyMissingData<T>(
    promise: Promise<ApiResponse<T>>,
  ): Promise<T | null> {
    const response = await promise
    // Need to handle some legacy status codes. As of 2022-09-09:
    if (
      response.raw.status === 204 || // Future compatible.
      response.raw.status === 400 || // /forsja and other endpoints in development.
      response.raw.status === 404 //    /forsja in production at least.
    ) {
      return null
    }
    return response.value()
  }

  private async handleModernMissingData<T>(
    promise: Promise<ApiResponse<T>>,
  ): Promise<T | null> {
    const response = await promise
    if (response.raw.status === 204) {
      return null
    }
    return response.value()
  }

  withManualAuth(auth: Auth): NationalRegistryClientService {
    return new NationalRegistryClientService(
      this.individualApi.withMiddleware(new AuthMiddleware(auth)),
    )
  }
}
