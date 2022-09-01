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
import { FamilyDto, formatFamilyDto } from './types/family'

@Injectable()
export class NationalRegistryClientService {
  constructor(private individualApi: EinstaklingarApi) {}

  async getIndividual(nationalId: string): Promise<IndividualDto | null> {
    const individual = await this.handleIgnoredResponses(
      this.individualApi.einstaklingarGetEinstaklingurRaw({
        id: nationalId,
      }),
    )

    return formatIndividualDto(individual)
  }

  async getCustodyChildren(parentUser: User): Promise<string[]> {
    const response = await this.handleIgnoredResponses(
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
    const response = await this.handleIgnoredResponses(
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
    const response = await this.handleIgnoredResponses(
      this.individualApi.einstaklingarGetHjuskapurRaw({
        id: nationalId,
      }),
    )
    return formatCohabitationDto(response)
  }

  async getResidenceHistory(
    nationalId: string,
  ): Promise<ResidenceHistoryEntryDto[]> {
    const residenceHistory = await this.handleIgnoredResponses(
      this.individualApi.einstaklingarGetBusetaRaw({ id: nationalId }),
    )
    return (residenceHistory || []).map(formatResidenceHistoryEntryDto)
  }

  async getFamily(nationalId: string): Promise<FamilyDto | null> {
    const family = await this.handleIgnoredResponses(
      this.individualApi.einstaklingarGetFjolskyldumedlimirRaw({
        id: nationalId,
      }),
    )
    return formatFamilyDto(family)
  }

  private async handleIgnoredResponses<T>(
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
